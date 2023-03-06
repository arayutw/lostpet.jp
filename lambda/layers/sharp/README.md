# npm install
- `npm install sharp`だと、Lambdaで機能しない。
- 下記の方法でインストールする必要がある。

```
npm install --platform=linux --arch=x64 sharp
```

# zipの作成
```
zip -r ./nodejs.zip ./nodejs -x "*.DS_Store"
```