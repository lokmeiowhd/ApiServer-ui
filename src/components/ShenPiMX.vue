<template>
  <div class="main">
    <div class="shenpimx" v-show="!showSPDXQ">
    <div class="top">
    <el-button icon='el-icon-back' style="width:100px;" type="info" @click="back"></el-button>
      <el-select v-model="statusCode" style="width:100px;" size="small">
        <el-option
        v-for="item in statusOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
        </el-option>
      </el-select>
      <el-checkbox v-model="checked" size="medium" border>全选</el-checkbox>
    </div>
    <div class="tab">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" stretch>
      <el-tab-pane label="亲笔审批" name="first">亲笔审批</el-tab-pane>
      <el-tab-pane label="组合审批" name="second">组合审批</el-tab-pane>
    </el-tabs>
    </div>
    <div class="middle" v-show="ShenPiStatus=='亲笔审批'">
      <template v-for="(item,i) in tableData">
        <el-card :key="i" class="box-card" @click.native="ShenPiDXQ(item)">
          <div class="card_top">
            <span style="width:100px;background-color:yellow;">{{item.TY}}</span>
            <span>{{item.OR}}</span>
            <el-checkbox @click.stop.native="checkJYJL(item)" border size="small"></el-checkbox>
          </div>
          <div class="card_main">
            <template v-for="(val,key) in item.R">
            <span class="fieldName" :key="key">{{val.NAME}}</span>
            <span class="fieldValue" :key="key">{{val['#text']}}</span>
            </template>
          </div>
        </el-card>
      </template>
    </div>
    <div class="middle" v-show="ShenPiStatus=='组合审批'">
      <template v-for="(item,key) in groupData">
        <el-card :key="key" class="groupBtn">
          <div class="cardGroup">
          <div style="height:40px;">{{item.N}}</div>
          <div style="background-color:white;height:30px;margin-left:50px;width:30px;text-align:center;">{{item.CT}}</div>
          </div>
        </el-card>
      </template>
    </div>
  </div>
    <ShenPiXQ v-if="showSPDXQ" :ShenPiData="ShenPiData" @toShenPiMX="toShenPiMX"></ShenPiXQ>
    <div class="bottom">
      <el-button style="height:100%;width:50%;" type="primary" @click="auditRefuse">审批拒绝</el-button>
      <el-button style="height:100%;width:50%;" type="warning" @click="auditApply">审批同意</el-button>
    </div>
  </div>
</template>

