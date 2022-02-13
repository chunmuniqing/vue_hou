<template>
  <div class="page">
    <div class="login-container">
      <div class="log">
        <img src="../../assets/images/logo.png" alt="图片错误" />
      </div>
      <el-form
        ref="loginForm"
        :model="loginForm"
        label-width="0px"
        :rules="loginRules"
        class="login_form"
      >
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名称"
            ><i slot="prefix" class="iconfont icon-user"></i
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            show-password
            placeholder="请输入密码"
            :validate-event="false"
            ><i slot="prefix" class="el-input__icon el-icon-search"></i
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-row type="flex" justify="end">
            <el-button
              type="primary"
              @click="onSubmit('loginForm')"
              size="small"
              :loading="isLogin"
              >登录</el-button
            >
            <el-button
              type="info"
              @click="onReset('loginForm')"
              size="small"
              :loading="isLogin"
              >重置</el-button
            >
          </el-row>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (!/^[\w_]{6,16}$/.test(value)) {
        callback(new Error('密码需为6-16位的数字大小写字母或下划线'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ],
        password: [{ validator: validatePass }]
      },
      isLogin: false
    }
  },
  methods: {
    onSubmit(formName) {
      this.isLogin = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$api.login.goLogin(this.loginForm).then((res) => {
            if (res.meta.status === 200) {
              let password = window.encodeURIComponent(this.loginForm.password)
              window.sessionStorage.setItem('token', res.data.token)
              window.localStorage.setItem('username', this.loginForm.username)
              window.localStorage.setItem('psd', password)

              this.$message.success(res.meta.msg)
              setTimeout(() => {
                this.isLogin = false

                this.$router.push('/home')
              }, 0)
            } else {
              this.isLogin = false
              this.$message.error(res.meta.msg)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onReset(formName) {
      this.$refs[formName].resetFields()
    },
    goHome() {
      const loading = this.$loading({
        lock: true, //lock的修改符--默认是false
        text: '登录中...', //显示在加载图标下方的加载文案
        spinner: 'el-icon-loading', //自定义加载图标类名
        background: 'rgba(0, 0, 0, 0.3)', //遮罩层颜色
        target: document.querySelector('#table') //loadin覆盖的dom元素节点
      })
      if (window.sessionStorage.getItem('token')) {
        this.loginForm.username = window.localStorage.getItem('username')
        this.loginForm.password = window.decodeURIComponent(
          window.localStorage.getItem('psd')
        )
        console.log(this.loginForm, 'this.loginForm')
        this.$api.login.goLogin(this.loginForm).then((res) => {
          if (!this.$fn.error) {
            window.sessionStorage.clear('token')
            window.localStorage.clear('username')
            window.localStorage.clear('psd')
            return
          }
          loading.close()
          this.$message.success(res.meta.msg)
          setTimeout(() => {
            this.$router.push('/home')
          }, 0)
        })
      } else {
        window.localStorage.clear('username')
        window.localStorage.clear('psd')
        //成功回调函数停止加载
        loading.close()
      }
    }
  },
  created() {},
  mounted() {
    this.goHome()
  }
}
</script>

<style  scoped lang="less">
.page {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2b4b6b;
  .login-container {
    position: relative;
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
  }
}
.log {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login_form {
  position: absolute;
  width: 100%;
  bottom: 0;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
