const { smart } = require("webpack-merge");
const base = require("./webpack.config.base");

const webpack = require("webpack");

module.exports = smart(base, {
  mode: "development",
  devServer: {
    port: "3000",
    hot: true,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        pathRewrite: {
          "/api": "",
        },
      },
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      DEV: JSON.stringify("development"), //字符串
      FLAG: "true", //FLAG 是个布尔类型
    }),
  ],
});
