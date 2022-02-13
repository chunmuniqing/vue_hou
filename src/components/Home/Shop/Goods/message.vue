<template>
  <div>
    <el-button @click="tui">后退</el-button>
    <el-button @click="qian">前进</el-button>
    <ul>
      <li v-for="item in mes" :key="item.id">
        <!-- <router-link :to="`/goods/about/detail?name=${item.name}&context=${item.context}`">{{item.name}}</router-link> -->
        <!-- <router-link :to="{
          path:'/goods/about/detail',
          query:{
            name:item.name,
            context:item.context
          }
        }">{{item.name}}</router-link> -->
         <!-- <router-link :to="{
           name:'detail',
           query:{
             name:item.name,
             context:item.context
           }
         }">{{item.name}}</router-link> -->
         <!-- <router-link :to="`/goods/about/detail/${item.name}`">{{item.name}}</router-link> -->
         <router-link :to="{name:'detail',query:{name:item.name}}" replace>{{item.name}}</router-link>
        ---{{item.context}}</li>
    </ul>
  
      <router-view></router-view>
  
  </div>
</template>

<script>
export default {
  name: 'message',
  data(){
    return {
      mes:[
        {id:1,name:'zhangsan',context:'打篮球'},
        {id:2,name:'你是',context:'乒乓球'},
        {id:3,name:'王五',context:'踢足球'},
      ]
    }
  },
  methods:{
    tui(){
      this.$router.push({path:'/goods/home',query:{
        id:'我是从home传过来的'
      }})
      console.log(this.$router.go,222);
    },
    qian(){

    }
  }
}
</script>

<style  scoped>

</style>
