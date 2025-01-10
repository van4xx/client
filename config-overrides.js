const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    process: require.resolve("process/browser"),
    buffer: require.resolve("buffer"),
    util: require.resolve("util"),
    stream: require.resolve("stream-browserify"),
    crypto: require.resolve("crypto-browserify"),
    assert: require.resolve("assert"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify/browser"),
    url: require.resolve("url"),
    zlib: require.resolve("browserify-zlib"),
    path: false,
    fs: false
  };

  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"]
    }),
    new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
      const mod = resource.request.replace(/^node:/, "");
      switch (mod) {
        case "buffer":
          resource.request = "buffer";
          break;
        case "stream":
          resource.request = "stream-browserify";
          break;
        default:
          break;
      }
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