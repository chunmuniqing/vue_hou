<template>
  <div>
    <ul>
      <li>1</li>
      <li>2</li>
      <li>3</li>
      <li>4</li>
      <li>5</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'home',
   beforeDestroy(){
    console.log('home被销毁');
  },
  mounted(){
    console.log('home被挂载',this);
    window.homeRoute=this.$route
    window.homeRouter=this.$router
  }
}
</script>

<style  scoped>
ul{
  width: 400px;
  height: 400px;
  border: 1px solid red;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;
  flex-wrap: no-wrap;
  
}
li {
  width: 200px;
  height: 200px;
  background-color: aqua;
  border: 1px solid green;
  
}
li:last-child {
  border: 1px solid black;
  align-self: flex-start;
}
</style>
