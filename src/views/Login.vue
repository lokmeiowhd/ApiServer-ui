<template>
  <div class="main" v-loading="loading">
    <div class="title">
      <span>手机审批演示</span>
    </div>
    <div class="middle">
      <div class="middleLeft">
      </div>
      <div class="middleRight">
        <div class="login" @keydown.enter="login()">
          <div class="loginTitle">
            <span>用户登录</span>
          </div>
          <div class="userText">
            <span>用户名：</span>
            <el-input class="textbox" placeholder="请输入用户名" v-model="usercode" clearable></el-input>
          </div>
          <div class="userText">
            <span style="padding-left:16px;">密码：</span>
            <el-input class="textbox" placeholder="请输入密码" v-model="password" show-password></el-input>
          </div>
          <div class="userText">
            <span>验证码：</span>
            <el-input class="textbox" v-model="checkcode"></el-input>
          </div>
          <div style="width:62%;height:50px;padding-left:19%;">
            <el-button type="primary" style="width:100%" @click="login()">登 录</el-button>
          </div>
          <div class="remberPassword">
            <el-checkbox v-model="checked">记住密码</el-checkbox>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      usercode: '',
      password: '',
      checkcode: '',
      checked: false,
      loading: false
    }
  },
  created () {
    if (sessionStorage.getItem('usercode') != null) {
      this.usercode = sessionStorage.getItem('usercode')
      this.password = sessionStorage.getItem('password')
      this.checked = true
    }
    if (this.password === '') {
      this.checked = false
    }
    sessionStorage.removeItem('permissionitems')
  },
  methods: {
    login () {
      if (this.usercode === '' || this.password === '') {
        this.$msg.message('请输入用户名和密码！', 'error')
        return
      }
      let params = {
        ausercode: this.usercode,
        apwd: this.password,
        amac: '1'
      }
      this.loading = true
      let thisdata = this
      this.$http.get('api/login', params, data => {
        if (data && data.rt) {
          sessionStorage.removeItem('usercode')
          sessionStorage.removeItem('password')
          sessionStorage.setItem('usercode', thisdata.usercode) 
          sessionStorage.setItem('username', data.rt.RE.RM)
          sessionStorage.setItem('permissionitems', JSON.stringify(data.rt.M)) // 可浏览菜单权限
          debugger
          if (this.checked) {
            sessionStorage.setItem('password', thisdata.password)
          } else {
            sessionStorage.setItem('password', '')
          }
          this.$router.replace('/Main')
        } else if (data) {
          this.$msg.message('登录失败：', 'error')
        }
        this.loading = false
      }, (err) => {
        this.$msg.message('登录失败：' + err, 'error')
        this.loading = false
      })
    }
  }
}
</script>
<style scoped>
.main {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  user-select: none;
  background-color: white;
}
.title {
  height: 10%;
  min-height: 50px;
  font-family: "微软雅黑";
  font-size: 25px;
  font-weight: bold;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: row;
}
.middle {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("/static/images/Login/backgound.png");
  flex: 1;
  width: 100%;
  height: 20px;
  min-height: 400px;
}
.middleLeft{
 display: flex;
  width: 10px;
  flex: 1;
  min-width: 860px;
}
.middleRight {
  display: flex;
  align-items: center;
  width: 25%;
  height: 100%;
  min-width: 360px;
  padding-right: 9%;
}

.login {
  background-color: white;
  width: 340px;
  height: 400px;
  margin-left: 50px;
  border-radius: 4px;
  box-shadow: -15px 15px 15px rgba(6, 17, 47, 0.7);
}
.loginTitle {
  display: flex;
  color: white;
  align-items: center;
  font-family: '微软雅黑';
  justify-content: center;
  flex: 1;
  width: 100%;
  height: 50px;
  font-size: 19px;
  background-color: RGB(0, 153, 255);
}
.userText {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%;
  height: 40px;
  font-size: 20px;
  padding: 16px;
      padding: 16px;
    white-space: nowrap;
}
.remberPassword {
  display: flex;
  flex: 1;
  width: 90%;
  height: 50px;
  padding: 15px;
}
</style>
