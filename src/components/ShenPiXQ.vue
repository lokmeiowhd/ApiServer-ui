<template>
  <div class="main">
    <div class="radioGroup">
        <div class="radioGroup_btn">
        <el-button icon='el-icon-back' style="width:100px;" type="info" @click="back"></el-button>
        </div>
        <div class="radioGroup_main">
        <el-radio-group v-model="statusCode" @change="changeStatus">
            <el-radio-button label="详情"></el-radio-button>
            <el-radio-button label="限额"></el-radio-button>
            <el-radio-button label="流程"></el-radio-button>
            <el-radio-button label="日志"></el-radio-button>
            <el-radio-button label="质押券"></el-radio-button>
            <el-radio-button label="指标"></el-radio-button>
        </el-radio-group>
        </div>
    </div>
    <div class="middle">
        <div v-if="statusCode=='详情'">
            <div class="xiangQing_main">
            <template v-for="(val,key) in detailData.R">
            <span class="fieldName" :key="key">{{val.NAME}}</span>
            <span class="fieldValue" :key="key">{{val['#text']}}</span>
            </template>
            </div>
        </div>
        <div v-if="statusCode=='质押券'">
            <p>无明细记录</p>
        </div>
        <div v-if="statusCode=='限额'" class="xianemain">
          <div>
            <template v-for="(val,key) in xianEData">
            <div :key="key" class="xianECard" :style="colorPick(val.LE)">
            <span class="fieldName" :key="key">限额名称</span>
            <span class="fieldValue" :key="key">{{val.NA}}</span>
            <span class="fieldName" :key="key">限额类型</span>
            <span class="fieldValue" :key="key">{{val.TY}}</span>
            <span class="fieldName" :key="key">交易前结果</span>
            <span class="fieldValue" :key="key">{{val.BF}}</span>
            <span class="fieldName" :key="key">交易后结果</span>
            <span class="fieldValue" :key="key">{{val.AF}}</span>
            <span class="fieldName" :key="key">差值</span>
            <span class="fieldValue" :key="key">{{val.DF}}</span>
            <span class="fieldName" :key="key">风险情况</span>
            <span class="fieldValue" :key="key">{{val.CA}}</span>
            <span class="fieldName" :key="key">限额级别</span>
            <span class="fieldValue" :key="key">{{val.LE}}</span>
            <span class="fieldName" :key="key">交易编号</span>
            <span class="fieldValue" :key="key">{{val.SID}}</span>
            <span class="fieldName" :key="key">指标名称</span>
            <span class="fieldValue" :key="key">{{val.ME}}</span>
            </div>
            </template>
            </div>
        </div>
        <div v-if="statusCode=='流程'">
          <el-tree :data="LiuChengData" :props="treeProps" :render-content="renderContent">
          </el-tree>
        </div>
        <div v-show="statusCode=='日志'">
          <div class="rizhi_main">
            <template v-for="(val,key) in RiZhiData">
              <div class="rizhi_card" :key="key">
              <div class="rizhiHeader" :key="key"><span>审批日志</span></div>
              <div class="rizhiBody">
            <span class="fieldNameRZ_All" :key="key">步骤</span>
            <span class="fieldValueRZ_All" :key="key">{{val.SN}}</span>
            <span class="fieldNameRZ" :key="key">名义人</span>
            <span class="fieldValueRZ" :key="key">{{val.NA}}</span>
            <span class="fieldNameRZ" :key="key">操作人</span>
            <span class="fieldValueRZ" :key="key">{{val.ON}}</span>
            <span class="fieldNameRZ" :key="key">角色</span>
            <span class="fieldValueRZ" :key="key">{{val.RN}}</span>
            <span class="fieldNameRZ" :key="key">分类</span>
            <span class="fieldValueRZ" :key="key">{{val.LY}}</span>
            <span class="fieldName" :key="key">操作时间</span>
            <span class="fieldValue" :key="key">{{val.OT}}</span>
            <span class="fieldName" :key="key">结果</span>
            <span class="fieldValue" :key="key">{{val.AN}}</span>
            <span class="fieldName" :key="key">审批意见</span>
            <span class="fieldValue" :key="key">{{val.OE}}</span>
              </div>
              </div>
            </template>
          </div>
        </div>
        <div v-if="statusCode=='指标'">
           <div class="zhibiao_main">
            <template v-for="(val,key) in ZhiBiaoData">
            <span class="fieldName" :key="key">{{val.NAME}}</span>
            <span class="fieldValue" :key="key">{{val.VALUE}}</span>
            </template>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
   components: {
    // 'ShenPiXQ': () => import('@/components/ShenPiXQ.vue')
  },
  computed:{
      colorPick(){
          return (item)=>{
              if(item=='0'){
                  return {'background-color':'green'}
              }else if(item=='1'){
                  return {'background-color':'yellow'}
              }else if(item=='2'){
                  return {'background-color':'brown'}
              }else if(item=='3'){
                  return {'background-color':'red'}
              }
          }
      }
  },
  data () {
    return {
      detailData: [],//详情数据
      statusCode:'详情',
      xianEData:[],//限额数据
      ZhiBiaoData:[],//指标数据
      RiZhiData:[],//日志数据
      LiuChengData:[],//流程数据
      treeProps:{children:'T',label: 'TX'}
    }
  },
   props: {
    ShenPiData: {type: Object}
  },
  methods: {
    //获取交易指标
    getJiaoYiZB(){
       let params={
            ataskid: this.ShenPiData.TID,
            ausercode: sessionStorage.getItem('usercode')
        }
    this.$http.get('api/mobilesingletradetarget', params, result => {
       this.ZhiBiaoData=result.data.rt.TARGETINDEX
      }, (err) => {
        this.$msg.message('获取交易指标数据失败：' + err, 'error')
      })
    },
    //获取交易日志
    getJiaoYiRZ(){
       let params={
            ataskid: this.ShenPiData.TID,
            ausercode: sessionStorage.getItem('usercode')
        }
    this.$http.get('api/mobilesingletracelog', params, result => {
       this.RiZhiData=result.data.rt.TL
      }, (err) => {
        this.$msg.message('获取交易日志数据失败：' + err, 'error')
      })
    },
    //获取交易流程图
     getJiaoYiLCT(){
       let params={
            ataskid: this.ShenPiData.TID,
            ausercode: sessionStorage.getItem('usercode')
        }
    this.$http.get('api/mobilesingletasknodetree', params, result => {
      this.LiuChengData=[];
       this.LiuChengData.push(result.data.rt.T)
      }, (err) => {
        this.$msg.message('获取交易流程图数据失败：' + err, 'error')
      })
    },
    //返回
    back(){
      this.$emit('toShenPiMX')
    },
    //获取交易限额
    getJiaoYiXE(){
        let params={
            ataskid: this.ShenPiData.TID,
            ausercode: sessionStorage.getItem('usercode'),
            aisincludeconfirmed: true,
            aisincludeordered:true
        }
    this.$http.get('api/mobilesinglelimitresult', params, result => {
       this.xianEData=result.data.rt.L
      }, (err) => {
        this.$msg.message('获取交易限额失败：' + err, 'error')
      })
    },
    //获取单笔交易详情
    getDanBiJYXQ(){
        let params={
            aSysOrdId:this.ShenPiData.ID,
            aUserCode:sessionStorage.getItem('usercode')
        }
    this.$http.get('api/mobilesingletradedetailnew', params, result => {
       this.detailData=result.data.rt.ROW
      }, (err) => {
        this.$msg.message('获取单笔交易失败：' + err, 'error')
      })
    },
    //切换要显示的详情界面
    changeStatus(){
        switch (this.statusCode) {
            case '限额':
                this.getJiaoYiXE();
                break;
            case '流程':
                this.getJiaoYiLCT();
                break;
            case '日志':
                this.getJiaoYiRZ();
                break;
            case '指标':
                this.getJiaoYiZB();
                break;
            default:
                break;
        }
    },
    //render函数，不同层级节点显示不同
    renderContent(h, { node, data, store }) {
      var imgStyle=''
      if(data.TY=='STEP'){
        imgStyle= {width: '20px',
        height: '21px',
        background: 'url("/static/images/ShenPiXQ/STEP.png")'}
      }else if(data.TY=='ROLE'){
        imgStyle= {width: '20px',
        height: '21px',
        background: 'url("/static/images/ShenPiXQ/ROLE.png")'}
      }else if(data.TY=='ROOT'){
        imgStyle= {width: '20px',
        height: '21px',
        background: 'url("/static/images/ShenPiXQ/ROOT.png")'}
      }
            return (
              <span style='display:flex;'>
                <div style={imgStyle}></div>
                <span style="margin-left:25px;">{node.label}</span>
              </span>
              );
          }
  },
  mounted(){
      this.getDanBiJYXQ()
  },
  created(){
    this.data=JSON.parse(sessionStorage.getItem('permissionitems'))
  }   
}
</script>

