// vue.config.js

/**
 * https://cli.vuejs.org/config/
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  publicPath: '',
  outputDir: 'dist/vue',
  css: {
    loaderOptions: {
      sass: {
        prependData: `
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
        args[0].title = "e-Dnevnik Vue";
        return args;
      }),
}