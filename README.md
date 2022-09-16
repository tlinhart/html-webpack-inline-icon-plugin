# Inline Icon Extension for HTML Webpack Plugin

[![CI workflow status][badge]][actions]

[badge]: https://github.com/tlinhart/html-webpack-inline-icon-plugin/actions/workflows/ci.yml/badge.svg
[actions]: https://github.com/tlinhart/html-webpack-inline-icon-plugin/actions

Extension to [`HtmlWebpackPlugin`](https://github.com/jantimon/html-webpack-plugin)
which embeds icons as data URLs in the output HTML file. Inspired by
[`InlineChunkHtmlPlugin`](https://github.com/facebook/create-react-app/blob/main/packages/react-dev-utils/InlineChunkHtmlPlugin.js)
from [react-dev-utils](https://github.com/facebook/create-react-app/tree/main/packages/react-dev-utils)
package.

## Installation

```sh
npm install --save-dev html-webpack-inline-icon-plugin
```

## Usage

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const InlineIconHtmlPlugin = require("html-webpack-inline-icon-plugin");

module.exports = {
  // ...
  plugins: [
    // Generate `index.html` with favicon injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, "public/index.html"),
      favicon: path.resolve(__dirname, "public/favicon.png"),
    }),
    // Inline icons with `favicon` in the name.
    new InlineIconHtmlPlugin(HtmlWebpackPlugin, [/favicon/]),
    // ...
  ],
  // ...
};
```
