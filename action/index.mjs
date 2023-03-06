import { S3LocalSync } from "./dist/index.mjs"
import { S3ProdStyleSync } from "./dist/s3-prod-style-sync/index.mjs"

new S3LocalSync;
new S3ProdStyleSync;