<template>
  <el-container class="home-container">
    <el-header>
      <div class="title">
        <img src="../../assets/images/logo.png" alt="error" />
        <span>电商后台管理系统</span>
      </div>
      <el-popover placement="top" width="160" v-model="visible">
        <p>您确定要退出并清空用户登录数据吗?</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="visible = false"
            >取消</el-button
          >
          <el-button type="primary" size="mini" @click="goOut">确定</el-button>
        </div>
        <el-button slot="reference" type="info" size="small">退出</el-button>
      </el-popover>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '60px':'200px'">
        <div class="toggle-btn" @click="toggleCli">|||</div>
        <el-menu
        :default-active="navPath"
        router
          :collapse-transition="false"
          :collapse="isCollapse"
          unique-opened
          default-active="2"
          @open="handleOpen"
          @close="handleClose"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#1488F5"
        >
          <el-submenu
            :index="index + ''"
            v-for="(item, index) in leftListData"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconList[item.id]"></i>
              <span> {{ item.authName }}</span>
            </template>
            <el-menu-item
            @click="saveState('/'+item.path)"
              :index="'/'+child.path"
              v-for="child in item.children"
              :key="child.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ child.authName }}</span>
              </template></el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      visible: false,
      isCollapse: false,
      leftListData: [],
      iconList: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-shangpin',
        101: 'iconfont icon-3702mima',
        102: 'iconfont icon-lock_fill',
        145: 'iconfont icon-baobiao'
      },
      navPath:''
    }
  },
  watch:{
    
  },
  methods: {
    goOut() {
      this.visible = false
      window.sessionStorage.clear('token')
      setTimeout(() => {
        this.$message.success('退出成功!')
        this.$router.push('/login')
      }, 0)
    },
    handleOpen(key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath)
    },
    getLeftList() {
      this.$api.home.goList().then((res) => {
        if (res.meta.status === 200) {
          this.leftListData = res.data
        } else {
          this.$message.error(res.meta.msg)
        }
      })
    },
    toggleCli() {
      this.isCollapse = !this.isCollapse
    },
    saveState(state){
      window.sessionStorage.setItem('navState',state)
      this.navPath = state
    }
  },
  created() {
    this.getLeftList()
    this.navPath = window.sessionStorage.getItem('navState')
  }
}
</script>

<style  scoped lang="less">
.home-container {
  width: 100%;
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #373d41;
  .title {
    display: flex;
    align-items: center;
    // padding-left: 10px;
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
    span {
      padding-left: 5px;
      color: #fff;
      font-size: 18px;
    }
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.el-menu {
  border: 0px;
}
.iconfont {
  margin-right: 10px;
}
.toggle-btn {
  background-color: #4a5064;
  font-size: 12px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
  color: #fff;
}
</style>
