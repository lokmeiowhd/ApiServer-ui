<template>
  <div class="container">
    <div v-show="showMain">
      <div class="userInfo">
        <img src="/static/images/Main/user.png">
        <span>{{userName}}</span>
      </div>
    <el-tabs v-model="activeName" type="card" tab-position="left" @tab-click="handleClick">
      <template v-for="(item, i) in data">
        <el-tab-pane :label="item.C" :name="item.N" :key="i">
        </el-tab-pane>
      </template>
    </el-tabs>
    </div>
    <div v-if="!showMain" class="shenpimx">
      <ShenPiMX :targetType="activeName" @toMain="toMain"></ShenPiMX>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    /** 手机审批明细 */
    'ShenPiMX': () => import('@/components/ShenPiMX.vue')
  },
  data () {
    return {
      activeName: '',
      data:[],
      showMain:true,
      userName:''
    }
  },
  methods: {
    handleClick (tab, event) {
      this.activeName=tab.label;
      if(this.activeName=='交易审批'){
        this.showMain=false;
      }
    },
    //返回主页
    toMain(){
      this.showMain=true;
    }
  },
  created(){
    this.data=JSON.parse(sessionStorage.getItem('permissionitems'))
    this.userName=sessionStorage.getItem('username')
  }   
}
</script>

<style scoped>
.container {
  height: 100%;
  width: 50%;
  top: 5%;
  left: 25%;
  background-color: white;
  position: absolute;
  display: flex;
  flex-direction: column;
  z-index: 1001;
}
.container >>> .el-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.container >>> .el-tabs__content {
  flex: 1;
}
.icon:hover{
 color: #409EFF
}
.container >>>.el-tabs__nav-next {
  z-index: 100;
}
.container >>>.el-tab-pane{
  height: 100%;
  width: 100%;
}
.userInfo{
  width:100%;
  height:70%;
  background-color: #409EFF;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.shenpimx{
  width: 100%;
  height: 100%;
}
</style>
