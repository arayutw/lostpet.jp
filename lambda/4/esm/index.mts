import { GetObjectCommand, GetObjectCommandOutput, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { CloudFrontRequest, CloudFrontRequestCallback, CloudFrontRequestEvent, Context } from "aws-lambda";
import sharp from "sharp"
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import { Readable } from 'stream';

const ENV = {
    BUCKET: "",
    HOSTNAME: "",
}

const streamToBuffer = (stream: Readable): Promise<Buffer> =>
    new Promise((resolve, reject) => {
        const chunks: Uint8Array[] = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks)));
    });

type Aspect = "a11" | "a21" | "a3245" | "a3610" | "a219" | "a169" | "a1911" | "a43" | ""
type Size = 100 | 300 | 600 | 900 | 1200 | 1500 | 1800
type Direction = "w" | "h"
type Extension = "jpg" | "png" | "webp" | "avif"
type S3Object = {
    Bucket: string
    Key: string
}
type Abort = {
    status: boolean
}
type OrderList = Array<Order>

type Order = OrderForOriginal | OrderForCommand | OrderForWebpOrAvif

type OrderForOriginal = {
    cache: number
    dist: S3Object
    extension: Extension
    index: number
    src: S3Object
}

type OrderForCommand = OrderForOriginal & {
    command: string
    method: string
    naturalWidth: number
    naturalHeight: number
    prefix: string
    suffix: string
}

type OrderForWebpOrAvif = OrderForOriginal & {
    done: boolean
    command: string
    prefix: string
    suffix: string
}

class Command {
    public readonly width: number = 0
    public readonly height: number = 0
    public readonly size: Size = 100
    public readonly aspect: Aspect = "a11"
    public readonly direction: Direction = "w"

