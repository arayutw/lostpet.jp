import { CompileStyle, CompileScript, S3LocalSync, S3ProdStyleSync, S3ProdScriptSync } from "./dist/index.mjs"

new S3LocalSync;
new S3ProdStyleSync;
new S3ProdScriptSync;
new CompileStyle;
new CompileScript;