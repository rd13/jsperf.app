// https://github.com/bestiejs/benchmark.js/issues/128#issuecomment-271615298
module.exports = {
  webpack: (config, options) => {
    config.module.noParse = [
      /benchmark/
    ]
    return config
  },
}
