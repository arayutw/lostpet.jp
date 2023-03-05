import { S3Client, HeadObjectCommand, CopyObjectCommand, CopyObjectCommandOutput } from "@aws-sdk/client-s3";
import { S3Event } from "aws-lambda";
import path from "path"

class Process {
    private readonly S3: S3Client = new S3Client({
        region: process.env.REGION
    })

    constructor(bucket: string, key: string) {
        this.S3.send(new HeadObjectCommand({
            Bucket: bucket,
            Key: key
        }))
            .then(() => {
                return this.S3.send(new CopyObjectCommand({
                    Bucket: bucket,
                    Key: "uploads/" + path.parse(key).base.replace(".0000000.jpg", ".jpg"),
                    CopySource: bucket + "/" + key,
                    MetadataDirective: "REPLACE",
                    CacheControl: "max-age=2592000,public,immutable",
                    ContentType: "image/jpeg",
                }));
            })
            .then((data: CopyObjectCommandOutput) => console.log("ok: ", data))
            .catch((err: any) => console.error("error: ", err))
            .finally(process.exit);
    }
}

export const handler = (s3Event: S3Event) => {
    const event = s3Event.Records[0].s3;
    new Process(event.bucket.name, event.object.key);
}