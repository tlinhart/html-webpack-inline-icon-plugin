"use strict";

const isSvg = require("is-svg");
const imageType = require("image-type");

const SUPPORTED_LINK_TYPES = [
  "icon",
  "apple-touch-icon",
  "apple-touch-startup-image",
];

class InlineIconHtmlPlugin {
  constructor(htmlWebpackPlugin, tests) {
    this.htmlWebpackPlugin = htmlWebpackPlugin;
    this.tests = tests;
  }

  getInlinedTag(publicPath, assets, tag) {
    if (
      tag.tagName !== "link" ||
      !SUPPORTED_LINK_TYPES.includes(tag.attributes.rel)
    ) {
      return tag;
    }
    const fileName = publicPath
      ? tag.attributes.href.replace(publicPath, "")
      : tag.attributes.href;
    if (!this.tests.some((test) => fileName.match(test))) {
      return tag;
    }
    const asset = assets[fileName];
    if (asset == null) {
      return tag;
    }

    let mimeType;
    if (isSvg(asset.source())) {
      mimeType = "image/svg+xml";
    } else {
      const fileType = imageType(asset.source());
      mimeType = fileType ? fileType.mime : "application/octet-stream";
    }
    const data = asset.source().toString("base64");
    return {
      ...tag,
      attributes: {
        ...tag.attributes,
        href: `data:${mimeType};base64,${data}`,
      },
    };
  }

  apply(compiler) {
    let publicPath = compiler.options.output.publicPath || "";
    if (publicPath && !publicPath.endsWith("/")) {
      publicPath += "/";
    }

    compiler.hooks.compilation.tap("InlineIconHtmlPlugin", (compilation) => {
      const hooks = this.htmlWebpackPlugin.getHooks(compilation);
      hooks.alterAssetTagGroups.tap("InlineIconHtmlPlugin", (assets) => {
        assets.headTags = assets.headTags.map((tag) =>
          this.getInlinedTag(publicPath, compilation.assets, tag)
        );
      });
    });
  }
}

module.exports = InlineIconHtmlPlugin;
