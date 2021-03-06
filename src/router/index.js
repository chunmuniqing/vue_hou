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
      meta: { title: "vue??????" },
    },
    {
      path: "/home",
      component: Home,
      redirect: "/welcome",
      meta: { isAuth: true, title: "vue??????" },
      children: [
        { path: "/welcome", component: WelCome, meta: { title: "??????" } },
        { path: "/users", component: User, meta: { title: "????????????" } },
        { path: "/rights", component: Rights, meta: { title: "????????????" } },
        { path: "/roles", component: Roles, meta: { title: "????????????" } },
        {
          path: "/categories",
          component: Categories,
          meta: { title: "????????????" },
        },
        { path: "/params", component: Params, meta: { title: "????????????" } },
        {
          path: "/goods",
          component: Goods,
          children: [
            { path: "home", component: home, meta: { title: "????????????" } },

            {
              path: "/goods/about",
              component: about,
              name: "about",
              meta: { title: "??????" },
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
          meta: { title: "????????????" },
        },
        {
          name: "orders",
          path: "/orders",
          component: Order,
          meta: { title: "????????????" },
        },
        {
          name: "reports",
          path: "/reports",
          component: Reports,
          meta: { title: "????????????" },
        },
      ],
    },
  ],
});
// ??????????????????
router.beforeEach((to, from, next) => {
  if (to.path === "/login") return next();
  const tokenStr = window.sessionStorage.getItem("token");
  if (!tokenStr) return next("/login");
  next();
});
router.afterEach((to, from) => {
  document.title = to.meta.title || "vue??????????????????";
});
export default router;
