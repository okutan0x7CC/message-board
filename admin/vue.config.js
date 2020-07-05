const path = require("path");
module.exports = {
  transpileDependencies: ["@inkline/inkline"],
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "scss",
      patterns: [
        path.resolve(__dirname, "src/css/inkline/config/index.scss"),
        path.resolve(__dirname, "src/assets/variables.scss"),
      ],
    },
  },
  configureWebpack: {
    devtool: "source-map",
  },
};