    constructor(command: string) {
        const matches = command.match(/^(w|h)(100|300|600|900|1200|1500|1800)(a(11|21|3245|3610|219|169|1911|43))?$/);

        if (matches) {
            this.direction = matches[1] as Direction;
            this.size = parseInt(matches[2], 10) as Size;
            this.aspect = (matches[4] ? ("a" + matches[4]) : "") as Aspect;
            var property1 = "w" === this.direction ? "width" : "height";
            var property2 = "w" === this.direction ? "height" : "width";

            if (!this.aspect) {
                this[property1] = this.size;

            } else {
                switch (this.aspect.slice(1)) {
                    case "11":
                        this.width = this.height = this.size;
                        break;
                    case "21":
                        this[property1] = this.size;
                        this[property2] = this.size / 2;
                        break;
                    case "3245":
                        switch (this.size) {
                            case 100:
                                this[property1] = 160;
                                this[property2] = 225;
                                break;
                            case 300:
                                this[property1] = 320;
                                this[property2] = 450;
                                break;
                            case 600:
                                this[property1] = 640;
                                this[property2] = 900;
                                break;
                            case 900:
                                this[property1] = 960;
                                this[property2] = 1350;
                                break;
                            case 1200:
                                this[property1] = 1280;
                                this[property2] = 1800;
                                break;
                            case 1500:
                                this[property1] = 1600;
                                this[property2] = 1000;
                                break;
                            case 1800:
                                this[property1] = 1920;
                                this[property2] = 2700;
                                break;
                        }
                        break;
                    case "3610":
                        switch (this.size) {
                            case 100:
                                this[property1] = 360;
                                this[property2] = 100;
                                break;
                            case 300:
                                this[property1] = 432;
                                this[property2] = 120;
                                break;
                            case 600:
                                this[property1] = 648;
                                this[property2] = 180;
                                break;
                            case 900:
                                this[property1] = 1080;
                                this[property2] = 300;
                                break;
                            case 1200:
                                this[property1] = 1260;
                                this[property2] = 350;
                                break;
                            case 1500:
                                this[property1] = 1620;
                                this[property2] = 450;
                                break;
                            case 1800:
                                this[property1] = 1980;
                                this[property2] = 550;
                                break;
                        }
                        break;
                    case "219":
                        switch (this.size) {
                            case 100:
                                this[property1] = 210;
                                this[property2] = 90;
                                break;
                            case 300:
                                this[property1] = 350;
                                this[property2] = 150;
                                break;
                            case 600:
                                this[property1] = 630;
                                this[property2] = 270;
                                break;
                            case 900:
                                this[property1] = 980;
                                this[property2] = 420;
                                break;
                            case 1200:
                                this[property1] = 1260;
                                this[property2] = 540;
                                break;
                            case 1500:
                                this[property1] = 1540;
                                this[property2] = 660;
                                break;
                            case 1800:
                                this[property1] = 1820;
                                this[property2] = 780;
                                break;
                        }
                        break;
                    case "169":
                        switch (this.size) {
                            case 100:
                                this[property1] = 96;
                                this[property2] = 54;
                                break;
                            case 300:
                                this[property1] = 320;
                                this[property2] = 180;
                                break;
                            case 600:
                                this[property1] = 640;
                                this[property2] = 360;
                                break;
                            case 900:
                                this[property1] = 960;
                                this[property2] = 540;
                                break;
                            case 1200:
                                this[property1] = 1280;
                                this[property2] = 720;
                                break;
                            case 1500:
                                this[property1] = 1600;
                                this[property2] = 900;
                                break;
                            case 1800:
                                this[property1] = 1920;
                                this[property2] = 1080;
                                break;
                        }
                        break;
                    case "1911":
                        switch (this.size) {
                            case 100:
                                this[property1] = 191;
                                this[property2] = 100;
                                break;
                            case 300:
                                this[property1] = 320;
                                this[property2] = 168;
                                break;
                            case 600:
                                this[property1] = 640;
                                this[property2] = 335;
                                break;
                            case 900:
                                this[property1] = 960;
                                this[property2] = 502;
                                break;
                            case 1200:
                                this[property1] = 1280;
                                this[property2] = 670;
                                break;
                            case 1500:
                                this[property1] = 1600;
                                this[property2] = 838;
                                break;
                            case 1800:
                                this[property1] = 1920;
                                this[property2] = 1005;
                                break;
                        }
                        break;
                    case "43":
                        switch (this.size) {
                            case 100:
                                this[property1] = 120;
                                this[property2] = 90;
                                break;
                            case 300:
                                this[property1] = 320;
                                this[property2] = 240;
                                break;
                            case 600:
                                this[property1] = 640;
                                this[property2] = 480;
                                break;
                            case 900:
                                this[property1] = 960;
                                this[property2] = 720;
                                break;
                            case 1200:
                                this[property1] = 1280;
                                this[property2] = 960;
                                break;
                            case 1500:
                                this[property1] = 1600;
                                this[property2] = 1200;
                                break;
                            case 1800:
                                this[property1] = 1800;
                                this[property2] = 1350;
                                break;
                        }
                        break;
                }

            }
        } else {
            throw "Bad command " + command;

        }
    }
}

class Process {
    private status: boolean = true
    private readonly request: CloudFrontRequest
    private readonly context: Context
    private readonly callback: CloudFrontRequestCallback

    constructor(event: CloudFrontRequestEvent, context: Context, callback: CloudFrontRequestCallback) {
        this.request = event.Records[0].cf.request;
        this.context = context;
        this.callback = callback;

        this.create();
    }

    private readonly S3: S3Client = new S3Client({
        apiVersion: "2006-03-01",
    })

    private getMimeType(extension: string): string {
        switch (extension) {
            case "jpg":
                return "image/jpeg";
            case "png":
                return "image/png";
            // case "gif":
            //   return "image/gif";
            case "webp":
                return "image/webp"
            case "avif": // => avif未対応
                return "image/avif"
        }

        throw "Bad extension [" + extension + "]";
    }

    private done(): void {
        if (this.status) {
            this.status = false;
            this.callback(null, this.request);
        }
    }

    private error(err: any): void {
        console.log("err:", err);

        if (this.status) {
            this.status = false;

            return this.callback(null, {
                status: "302",
                statusDescription: "Found",
                headers: {
                    "cache-control": [{
                        key: "Cache-Control",
                        value: "max-age=10,public,immutable"
                    }],
                    location: [{
                        key: "Location",
                        value: "https://" + ENV.HOSTNAME + "/error.svg"
                    }]
                }
            });
        }
    }

    private redirect(pathname: string, cache: number): void {
        if (this.status) {
            this.status = false;

            return this.callback(null, {
                status: "301",
                statusDescription: "Found",
                headers: {
                    "cache-control": [{
                        key: "Cache-Control",
                        value: "max-age=" + cache + ",public,immutable"
                    }],
                    location: [{
                        key: "Location",
                        value: "https://" + ENV.HOSTNAME + "/" + pathname
                    }]
                }
            });
        }
    }

