<template>
  <div>
    <ul>
      <li>名字:{{id}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'detail',
  props:['id'],
  mounted(){
    // console.log(this.$route);
  },
  watch:{
    $route(newVal){
      // console.log(newVal.query.name,11);
    }
  }
}
</script>

<style  scoped>

</style>
