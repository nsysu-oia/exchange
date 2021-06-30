module.exports = {
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = '國立中山大學交換計畫單一入口'
        return args
      })
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/exchange/'
    : '/',
  outputDir: 'dist/exchange'
}
