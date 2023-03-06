import { ENV } from "../env/index.mjs";
import chokidar from "chokidar"
import fs from "fs"
import Path from "path"

export class S3ProdScriptSync {
  private readonly since: number = Date.now()

  constructor() {
    chokidar.watch(ENV.root + "/ec2/document/scripts/prod", {
      ignored: /[\/\\]\./
    })
      .on("add", path => this.put(path))
      .on("change", path => this.put(path))
      .on("unlink", path => this.delete(path));
  }

  private put(path: string) {
    if (fs.statSync(path).ctimeMs > this.since) {
      const dist = ENV.root + "/s3/src/scripts/" + Path.basename(path);
      fs.copyFileSync(path, dist);
      console.log("copy: ", path + " => " + dist);
    }
  }

  private delete(path: string) {
    const dist = ENV.root + "/s3/src/scripts/" + Path.basename(path);
    fs.unlinkSync(dist);
    console.log("delete", dist);
  }
}
