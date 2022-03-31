const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: "C:\\Data\\Code\\UdemyBlockchainDeveloper\\StarNotaryv2\\app\\src\\index.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CopyWebpackPlugin([{ from: "C:\\Data\\Code\\UdemyBlockchainDeveloper\\StarNotaryv2\\app\\src\\index.html", to: "index.html" }]),
  ],
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true },
};