    private async check(orders: OrderList): Promise<OrderList> {
        const newOrder = [];

        while (orders.length) {
            const order = orders.pop() as Order;

            try {
                await this.S3.send(new HeadObjectCommand(order.dist));

                if ((order as OrderForWebpOrAvif).done) break;

            } catch (err) {
                newOrder.unshift(order);

            }
        }

        return newOrder;
    }

    private create() {
        const matches = this.request.uri.match(/^\/media\/(((m([0-9]+)s([0-9]+)x([0-9]+)z)(-)?([a-zA-Z0-9]+)?\.(jpg|png))(\.webp|\.avif)?)$/)!;

        if (!matches) this.error("Bad pathname: " + this.request.uri);

        const basename = matches[2];
        const filename = matches[3];
        const naturalWidth = parseInt(matches[5], 10);
        const naturalHeight = parseInt(matches[6], 10);
        const command = matches[8];
        const extension = matches[9];
        const webpOrAvif = matches[10];

        const orderList = [
            {
                index: 0,
                src: {
                    Bucket: ENV.BUCKET,
                    Key: "uploads/" + filename + "." + extension,
                },
                dist: {
                    Bucket: ENV.BUCKET,
                    Key: "dist/images/media/" + filename + "." + extension,
                },
                extension: extension,
                cache: 365 * 86400,
            } as OrderForOriginal,
        ];

        if (command) {
            orderList.push({
                index: 1,
                src: {
                    Bucket: ENV.BUCKET,
                    Key: "dist/images/media/" + filename + "." + extension,
                },
                dist: {
                    Bucket: ENV.BUCKET,
                    Key: "dist/images/media/" + basename,
                },
                extension: extension,
                command: command,
                cache: 365 * 86400,
                naturalWidth: naturalWidth,
                naturalHeight: naturalHeight,
                // 元画像へのリダイレクトをかける場合
                prefix: "media/" + filename,
                suffix: "." + extension + (webpOrAvif ? webpOrAvif : ""),
                method: "create",
            } as OrderForCommand);
        }

        if (webpOrAvif) {
            orderList.push({
                index: 2,
                done: true, // このEntryのdistが存在すれば処理は不要
                src: {
                    Bucket: ENV.BUCKET,
                    Key: "dist/images/media/" + basename,
                },
                dist: {
                    Bucket: ENV.BUCKET,
                    Key: "dist/images/media/" + basename + webpOrAvif,
                },
                extension: webpOrAvif.slice(1),
                cache: 365 * 86400,

                command: command,
                prefix: "media/" + filename,
                suffix: "." + extension + (webpOrAvif ? webpOrAvif : ""),
            } as OrderForWebpOrAvif);
        }

        return this.createImages(orderList);
    }

    private createImages(orders: OrderList): void {
        this.check(orders)
            .then(async (orders) => {
                if (orders.length) {
                    try {
                        const abort = {
                            status: false
                        }

                        for (var i = 0; orders.length > i; i++) {
                            await this.createImage(orders[i], abort);

                            if (abort.status) return;
                        }
                    } catch (err) {
                        this.error(err);

                    }
                }

                this.done();
            })
            .catch(this.error);
    }

