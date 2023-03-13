import { ENV } from "../env/index.mjs";
import chokidar from "chokidar"
import fs from "fs"
import Path from "path"
import postcss from "postcss";
import cssnano from "cssnano"
import postcssImport from "postcss-import"
import autoprefixer from "autoprefixer"

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
    if (fs.statSync(path).ctimeMs > this.since && "bundle" !== Path.parse(path).name) {
      const dirname = path.split("/").slice(0, 7).join("/");
      const inputPath = dirname + "/index.css";
      const envPath = dirname + "/env.json";
      const configPath = dirname + "/config.json";

      if (fs.existsSync(inputPath) && fs.existsSync(envPath)) {
        const envJson = {
          ...JSON.parse(fs.readFileSync(envPath, "utf-8")),
        }

        if (true === envJson.ready) {
          postcss([
            autoprefixer(),
          ])
            .use(postcssImport())
            .process(fs.readFileSync(inputPath, 'utf8'), {
              from: inputPath,
            })
            .then((result) => {
              fs.writeFileSync(dirname + "/bundle.css", result.css);

              return postcss([
                cssnano(),
                autoprefixer(),
              ])
                .use(postcssImport())
                .process(fs.readFileSync(inputPath, 'utf8'), {
                  from: inputPath,
                });
            })
            .then((result) => {
              const dist = ENV.root + "/ec2/document/styles/dev/" + path.split("/")[6] + ".js";

              let moduleJSON = {
                "text": result.css,
              };

              if (fs.existsSync(configPath)) {
                moduleJSON = {
                  ...moduleJSON,
                  ...JSON.parse(fs.readFileSync(configPath, "utf-8")),
                }
              }

              fs.writeFileSync(dist, "export default " + JSON.stringify(moduleJSON));

              console.log("put", dist);
            });
        }
      }
    }
  }
}



