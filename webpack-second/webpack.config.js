const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const isDev = process.env.NODE_ENV === "development";
const config = require("./public/config")[isDev ? "dev" : "build"];

module.exports = {
  entry: './src/index.js', // 默认
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[hash].js', // 默认 main.js
    publicPath: '/',
  },
  // 多页面配置
  // entry: {
  //   index: './src/index.js',
  //   login: './src/login.js'
  // },
  // output: {
  //   path: path.resolve(__dirname, 'dist'),
  //   filename: '[name].[hash:6].js'
  // },
  mode: "development",
  devtool: "cheap-module-eval-source-map",
  devServer: {
    hot: true,
    port: "3000", //默认是8080
    quiet: false, //默认不启用
    inline: true, //默认开启 inline 模式，如果设置为false,开启 iframe 模式
    stats: "errors-only", //终端仅打印 error
    overlay: false, //默认不启用
    clientLogLevel: "silent", //日志等级
    compress: true, //是否启用 gzip 压缩
  },
  resolve: {
    modules: ['./src/components', 'node_modules'], //从左到右依次查找
    alias: {
      'react-native': '@my/react-native-web' //这个包名是我随便写的哈
    },
    extensions: ['web.js', '.js']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              [
                "@babel/plugin-transform-runtime",
                {
                  corejs: 3,
                },
              ],
            ],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
                hmr: isDev,
                reloadAll: true,
            }
          },
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: function () {
                return [
                  require('autoprefixer')()
                ]
              },
            },
          },
          "less-loader",
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10, //10K
              esModule: false,
              outputPath: 'assets'
              // name: '[name]_[hash:6].[ext]'
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "index.html", //打包后的文件名
      config: config.template,
      minify: {
        removeAttributeQuotes: false, //是否删除属性的双引号
        collapseWhitespace: false, //是否折叠空白
      },
      // hash: true //是否加上hash，默认是 false
    }),
    // 多页面配置
    // new HtmlWebpackPlugin({
    //   template: './public/index.html',
    //   filename: 'index.html',
    //   chunks: ['index'], 指定引入模块名字
    // }),
    // new HtmlWebpackPlugin({
    //   template: './public/login.html',
    //   filename: 'login.html',
    //   chunks: ['login'] 指定引入模块名字
    // }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns:['**/*', '!dll', '!dll/**'] //不删除dll目录下的文件
    }),
    new CopyWebpackPlugin([
      {
        from: 'public/js/*.js',
        to: path.resolve(__dirname, 'dist', 'js'),
        flatten: true,
      }],
      {
        ignore: ['other.js']
      }
    ),
    new webpack.ProvidePlugin({
      React: 'react',
      Component: ['react', 'Component'],
      Vue: ['vue/dist/vue.esm.js', 'default'],
      $: 'jquery',
      _map: ['lodash', 'map']
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
      //个人习惯将css文件放在单独目录下
      //publicPath:'../'   //如果你的output的publicPath配置的是 './' 这种相对路径，那么如果将css文件放在单独目录下，记得在这里指定一下publicPath 
    }),
    new OptimizeCssPlugin(),
    new webpack.HotModuleReplacementPlugin() //热更新插件
  ],
};
