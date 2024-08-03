const webpack = require('webpack');

module.exports = function override(config, env) {
  config.resolve.fallback = {
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "url": require.resolve("url/"),
    "zlib": require.resolve("browserify-zlib"),
    "path": require.resolve("path-browserify"),
    "stream": require.resolve("stream-browserify"),
    "buffer": require.resolve("buffer/")
  };

  return config;
};
