const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "C:\\Data\\Code\\UdemyBlockchainDeveloper\\nd1309-p2-Decentralized-Star-Notary-Service-Starter-Code-main\\app\\src\\index.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    // new CopyWebpackPlugin(
    //   { 
    //     patterns: [
    //       { from: './src/index.html', to: 'index.html' }
    //     ]
    //   }
    // )
    new CopyWebpackPlugin([{ from: "./src/index.html", to: "index.html" }]),
  ],
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true },
};
