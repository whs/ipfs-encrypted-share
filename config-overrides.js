const { rewireEmotion } = require("react-app-rewire-emotion");
const webpack = require("webpack");
const { getLoader, loaderNameMatches } = require("react-app-rewired");

module.exports = function override(config, env) {
  config = rewireEmotion(config, env);
  config.plugins = (config.plugins || []).concat([
    new webpack.DefinePlugin({
      "process.env.VERSION": JSON.stringify(require("./package.json").version)
    })
  ]);

  const babelLoader = getLoader(config.module.rules, rule =>
    loaderNameMatches(rule, "babel-loader")
  );

  config.module.rules.push({
    test: /node_modules\/(ipfs-.*?|cids|multihashes|is-ipfs|dag-link|ipld-.*?|multiaddr|class-is|multihashing-async|borc|peer-id|libp2p-crypto|libp2p-crypto-.*?|multibase|multicodec|peer-info)\/(.*?)\.js$/,
    loader: babelLoader.loader,
    options: babelLoader.options
  });

  return config;
};
