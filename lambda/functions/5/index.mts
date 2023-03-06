import { S3Client, GetObjectCommand, PutObjectCommand, GetObjectCommandOutput, PutObjectCommandOutput } from "@aws-sdk/client-s3";
import { S3Event } from "aws-lambda";
import sharp from "sharp"
import { Readable } from 'stream'

const s3Client = new S3Client({ region: "ap-northeast-1" });

const streamToString = (stream: Readable): Promise<string> =>
    new Promise((resolve, reject) => {
        streamToBuffer(stream)
            .then((buffer: Buffer) => resolve(buffer.toString("utf8")))
            .catch(reject);
    });

const streamToBuffer = (stream: Readable): Promise<Buffer> =>
    new Promise((resolve, reject) => {
        const chunks: Uint8Array[] = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks)));
    });

type GetObjectCommandInput = {
    Bucket: string,
    Key: string
}

type RequestObject = {
    dist: PutObjectCommandInput
    src: GetObjectCommandInput
}

type PutObjectCommandInput = GetObjectCommandInput & {
    meta: {}
}

export const handler = (event: S3Event) => {
    s3Client.send(new GetObjectCommand({
        Bucket: event.Records[0].s3.bucket.name,
        Key: event.Records[0].s3.object.key,
    }))
        .then((data: GetObjectCommandOutput) => streamToString(data.Body as Readable))
        .then((str) => {
            const object: RequestObject = JSON.parse(str);

            return Promise.all([
                object,
                s3Client.send(new GetObjectCommand(object.src)),
            ]);
        })
        .then(([object, data]: [RequestObject, GetObjectCommandOutput]) => Promise.all([
            object,
            streamToBuffer(data.Body as Readable),
        ]))
        .then(([object, buffer]: [RequestObject, Buffer]) => Promise.all([
            object,
            sharp(buffer).avif({
                quality: 30,
                lossless: !1,
                effort: 9,
            }).toBuffer(),
        ]))
        .then(([object, buffer]: [RequestObject, Buffer]) => s3Client.send(new PutObjectCommand({
            ...object.dist,
            // Body: Buffer.from(buffer, "binary"),
            Body: buffer,
        })))
        .then((data: PutObjectCommandOutput) => console.log("ok: ", data))
        .catch((err: any) => console.error("error: ", err));
};