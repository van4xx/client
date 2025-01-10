const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    process: require.resolve("process/browser"),
    buffer: require.resolve("buffer/"),
    util: require.resolve("util/"),
    stream: require.resolve("stream-browserify"),
    crypto: require.resolve("crypto-browserify"),
    assert: require.resolve("assert/"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify/browser"),
    url: require.resolve("url/"),
    zlib: require.resolve("browserify-zlib")
  };

  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: ["process/browser"],
      Buffer: ["buffer", "Buffer"]
    })
  ];

  config.module.rules.push({
    test: /\.m?js$/,
    resolve: {
      fullySpecified: false
    }
  });

  return config;
} 