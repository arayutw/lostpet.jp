import { ENV } from "../env/index.mjs";
import chokidar from "chokidar"
import fs from "fs"
import postcss from "postcss";
import cssnano from "cssnano"
import postcssImport from "postcss-import"



export class CompileStyle {
  private readonly since: number = Date.now()

  constructor() {
    chokidar.watch(ENV.root + "/styles/**/*.css", {
      ignored: /[\/\\]\./
    })
      // .on("add", path => this.compile(path))
      .on("change", path => this.compile(path));
    // .on("unlink", path => this.compile(path));
  }

  private compile(path: string) {
    if (fs.statSync(path).ctimeMs > this.since) {
      const dirname = path.split("/").slice(0, 7).join("/");
      const inputPath = dirname + "/index.css";
      const envPath = dirname + "/env.json";

      if (fs.existsSync(inputPath) && fs.existsSync(envPath)) {
        const envJson = {
          ...JSON.parse(fs.readFileSync(envPath, "utf-8")),
        }

        if (true === envJson.ready) {
          postcss([
            cssnano(),
          ])
            .use(postcssImport())
            .process(fs.readFileSync(inputPath, 'utf8'), {
              from: inputPath,
            })
            .then((result) => {
              const dist = ENV.root + "/ec2/document/styles/dev/" + path.split("/")[6] + ".css";

              fs.writeFileSync(dist, result.css);

              console.log("put", dist);
            });
        }
      }
    }
  }
}



