const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  baseUrl: '',

  productionSourceMap: false,

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('~', resolve('./'))
  },

  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/assets/sass/global.scss";'
      }
    }
  },

  outputDir: undefined,
  // assetsDir: 'static',
  runtimeCompiler: true,
  parallel: undefined,
  configureWebpack: {
    externals: {
      vue: 'Vue',
      vuex: 'Vuex',
      'vue-router': 'VueRouter',
      'element-ui': 'ELEMENT',
      axios: 'axios'
    }
  },
  transpileDependencies: [
    /\bvue-awesome\b/
  ]
}
