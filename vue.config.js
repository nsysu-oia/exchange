module.exports = {
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = '國立中山大學出國交換計畫平台'
        return args
      })

    config
      .module
        .rule('yaml')
        .test(/\.ya?ml$/)
        .type('json')
        .use('yaml-loader')
          .loader('yaml-loader')
          .end()
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/exchange/'
    : '/',
  outputDir: 'dist/exchange'
}
