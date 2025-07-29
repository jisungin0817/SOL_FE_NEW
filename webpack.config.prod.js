const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    main: "./src/index.jsx",
  },
  devtool: false,
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
    filename: "[name].[chunkhash:10].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/app2/",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      // favicon: "./public/logo.png",
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "public/**/*.(png|jpg|jpeg|gif|svg)", to: "public" }],
    }),
  ],
};
