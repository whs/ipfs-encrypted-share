const { rewireEmotion } = require("react-app-rewire-emotion");
const webpack = require("webpack");

module.exports = function override(config, env) {
  config = rewireEmotion(config, env);
  config.plugins = (config.plugins || []).concat([
    new webpack.DefinePlugin({
      "process.env.VERSION": JSON.stringify(require("./package.json").version)
    })
  ]);

  return config;
};
