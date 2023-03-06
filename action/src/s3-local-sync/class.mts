import { ENV } from "../env/index.mjs";
import chokidar from "chokidar"
import fs from "fs"
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export class S3LocalSync {
  private readonly client: S3Client = new S3Client(ENV.s3.profile)
  private readonly since: number = Date.now()

  constructor() {
    chokidar.watch(ENV.root + "/s3/src", {
      ignored: /[\/\\]\./
    })
      .on("add", path => this.put(path))
      .on("change", path => this.put(path))
      .on("unlink", path => this.delete(path));
  }

  private put(path: string) {
    if (fs.statSync(path).ctimeMs > this.since) {
      const key = path.substring(path.indexOf("src/"));

      fs.readFile(path, async (err, data) => {
        await this.client.send(
          new PutObjectCommand({
            Bucket: ENV.s3.bucket,
            Key: key,
            Body: data
          })
        );
      });

      console.log("put", key);
    }
  }

  private delete(path: string) {
    const key = "dist" + path.substring(path.indexOf("src/") + 3);

    this.client.send(
      new DeleteObjectCommand({
        Bucket: ENV.s3.bucket,
        Key: key,
      })
    );

    console.log("delete", key);
  }
}



