<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods/add',exact:'true' }" >商品分类</el-breadcrumb-item>
    </el-breadcrumb>
      <el-button type="primary" @click="addCommodity">添加商品</el-button>
    <router-link to="/goods/home" active-class="active">home</router-link>
    <router-link to="/goods/about" active-class="active">about</router-link>
    <keep-alive exclude="Add">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'Goods',
 methods:{
    addCommodity(){
      this.$router.push({name:'add'})
    }
 }
}
</script>

<style  scoped>
.active {
  color:green!important;
}
</style>
