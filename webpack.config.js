const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.jsx",
  devtool: "source-map",
  devServer: {
    historyApiFallback: true,
    port: 3001,
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    proxy: {
      '/api': {
        target: 'https://m1.geniemars.kt.co.kr:10665',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        },
        secure: false,
        logLevel: 'debug',
        onProxyReq: (proxyReq, req, res) => {
          console.log('프록시 요청:', req.method, req.url, '→', proxyReq.path);
        },
        onProxyRes: (proxyRes, req, res) => {
          console.log('프록시 응답:', proxyRes.statusCode);
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|eot|ttf|woff|woff2)$/i,
        type: "asset",
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              svgo: false,
            },
          },
          "url-loader",
        ],
      },
      {
        test: /\.json$/,
        loader: "json-loader",
        type: "javascript/auto",
      },
    ],
  },
  resolve: {
    extensions: [".jsx", ".js"],
    fallback: {
      crypto: false,
    },
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      hash: true,
    }),
  ],
};