<style scoped>
.main {
  height: 100%;
  width: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
}
.radioGroup{
    height: 80px;
    width: 100%;
    display: flex;
    flex-direction: column;
}
.radioGroup_btn{
    width: 100%;
    height: 40px;
    display: flex;
    margin-bottom:10px;
}
.radioGroup_main{
    width: 100%;
    height: 10px;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
}
.xiangQing_main{
  width: 100%;
  display: flex;
  flex: 1;
  flex-direction: row;
  flex-wrap: wrap;
}
.middle{
    height: 10px;
    display: flex;
    flex: 1;
    width: 100%;
    flex-direction: column;
}
.xianemain{
    overflow-y: scroll;
    overflow-x: hidden;
    width: 100%;
    display: flex;
    height: 435px;
}
.fieldName{
    width: 50%;
    height: 15px;
}
.fieldValue{
  width: 50%;
  height: 15px;
  color: gray;
}
.xianECard{
  height: 200px;
  margin-bottom: 7px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.zhibiao_main{
  display: flex;
  width: 100%;
  height: 300px;
  margin-top: 20px;
  flex-wrap: wrap;
}
.rizhiBody{
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  width: 100%;
  height: 10px;
  background-color: lightcyan;
}
.rizhi_main{
  display: flex;
  width: 100%;
  height: 435px;
  margin-top: 10px;
  overflow-y: scroll;
  overflow-x: hidden;
  flex-wrap: wrap;
}
.rizhi_card{
  display: flex;
  width: 100%;
  height: 200px;
  flex-direction: column;
  margin-bottom: 20px;
}
.rizhiHeader{
  display: flex;
  width: 100%;
  height: 20px;
  background-color: aqua;
}
.fieldNameRZ{
  width: 25%;
  height: 15px;
}
.fieldValueRZ{
  width: 25%;
  height: 15px;
  color: gray;
}
.fieldNameRZ_All{
    width: 50%;
    height: 30px;
}
.fieldValueRZ_All{
  width: 50%;
  height: 30px;
  color: gray;
}
</style>