    private createImage(order: Order, abort: Abort): Promise<void> {
        return new Promise((resolve, reject) => {
            const command = (order as OrderForCommand | OrderForWebpOrAvif).command ? new Command((order as OrderForCommand | OrderForWebpOrAvif).command) : null;
            let width: number = 0;
            let height: number = 0;

            if ("webp" !== order.extension && "avif" !== order.extension && command) {
                const orderForCommand = order as OrderForCommand;

                width = command.width;
                height = command.height;

                if (!width || !height) {
                    if ((width && (width > orderForCommand.naturalWidth)) || (height && (height > orderForCommand.naturalHeight))) {
                        this.redirect(orderForCommand.prefix + orderForCommand.suffix, 365 * 86400);

                        abort.status = true;

                        return this[orderForCommand.method]();
                    }

                } else if (command.size > 600) {
                    const naturalSize = "w" === command.direction ? orderForCommand.naturalWidth : orderForCommand.naturalHeight;

                    if (command.size > naturalSize) {
                        let newSize = null;

                        for (var a = [100, 300, 600, 900, 1200, 1500, 1800], i = 0; a.length > i; i++) {
                            let _size = a[i];
                            if (_size === command.size || _size > naturalSize) break;
                            newSize = _size;
                        }

                        if (newSize && command.size !== newSize) {
                            this.redirect(orderForCommand.prefix + ("-" + command.direction + newSize + command.aspect) + orderForCommand.suffix, 365 * 86400);

                            abort.status = true;

                            return this[orderForCommand.method]();
                        }
                    }
                }
            }

            this.S3.send(new GetObjectCommand(order.src))
                .then((data: GetObjectCommandOutput) => Promise.all([
                    data,
                    streamToBuffer(data.Body! as Readable),
                ]))
                .then(([data, buffer]) => {
                    if ("avif" === order.extension) {
                        const orderForWebpOrAvif = order as OrderForWebpOrAvif;

                        abort.status = true;

                        this.S3.send(new HeadObjectCommand({
                            Bucket: order.dist.Bucket,
                            Key: "avif/" + order.dist.Key,
                        }))
                            .then(() => {
                                this.redirect(orderForWebpOrAvif.prefix + (orderForWebpOrAvif.command ? "-" + orderForWebpOrAvif.command : "") + orderForWebpOrAvif.suffix.slice(0, -5) + ".webp", 86400);
                            })
                            .catch(() => {
                                this.S3.send(new PutObjectCommand({
                                    Bucket: order.dist.Bucket,
                                    Key: "avif/" + order.dist.Key,
                                    Body: JSON.stringify({
                                        src: order.src,
                                        dist: {
                                            ...order.dist,
                                            meta: {
                                                CacheControl: "max-age=" + order.cache + ",public,immutable",
                                                ContentType: "image/avif",
                                            },
                                        },
                                    }),
                                }));
                            });
                    } else {
                        let sharpItem = this.sharp(order.extension, buffer);

                        if ("webp" !== order.extension && (width || height)) {
                            sharpItem = sharpItem.resize(width, height);
                        }

                        return Promise.all([
                            data,
                            buffer,
                            sharpItem.toBuffer(),
                        ]);
                    }
                })
                .then((res) => {
                    if (this.status && !abort.status && res) {
                        const [data, fileBuffer, sharpBuffer] = res;

                        return Promise.all([
                            data,
                            fileBuffer,
                            "webp" === order.extension ? Promise.resolve(sharpBuffer) : imagemin.buffer(sharpBuffer, {
                                plugins: [
                                    imageminMozjpeg({
                                        quality: 80,
                                        progressive: !0
                                    }),
                                    imageminPngquant({
                                        quality: [.6, .8],
                                        speed: 1,
                                        strip: !0
                                    }),
                                ],
                            }),
                        ]);
                    }
                })
                .then((res) => {
                    if (this.status && !abort.status && res) {
                        const [data, fileBuffer, imageminBuffer,] = res;

                        if (imageminBuffer) {
                            return this.S3.send(new PutObjectCommand({
                                ...order.dist,
                                Body: ("webp" !== order.extension && (!width || !height) && (imageminBuffer.length > data.ContentLength!)) ? fileBuffer : imageminBuffer,
                                ...{
                                    CacheControl: "max-age=" + order.cache + ",public,immutable",
                                    ContentType: this.getMimeType(order.extension),
                                },
                            }));
                        }
                    }
                })
                .then(() => resolve())
                .catch(reject);
        });
    }

    private sharp(type: Extension, buffer: Buffer): sharp.Sharp {
        switch (type) {
            case "jpg":
                return sharp(buffer).jpeg({
                    progressive: !0
                });
            case "png":
                return sharp(buffer).png({
                    compressionLevel: 9,
                    adaptiveFiltering: !0,
                    progressive: !0
                });
            case "avif":
                return sharp(buffer).avif({
                    quality: 30,
                    lossless: !1,
                    effort: 9
                });
            case "webp":
                return sharp(buffer).webp({
                    quality: 75,
                    lossless: !1,
                    nearLossless: !1,
                    smartSubsample: !0,
                    effort: 6,
                });
        }
    }
}

export const handler = (event: CloudFrontRequestEvent, context: Context, callback: CloudFrontRequestCallback) => {
    new Process(event, context, callback);
}