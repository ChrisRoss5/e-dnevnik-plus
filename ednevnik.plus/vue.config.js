/**
 * https://cli.vuejs.org/config/
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  publicPath: '../',
  outputDir: '../docs',
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/styles/global.scss";
        `
      }
    }
  },
  chainWebpack: config =>
    config
      .plugin('html')
      .tap(args => {
        args[0].title = "e-Dnevnik Plus";
        return args;
      }),
}