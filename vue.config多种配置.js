/* 
出现问题:
1.TypeError: Cannot read property ‘tapPromise‘ of undefined
// 打包压缩版本问题
使用vue cli  4 webpack进行打包时出现了  ERROR TypeError:Cannot read property ‘tapPromise‘ of undefined问题,  以为配置有问题但是最后发现是是compression-webpack-plugin版本问题，
compression-webpack-plugin 默认安装的是 7 版本的
先执行卸载命令->npm uninstall compression-webpack-plugin
执行安装命令->npm i compression-webpack-plugin@5.0.1 -D
2.原因：webpack4中用到terser-webpack-plugin压缩插件，不能使用最新的版本，而是terser-webpack-plugin@4.x版本；webpack5对应的使用terser-webpack-plugin@5.x版本
解决办法：将package.json中terser-webpack-plugin的版本换成4.2.3，然后再num install一下安装对应的版本依赖就好使了。
*/
// vue.config.js配置

const path = require("path"); //不用下载

// gzip压缩插件
const CompressionWebpackPlugin = require("compression-webpack-plugin");

// 代码打包之后取出console.log压缩代码
const TerserPlugin = require("terser-webpack-plugin");

// 图形化打包详情
const BundleAnalyzer = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const cdn = {
  // 忽略打包的第三方库
  externals: {
    vue: "Vue",
    // vuex: "Vuex",
    "vue-router": "VueRouter",
    axios: "axios",
    //自己额外使用的第三方包
    lodash: "_",
    echarts: "echarts",
    nprogress: "NProgress",
    "vue-quill-editor":'VueQuillEditor'
  },
  // 通过cdn方式使用
  js: [
    "https://cdn.bootcss.com/vue/2.6.11/vue.runtime.min.js",
    "https://cdn.bootcss.com/vue-router/3.1.2/vue-router.min.js",
    // "https://cdn.bootcss.com/vuex/3.1.2/vuex.min.js",
    "https://cdn.bootcss.com/axios/0.19.2/axios.min.js",
    // "https://cdn.bootcss.com/moment.js/2.24.0/moment.min.js",
    "https://cdn.bootcss.com/echarts/3.7.1/echarts.min.js",
    //第三方包
    "https://cdn.bootcdn.net/ajax/libs/nprogress/0.2.0/nprogress.min.js",
    "https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.min.js",
    "https://unpkg.com/element-ui/lib/index.js",
    "https://cdn.staticfile.org/quill/1.3.4/quill.min.js",
    "https://cdn.jsdelivr.net/npm/vue-quill-editor@3.0.4/dist/vue-quill-editor.js",

  ],
  css: [
    // 第三方css
    "https://cdn.bootcdn.net/ajax/libs/nprogress/0.2.0/nprogress.min.css",
    "https://unpkg.com/element-ui/lib/theme-chalk/index.css",
    "https://cdn.staticfile.org/quill/1.3.4/quill.core.min.css",
    "https://cdn.staticfile.org/quill/1.3.4/quill.snow.min.css",
    "https://cdn.staticfile.org/quill/1.3.4/quill.bubble.min.css"
  ],
};

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  // 是否触发eslint检查
  lintOnSave: false,
  publicPath: "/",
  // 打包文件的出口
  outputDir: "dist",
  // 放置生成的css和js和img和fonts的目录
  assetsDir: "static",
  // 存放index.html模板的路径
  indexPath: "static/index.html",
  productionSourceMap: false,
  chainWebpack: (config) => {
    // 自定义打包入口
    config.when(process.env.NODE_ENV === "production", (config) => {
      config.entry("app").clear().add("./src/main_prod.js");
      config.plugin("html").tap((args) => {
        args[0].Prod = true;
        return args;
      });
    });
    config.when(process.env.NODE_ENV === "development", (config) => {
      config.entry("app").clear().add("./src/main_dev.js");
      
    });
    // 配置cdn引入
    config.plugin("html").tap((args) => {
      args[0].cdn = cdn;
      return args;
    });

    // 移除prefetch插件，避免加载多余的资源
    config.plugins.delete("prefetch");

    // 定义文件夹的路径
    config.resolve.alias
      .set("@", resolve("src"))
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"))
      .set("router", resolve("src/router"))
      .set("store", resolve("src/store"))
      .set("views", resolve("src/views"));

    // 压缩图片
    const imagesRule = config.module.rule("images");
    imagesRule.uses.clear();
    imagesRule
      .use("file-loader")
      .loader("url-loader")
      .options({
        limit: 10240,
        fallback: {
          loader: "file-loader",
          options: {
            outputPath: "static/images",
          },
        },
      });

    // 压缩响应的app.json返回的代码压缩
    config.optimization.minimize(true);
  },
  // webpack的配置
  configureWebpack: (config) => {
    // 忽略打包配置
    config.externals = cdn.externals;
    // 生产环境配置
    if (process.env.NODE_ENV === "production") {
      // 代码压缩去除console.log
      config.plugins.push(
        new TerserPlugin({
          terserOptions: {
            ecma: undefined,
            warnings: false,
            parse: {},
            compress: {
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ["console.log"], // 移除console
            },
          },
        })
      );
    }

    // 开启gzip压缩
    config.plugins.push(
      new CompressionWebpackPlugin({
        filename: (info) => {
          return `${info.path}.gz${info.query}`;
        },
        algorithm: "gzip",
        threshold: 10240, // 只有大小大于该值的资源会被处理 10240
        test: new RegExp("\\.(" + ["js"].join("|") + ")$"),
        minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
        deleteOriginalAssets: false, // 删除原文件
      })
    );

    // 展示打包图形化信息
    // config.plugins.push(new BundleAnalyzer());

    // 公共代码抽离
    config.optimization = {
      splitChunks: {
        cacheGroups: {
          vendor: {
            chunks: "all",
            test: /node_modules/,
            name: "vendor",
            minChunks: 1,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 100,
          },
        },
      },
    };
  },
  css: {
    extract: true,
    sourceMap: false,
    loaderOptions: {
      // 定义全局scss无需引入即可使用
      sass: {
        prependData: `
          @import "@/assets/css/variable.scss";
          @import "@/assets/css/common.scss";
          @import "@/assets/css/mixin.scss";
        `,
      },
    },
  },
  // 需要gzip压缩的文件
  devServer: {
    host: "localhost",
    port: 8080, // 端口号
    open: false, // 配置自动启动浏览器
    before(app, server) {
      app.get(/.*.(js)$/, (req, res, next) => {
        req.url = req.url + ".gz";
        res.set("Content-Encoding", "gzip");
        next();
      });
    },
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
};
