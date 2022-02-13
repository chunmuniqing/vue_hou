<template>
  <div>
    

    <h1>about</h1>
    <Message></Message>
    <h3>{{ Date.parse(new Date()) | dateFormat }}</h3>
  
  </div>
</template>

<script>
import Message from './message.vue'
export default {
  name: 'about',
  data() {
    return {}
  },
  beforeDestroy() {
    console.log('about被销毁')
  },
  mounted() {
    console.log('about被挂载', this)
    window.aboutRoute = this.$route
    window.aboutRouter = this.$router
  },
  components: {
    Message
  },
  methods:{
   
  }
}
</script>

<style  scoped>
</style>
