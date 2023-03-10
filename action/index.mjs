import { CompileStyle, CompileScript, S3LocalSync, S3ProdStyleSync, S3ProdScriptSync, CompileSVG } from "./dist/index.mjs"

new S3LocalSync;
new S3ProdStyleSync;
new S3ProdScriptSync;
new CompileStyle;
new CompileScript;
new CompileSVG;