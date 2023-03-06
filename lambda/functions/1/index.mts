import { S3Event } from 'aws-lambda'
import { S3Client, GetObjectCommand, CopyObjectCommand, CopyObjectCommandInput, GetObjectAclCommandOutput } from "@aws-sdk/client-s3"
import path from "path"

class TransferItem {
    private readonly client: S3Client = new S3Client({
        region: process.env.REGION
    })

    private readonly bucket: string
    private readonly src: string
    private readonly dist: string
    private readonly extension: string
    private readonly types: object = {
        avif: "image/avif",
        jpg: "image/jpeg",
        png: "image/png",
        gif: "image/gif",
        svg: "image/svg+xml",
        html: "text/html;charset=utf-8",
        ico: "image/x-icon",
        css: "text/css;charset=utf-8",
        js: "application/javascript;charset=utf-8",
        json: "application/json;charset=utf-8",
        xml: "application/xml;charset=utf-8",
        ttf: "application/octet-stream",
        woff: "application/x-font-woff",
        woff2: "font/woff2",
        eot: "application/vnd.ms-fontobject",
        otf: "font/opentype",
        webp: "image/webp",
        webm: "video/webm",
        oga: "audio/ogg",
        ogv: "video/ogg",
        txt: "text/plain;charset=utf-8",
        vtt: "text/vtt;charset=utf-8",
        mp4: "video/mp4",
        mp3: "audio/mpeg",
        pdf: "application/pdf",
        m3u8: "application/x-mpegURL",
        ts: "video/MP2T",
        webmanifest: "application/manifest+json;charset=utf-8",
        dat: "application/octet-stream",
    }

    constructor(bucket: string, key: string) {
        this.bucket = bucket;
        this.src = key;
        this.dist = "dist/" + (this.src.slice(4)).replace(".0000000.jpg", ".jpg");
        this.extension = path.extname(key).substring(1);

        this.client.send(new GetObjectCommand({
            Bucket: this.bucket,
            Key: this.src,
        }))
            .then((data: GetObjectAclCommandOutput) => {
                const commandInput: CopyObjectCommandInput = {
                    Bucket: this.bucket,
                    Key: this.dist,
                    CopySource: this.bucket + "/" + this.src,
                    MetadataDirective: "REPLACE"
                };

                commandInput.ContentType = this.types[this.extension];

                if (commandInput) {

                    if (this.dist.indexOf("/sw.js") > -1) {
                        commandInput.CacheControl = "max-age=600,stale-while-revalidate=600,stale-if-error=864000,public,immutable";

                    } else if (this.dist.indexOf("/robots.txt") > -1) {
                        commandInput.CacheControl = "max-age=2592000,public,immutable";

                    } else if (this.dist.indexOf("/sitemap.xml") > -1) {
                        commandInput.CacheControl = "max-age=2592000,public,immutable";

                    } else if (this.dist.indexOf("/browserconfig.xml") > -1) {
                        commandInput.CacheControl = "max-age=2592000,public,immutable";

                    } else if (this.dist.indexOf("/manifest.json") > -1) {
                        commandInput.CacheControl = "max-age=2592000,public,immutable";

                    } else if (-1 !== this.dist.indexOf(".webmanifest") || -1 !== this.dist.indexOf("manifest.json")) {
                        commandInput.CacheControl = "max-age=600,public,immutable";
                        commandInput.ContentType = "application/manifest+json;charset=utf-8";
                    } else {
                        if (this.extension === "js" || this.extension === "css") {
                            commandInput.CacheControl = "max-age=2592000,public,immutable";
                        } else {
                            let CacheControl = 30;

                            switch (this.extension) {
                                case "ico":
                                case "png":
                                case "svg":
                                case "ttf":
                                case "woff":
                                case "woff2":
                                case "eot":
                                case "otf":
                                    CacheControl = 365;
                                    break;
                                case "html":
                                    CacheControl = 1;
                                    break;
                            }

                            commandInput.CacheControl = "max-age=" + (86400 * CacheControl).toString() + ",public,immutable";
                        }
                    }
                }

                return this.client.send(new CopyObjectCommand(commandInput));
            })
            .then((data) => console.log("ok: ", data))
            .catch((err) => console.error("error: ", err))
            .finally(process.exit);
    }
}

export const handler = (s3Event: S3Event) => {
    const event = s3Event.Records[0].s3;
    new TransferItem(event.bucket.name, event.object.key);
}


