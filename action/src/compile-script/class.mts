import { ENV } from "../env/index.mjs";
import chokidar from "chokidar"
import fs from "fs"
import uglifyJs from "uglify-js"
import { rollup, RollupBuild, RollupOutput } from "rollup"
import esbuild from "rollup-plugin-esbuild"
import { getBabelOutputPlugin } from "@rollup/plugin-babel"
import nodeResolve from "@rollup/plugin-node-resolve"
import jsonResolve from "@rollup/plugin-json"
import rollupReplace from "@rollup/plugin-replace"

export class CompileScript {
  private readonly since: number = Date.now()

  constructor() {
    chokidar.watch(ENV.root + "/scripts/**/*.ts", {
      ignored: /[\/\\]\./
    })
      // .on("add", path => this.compile(path))
      .on("change", path => this.compile(path))
      // .on("unlink", path => this.compile(path));

      ; chokidar.watch(ENV.root + "/scripts/**/replace.json", {
        ignored: /[\/\\]\./
      })
        // .on("add", path => this.compile(path))
        .on("change", path => this.compile(path))
      // .on("unlink", path => this.compile(path));

      ; chokidar.watch(ENV.root + "/scripts/**/env.json", {
        ignored: /[\/\\]\./
      })
        // .on("add", path => this.compile(path))
        .on("change", path => this.compile(path))
    // .on("unlink", path => this.compile(path));
  }

  private compile(path: string) {
    if (fs.statSync(path).ctimeMs > this.since) {
      const tokens = path.split("/");
      const dirname = tokens.slice(0, 7).join("/");
      const id = tokens[6];

      const inputPath = dirname + "/index.ts";
      const envPath = dirname + "/env.json";

      if (fs.existsSync(inputPath) && fs.existsSync(envPath)) {
        const envJson = {
          ...{ id, },
          ...JSON.parse(fs.readFileSync(envPath, "utf-8")),
        }

        if (true === envJson.ready) {
          const replacePath = dirname + "/replace.json";
          let replaceJson = {};

          if (fs.existsSync(replacePath)) {
            replaceJson = {
              ...replaceJson,
              ...JSON.parse(fs.readFileSync(replacePath, "utf-8")),
            }
          }

          rollup({
            input: inputPath,
            plugins: [
              nodeResolve(),
              jsonResolve(),
              rollupReplace({
                preventAssignment: true,
                values: replaceJson,
              }),
              esbuild({
                minify: false,
              }),
              getBabelOutputPlugin({
                configFile: ENV.root + '/.babelrc',
                allowAllFormats: true,
              }),
              {
                name: 'minify',
                renderChunk(code) {
                  const result = uglifyJs.minify(code, {
                    sourceMap: true,
                    compress: {
                      // negate_iife: false,
                      passes: 10,
                    },
                    output: {
                      comments: /^!/,
                    },
                    toplevel: true,
                    mangle: {
                      reserved: "script" === envJson.id ? ["a",] : ["grecaptcha",],
                      properties: {
                        regex: /^_/,
                      },
                    },
                  });

                  if (result.error) {
                    throw result.error;
                  }

                  return result;
                },
              },
            ],
          })
            .then((rollupBuild: RollupBuild) => {
              const path = ENV.root + "/ec2/document/scripts/dev/" + envJson.id + ".js";

              return Promise.all([
                path,
                rollupBuild.write({
                  file: path,
                }),
              ]);
            })
            .then(([path, output]: [string, RollupOutput]) => {
              console.log("put", path);
            })
            .catch(err => console.error("error: ", err));
        }
      }
    }
  }
}



