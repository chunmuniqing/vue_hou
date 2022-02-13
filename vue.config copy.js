// vue.config.js
module.exports = {
  devServer: {
    host: "localhost",
    port: 8080, // 端口号
    open: false, // 配置自动启动浏览器
    proxy: {
      "/hou": {
        target: `http://127.0.0.1:8888`,
        logLevel: "debug", //运行时将本地发起的地址和对应指向的地址打印输出
        ws: true, //如果要代理 websockets，配置这个参数
        secure: false, // 如果是https接口，需要配置这个参数
        pathRewrite: {
          "^/hou": "",
        },
        changeOrigin: true, //允许跨域
      },
    },
  },
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main_prod.js')

      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })

      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main_dev.js')

      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}
