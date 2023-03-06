- Lambda@edgeで画像をリアルタイムで加工する。
- Lambda@edgeはnode 18(ESM)に対応しているが、開発環境であるAmazon Linux2がnode 18に対応していない。
- 開発環境が整い、安定してからESMに置き換える。

# zipの作成
```
zip -r ./index.zip ./node_modules/ ./index.js -x "*.DS_Store"
```