<script>
export default {
   components: {
    /** 审批单明细 */
    'ShenPiXQ': () => import('@/components/ShenPiXQ.vue')
  },
  data () {
    return {
      activeName: '',
      checked:false,
      statusCode:'0',
      statusOptions:[
        {
          label:'待审批',
          value:'0'
        },
         {
          label:'待会签',
          value:'1'
        },
         {
          label:'提前审批',
          value:'2'
        },
         {
          label:'补审批',
          value:'3'
        },
         {
          label:'已审核',
          value:'4'
        },
         {
          label:'已会签',
          value:'5'
        },
         {
          label:'等待签核',
          value:'6'
        },
         {
          label:'已签核',
          value:'7'
        },
         {
          label:'我的提交',
          value:'9'
        }
      ],
      tableData:[],
      groupData:[],
      showSPDXQ:false,
      ShenPiData:'',
      ShenPiStatus:'亲笔审批',
      aNodeIds:[],
      shenPiYJ:''
    }
  },
   props: {
    targetType: {type: String}
  },
  methods: {
    //审批切换
    handleClick (tab, event) {
      this.ShenPiStatus=tab.label
    },
    //返回
    back(){
      this.$emit('toMain')
    },
    //返回审批明细界面
    toShenPiMX(){
      this.showSPDXQ=false;
    },
    //获取分页审批数据信息
    getShenPiSJ(){
        let params={
            aBegDate:'2019-01-01',
            aDataType:0,
            aEndDate:'2050-01-01',
            aGroupCode:0,
            aPage:0,
            aTargetType:'OTCTRADE',
            aUserCode:sessionStorage.getItem('usercode')
        }
    this.$http.post('api/gettasknodelstbypage', params, result => {
       this.tableData=result.data.rt.ROW
      }, (err) => {
        this.$msg.message('获取审批数据失败：' + err, 'error')
      })
    },
    //获取分组审批数据
    getGroupSPSJ(){
    let params={
            aBeg_date:'2019-01-01',
            aDataType:0,
            aEnd_date:'2050-01-01',
            aTargetType:'OTCTRADE',
            aUserCode:sessionStorage.getItem('usercode')
        }
    this.$http.post('api/mobilegettasknodegroup', params, result => {
       this.groupData=result.data.rt.G
      }, (err) => {
        this.$msg.message('获取审批数据失败：' + err, 'error')
      })
    },
    //审核拒绝
    auditRefuse(){
      if(this.aNodeIds.length==0){
        this.$message({
          type:'warning',
          message:'请勾选至少一个审批单！'
        });
        return
      }
      this.$prompt('请输入审批意见', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          this.shenPiYJ=value
          this.doShenPi('REJECT');
        }).catch(() => {
         this.shenPiYJ=''      
        });
    },
    //审核同意
    auditApply(){
      if(this.aNodeIds.length==0){
        this.$message({
          type:'warning',
          message:'请勾选至少一个审批单！'
        });
        return
      }
      this.$prompt('请输入审批意见', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          this.shenPiYJ=value
          this.doShenPi('AGREE');
        }).catch(() => {
         this.shenPiYJ=''      
        });
    },
    //勾选单笔交易记录
    checkJYJL(item){
      this.aNodeIds.push(item.NID);
    },
    //审批单详情
    ShenPiDXQ(item){
      this.showSPDXQ=true;
      this.ShenPiData=item;
    },
    //执行审批操作
    doShenPi(action){
      let params={
            anodeids:this.aNodeIds.toString(),
            adatatypecurrent:this.statusCode,
            targettype:'OTCTRADE',
            ausercode:sessionStorage.getItem('usercode')
        }
    this.$http.get('api/mobilecheckbeforeactionbynodeid_batch', params, result => {
      if(!result.data.rt.ACTION){
        this.$message({
          type:'error',
          message:result.data.rt.RE.RM
        });
        return
      }
      if((result.data.rt.ACTION['ISAGREE']&&action=='AGREE')||(result.data.rt.ACTION['ISREJECT']&&action=='REJECT')){
        let params1={
            aNodeIds:this.aNodeIds.toString(),
            aAction:action=='AGREE'?1:2,
            targetType:'OTCTRADE',
            aUserCode:sessionStorage.getItem('usercode'),
            actionNote:this.shenPiYJ,
            aCCRoles:null,
            aDataTypeCurrent:this.statusCode
        }
    this.$http.post('api/mobileapprovetaskbynodeid_batch', params1, result1 => {
       this.$message({
         type:'success',
         message:result1.data.rt.RE.RM
       })
      }, (err) => {
        this.$msg.message('批量审批操作失败：' + err, 'error')
      });
      }
      }, (err) => {
        this.$msg.message('获取批量审批前检查失败：' + err, 'error')
      })
    }
  },
  mounted(){
      this.getShenPiSJ();
      this.getGroupSPSJ();
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
.tab{
  height: 41px;
  width: 100%;
  display: flex;
  margin-top: 5px;
}
.top{
  height: 40px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: aqua;
}
.bottom{
  height: 55px;
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-bottom: 50px;
}
.middle{
  display: flex;
  flex: 1;
  width: 100%;
  height: 10px;
  flex-direction: column;
  overflow-y: scroll;
  overflow-x: hidden;
}
.shenpimx{
  display: flex;
  flex: 1;
  height: 10px;
  width: 100%;
  flex-direction: column;
}
.card_top{
  width: 100%;
  height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.card_main{
  width: 100%;
  display: flex;
  flex: 1;
  flex-direction: row;
  flex-wrap: wrap;
}
.box-card{
  height: 480px;
}
.middle >>> .el-card, .el-message {
    overflow: visible;
}
.fieldName{
  width: 25%;
  height: 15px;
}
.fieldValue{
  width: 25%;
  height: 15px;
  color: gray;
}
.groupBtn{
  display: flex;
  width: 100%;
  height: 50px;
  margin-top: 15px;
  background-color: cyan;
  flex-direction: row;
}
.cardGroup{
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
}
</style>
