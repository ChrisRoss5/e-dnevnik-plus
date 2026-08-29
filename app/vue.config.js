/**
 * https://cli.vuejs.org/config/
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  lintOnSave: false,
  publicPath: '',
  outputDir: '../dist/app',
  productionSourceMap: false,
  configureWebpack: {
    performance: {
      hints: false,
    },
  },
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          silenceDeprecations: ['import', 'global-builtin'],
        },
        additionalData: `
          @import "@/styles/_variables.scss";
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
