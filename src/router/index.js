import Vue from "vue";
import VueRouter from "vue-router";
// import Home from "../components/Home";
// import WelCome from "../components/Home/WelCome";
// import User from "../components/Home/User";
// import Rights from "../components/Home/Rights";
// import Roles from "../components/Home/Rights/Roles";
// import Categories from "../components/Home/Shop/Categories";
// import Params from "../components/Home/Shop/Params";
// import Goods from "../components/Home/Shop/Goods";
// import home from "../components/Home/Shop/Goods/home.vue";
// import about from "../components/Home/Shop/Goods/about.vue";
// import detail from "../components/Home/Shop/Goods/detail.vue";
// import Add from "../components/Home/Shop/Goods/Add.vue";
// import Order from "../components/Home/Order";
// import Reports from "../components/Home/Reports";
const Login = (_) => import("../components/Login");
const Home = (_) => import("../components/Home");
const WelCome = (_) => import("../components/Home/WelCome");
const User = (_) => import("../components/Home/User");
const Rights = (_) => import("../components/Home/Rights");
const Roles = (_) => import("../components/Home/Rights/Roles");
const Categories = (_) => import("../components/Home/Shop/Categories");
const Params = (_) => import("../components/Home/Shop/Params");
const Goods = (_) => import(/* webpackChunkName: "goods" */"../components/Home/Shop/Goods");
const home = (_) => import(/* webpackChunkName: "goods" */"../components/Home/Shop/Goods/home.vue");
const about = (_) => import(/* webpackChunkName: "goods" */"../components/Home/Shop/Goods/about.vue");
const detail = (_) => import(/* webpackChunkName: "goods" */"../components/Home/Shop/Goods/detail.vue");
const Add = (_) => import(/* webpackChunkName: "goods" */"../components/Home/Shop/Goods/Add.vue");
const Order = (_) => import("../components/Home/Order");
const Reports = (_) => import("../components/Home/Reports");
Vue.use(VueRouter);

const router = new VueRouter({
  // mode:'history',
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      component: Login,
      meta: { title: "vue登录" },
    },
    {
      path: "/home",
      component: Home,
      redirect: "/welcome",
      meta: { isAuth: true, title: "vue首页" },
      children: [
        { path: "/welcome", component: WelCome, meta: { title: "首页" } },
        { path: "/users", component: User, meta: { title: "用户列表" } },
        { path: "/rights", component: Rights, meta: { title: "权限列表" } },
        { path: "/roles", component: Roles, meta: { title: "角色列表" } },
        {
          path: "/categories",
          component: Categories,
          meta: { title: "商品分类" },
        },
        { path: "/params", component: Params, meta: { title: "商品参数" } },
        {
          path: "/goods",
          component: Goods,
          children: [
            { path: "home", component: home, meta: { title: "商品列表" } },

            {
              path: "/goods/about",
              component: about,
              name: "about",
              meta: { title: "首页" },
              children: [
                {
                  path: "detail",
                  component: detail,
                  name: "detail",
                  props({ query, params }) {
                    return { name: params.name, name: query.name };
                  },
                },
              ],
            },
          ],
        },
        {
          name: "add",
          path: "/goods/add",
          component: Add,
          meta: { title: "添加商品" },
        },
        {
          name: "orders",
          path: "/orders",
          component: Order,
          meta: { title: "订单列表" },
        },
        {
          name: "reports",
          path: "/reports",
          component: Reports,
          meta: { title: "数据报表" },
        },
      ],
    },
  ],
});
// 路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === "/login") return next();
  const tokenStr = window.sessionStorage.getItem("token");
  if (!tokenStr) return next("/login");
  next();
});
router.afterEach((to, from) => {
  document.title = to.meta.title || "vue后台管理系统";
});
export default router;
