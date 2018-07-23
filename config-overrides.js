const { rewireEmotion } = require('react-app-rewire-emotion');
const webpack = require('webpack');
const { injectBabelPlugin } = require('react-app-rewired');

module.exports = function override(config, env) {
	config = rewireEmotion(config, env);
	config = injectBabelPlugin(
		[
			'import',
			{ libraryName: 'antd', libraryDirectory: 'es', style: 'css' },
		],
		config
	);
	config.plugins = (config.plugins || []).concat([
		new webpack.DefinePlugin({
			'process.env.VERSION': JSON.stringify(
				require('./package.json').version
			),
		}),
	]);

	if (env === 'production') {
		config.devtool = false;
	}

	return config;
};
