import pxtorem from "postcss-pxtorem";
export default {
  theme: {
    "@hd": "2px"
  },
  extraBabelPlugins: [
    [
      "import",
      { libraryName: "antd-mobile", libraryDirectory: "es", style: true }
    ]
  ],
  extraPostCSSPlugins: [pxtorem({ rootValue: 75, propWhiteList: [] })],
  proxy: {
    "/api": {
      // target: "http://musicapi.leanapp.cn/",
      // target: "https://music.linkorg.club/",
      target: "https://music.yutty.top/",
      changeOrigin: true,
      pathRewrite: { "^/api/": "" }
    }
  }
};
