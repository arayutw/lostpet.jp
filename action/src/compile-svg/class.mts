import chokidar from "chokidar"
import { ENV } from "../env/data.mjs"
import fs from "fs"
import Path from "path"

export class CompileSVG {
    private readonly since: number = Date.now()

    constructor() {
        chokidar.watch(ENV.root + "/svg/*.json", {
            ignored: /[\/\\]\./
        })
            // .on("add", path => this.compile(path))
            .on("change", path => this.compile(path))
        // .on("unlink", path => this.compile(path));
    }

    private compile(path: string) {
        if (fs.statSync(path).ctimeMs > this.since) {
            const id = Path.parse(path).name;
            const dist = ENV.root + "/ec2/document/svg/" + id + ".json";

            fs.writeFileSync(dist, JSON.stringify(JSON.parse(fs.readFileSync(path, "utf-8"))));

            console.log("put: ", dist);
        }
    }
}