import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// import ElementUI from "element-ui";
import treeTable from 'vue-table-with-tree-grid'
import api from './api/api.js'
// import "/node_modules/element-ui/lib/theme-chalk/index.css";
import "./assets/reset.css";
import './assets/fonts/iconfont.css'
import * as fn from './plugins/index'

// import VueQuillEditor from 'vue-quill-editor'
// import 'nprogress/nprogress.css'
// require styles
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)
// Elementui引入,1把引入的elemenui和css注释掉,2Vue.use(ELEMENT)3在index.html中引入js和css,vue的在它前面引入4externals: {"element-ui":"ELEMENT"}.
Vue.use(ELEMENT);
Vue.component('tree-table',treeTable)
Vue.filter('dateFormat',function(orignVal){
  const dt  =new Date(orignVal)
  const y = dt.getFullYear();
  const m = (dt.getMonth()+1+'').padStart(2,'0');
  const d = (dt.getDate() + '').padStart(2,'0');
  const hh = (dt.getHours()+'').padStart(2,'0')
  const mm = (dt.getMinutes()+'').padStart(2,'0')
  const ss = (dt.getSeconds()+'').padStart(2,'0')
  // return `yyyy-mm-dd hh:mm:ss`
  return `${y}-${m}-${d} ${hh}-${mm}-${ss}`
})
Vue.prototype.$api = api
Vue.prototype.$fn = fn
Vue.config.productionTip = false;
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
