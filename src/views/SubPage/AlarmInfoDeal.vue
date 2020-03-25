<template>
  <div class="myContainer">
    <x-header :left-options="{backText: ''}" @click.native="goback">告警处理</x-header>

    <!--告警信息的内容开始-->
    <div  class="AlarmInfo" >
      <div class="cellTop" style="margin:10px auto" >告警信息</div>
      <flexbox v-for="(item, index) in alarmData" :key="index">
        <flexbox-item >
          <div class="alarmContent">
            <p><span style="width:30%">{{item.structure_name}}</span><span style="width:70%">&nbsp;&nbsp;{{item.name}}</span></p>
            <p><span >告警名称&nbsp;:&nbsp;{{item.typeName}}</span></p>
            <p><span >告警级别&nbsp;:&nbsp;{{item.level}}&nbsp;{{item.scope}}</span></p>
            <p><span style="word-break:break-all;">告警内容&nbsp;:&nbsp;{{item.content}}</span></p>
            <p><span >告警值&nbsp;:&nbsp;{{item.value_scale}}</span></p>
            <p><span >发生时间&nbsp;:&nbsp;{{item.time}}</span></p>
          </div>
        </flexbox-item>
      </flexbox>
    </div>

    <!--传感器信息-->
    <div class="AlarmInfo">
      <div class="cellTop" style="margin:10px auto" >数据项信息</div>
      <div class="sensorInfo" v-for="item in alarmData" :key="item"  @click="toSensorInfoView(item)">
        <flexbox >
          <flexbox-item >数据项编号：{{item.dataItemCode}}</flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item>数据项类型：{{item.factor_type}}</flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item>测量单位：{{item.unit}}</flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item>当前值：{{item.value}} <span style="margin-left: 10px">{{item.time}}</span></flexbox-item>
        </flexbox>
      </div>
    </div>

    <div class="AlarmInfo" v-if="suggestionList&&suggestionList.length>0">
      <div class="cellTop" style="margin:10px auto" >相关处理意见</div>
      <div class="sensorInfo">
        <flexbox  v-for="(item,index) in suggestionList" :key="index">
          <flexbox-item >
            <div class="alarmContent suggestionInfo" style="padding: 0;width:100%;">
              <p><span>处理人：{{item.username ? item.username : "--" }}</span></p>
              <p><span >处理时间：{{item.time ? item.time : "--" }}</span></p>
              <p><span >处理意见：{{item.suggestion}}</span></p>
            </div>
          </flexbox-item>

        </flexbox>
      </div>
    </div>

    <div class="AlarmInfo" >
      <div class="cellTop" style="margin:10px auto" >处理意见</div>
      <flexbox class="alarmSubmit">
        <flexbox-item >
          <x-textarea  :max="200" placeholder="请填写处理意见" :show-counter="false" :height="100" :rows="8" :cols="30" v-model="interruptContent"></x-textarea>
        </flexbox-item>
      </flexbox>
    </div>

    <!--告警信息的内容结束-->
    <div class="space_30"></div>

    <x-button plain    @click.native="toCheck" v-if="alarmData&&alarmData.length>0" >确认</x-button>
    <x-button plain    @click.native="toAddAttention"  class="attentionBtn" v-if="alarmData&&alarmData.length>0&&showAttention" >添加关注</x-button>
    <x-button plain    @click.native="toCancelAttention"  class="attentionBtn" v-if="alarmData&&alarmData.length>0&&!showAttention" >取消关注</x-button>
    <x-button plain    @click.native="toIgnore" class="cancelBtn" v-if="alarmData&&alarmData.length>0&&showIgnore">忽略类似告警</x-button>

    <div class="space_30"></div>
  </div>
</template>
<script>
  import {setCookie, getCookie, delCookie} from '../../assets/js/cookie.js'

  var publicapi = require('../../assets/js/publicapi.js')
  var api = publicapi.proxy.monitoring_url;
  var acquisition_url = publicapi.proxy.acquisition_url;  //
  var management_url = publicapi.proxy.management_url;
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        alarmData:[],//告警信息的数据
        sensorData:[],//传感器信息
        accessToken:getCookie("accessToken"),
        interruptContent:'',//中断原因
        suggestionList:[],//已阅用户
        loginInfo: localStorage.getItem("loginInfo") ? JSON.parse(localStorage.getItem("loginInfo")) : "", //登录成功，存储在本地的信息
        showAttention:true,//是否展示关注
        showIgnore:true,//是否显示忽略
      }
    },
    computed: {
      ...mapGetters(['count', 'moreBridgePageUrl','imgUrl']),
    },
    beforeCreate() {
      this.$store.dispatch('initcount')
    },
    created() {
        //得到告警信息的本地数据
      this.getAlarmData();
    },
    methods: {
      /*点击返回*/
      goback(){
        this.$router.replace("/Index")
      },
      /*得到告警信息*/
      getAlarmData(){
          this.alarmData=[];
          this.alarmData.push(localStorage.getItem("alarmInfo")?JSON.parse(localStorage.getItem("alarmInfo")):"");
          if(this.alarmData&&this.alarmData.length>0){
            if(this.alarmData[0].attention_time&&this.alarmData[0].attention_time!=""){
              this.showAttention=false;
            }
            if(this.alarmData[0].handInfo!=null&&this.alarmData[0].handInfo){
              var suggestionList=JSON.parse(this.alarmData[0].handInfo).suggestionList;
              if(suggestionList&&suggestionList.length>0){
                this.suggestionList=JSON.parse(JSON.parse(this.alarmData[0].handInfo).suggestionList);
              }
            }
          }
          //得到本地数据之后，再通过ID查询详细信息
      },
      /*得到传感器信息*/
      getSensorData(){
        this.$vux.loading.show({
          text: '正在加载...'
        })
        /*调用接口取值*/
        this.$http.get(acquisition_url+'/acquisiteEquipment/findSensorDetailForWindow',{
          params:{
            id:this.alarmData[0].sensorId,
            accessToken:this.accessToken,
          }
        }).then((res) => {
          var resData=res.data;
          if(resData.resultCode==1){
              this.sensorData=[];
              if(resData.data){
                this.sensorData.push(resData.data)
              }

          }else if (resData.resultCode == 0) {
            this.$vux.toast.text(res.data.msg);
          } else {
            this.$vux.toast.text(res.data.msg);
          }
          this.$vux.loading.hide()
        },(error) =>{
          this.$vux.loading.hide()
        });
      },

      /*监测是否填写记录*/
      toCheck(){
        const scope = this;
        if(scope.interruptContent&&scope.interruptContent!=""){
          scope.post_monitor();
        }else{
          scope.$vux.confirm.show({
            // 组件除show外的属性
            title:"提示",
            content:"确定不填写内容直接返回？",
            onCancel () {

            },
            onConfirm () {
              scope.post_monitor();
            }
          })
        }
      },
      //提交记录
      post_monitor() {
        this.$vux.loading.show({
          text: '正在提交...'
        })
        let params = new FormData();
        params.append('id',this.alarmData[0].id);
        params.append('username',this.loginInfo.username);
        params.append('suggestion',this.interruptContent!=""?this.interruptContent:"");
        this.$http.post(acquisition_url + '/alarm/solveFaultInfo', params, {
          headers: {
            'Content-Type': 'multipart/form-data',
            accessToken: this.accessToken
          }
        }).then((res) => {
          if (res.data.resultCode == 1) {
              this.$vux.toast.text('提交成功');
              const scope = this;
              setTimeout(function() { scope.$router.go(-1)},1500)
          } else if (res.data.resultCode == 0) {
            this.$vux.toast.text(res.data.msg);
          } else {
            this.$vux.toast.text(res.data.msg);
          }
          this.$vux.loading.hide();
        },(error)=>{
          this.$vux.loading.hide()
        })
      },

      /*跳转到历史图表的数据*/
      toSensorInfoView(item){
        localStorage.setItem("sensorInfo",JSON.stringify(item));
        this.$router.push({
          name:"查看传感器信息",
          params:{
            type:'alarmInfoDeal'
          }
        })
      },

      //添加关注
      toAddAttention(){
        const scope = this;
        scope.$vux.confirm.show({
          title: "提示",
          content: "是否确定添加关注?",
          onCancel() {

          },
          onConfirm() {
            scope.showAttention=false;
            scope.attentionAlarmByType('add');
          }
        })
      },
      //取消关注
      toCancelAttention(){
        const scope = this;
        scope.$vux.confirm.show({
          title: "提示",
          content: "是否确定取消关注?",
          onCancel() {

          },
          onConfirm() {
            scope.showAttention=true;
            scope.attentionAlarmByType('cancle');
          }
        })
      },
      /*忽略功能*/
      toIgnore() {
        const scope = this;
        scope.$vux.confirm.show({
          title: "提示",
          content: "是否确定忽略?",
          onCancel() {

          },
          onConfirm() {
            // console.log(scope.alarmData)
            scope.showIgnore=false;
            scope.delLog();
          }
        })
      },
      /*向服务器请求删除数据*/
      delLog() {
        this.$vux.loading.show({
          text: '正在操作...'
        })
        this.$http.get(acquisition_url + '/alarm/solveAllFaultInfo', {
          params: {
            accessToken: this.accessToken,
            type:this.alarmData[0].type,
            level:this.alarmData[0].level,
            scode:this.alarmData[0].scode,
            suggestion:"",
            username:this.loginInfo.username,
          }
        }).then((res) => {
          var resData = res.data;
          if (resData.resultCode == 1) {
            this.$vux.toast.text(resData.msg);
          } else if (resData.resultCode == 0) {
            this.$vux.toast.text(resData.msg);
          } else {
            this.$vux.toast.text(resData.msg);
          }
          this.$vux.loading.hide();

        }, (error) => {
          this.$vux.loading.hide()
        })
      },

      /*添加关注的功能*/
      attentionAlarmByType(type){
        this.$vux.loading.show({
          text: '正在操作...'
        })
        this.$http.get(acquisition_url + '/alarm/attentionAlarmByType', {
          params: {
            id:this.alarmData[0].id,
            type:type
          }
        }).then((res) => {
          var resData = res.data;
          if (resData.resultCode == 1) {
            this.$vux.toast.text(resData.msg);
          } else if (resData.resultCode == 0) {
            this.$vux.toast.text(resData.msg);
          } else {
            this.$vux.toast.text(resData.msg);
          }
          this.$vux.loading.hide();

        }, (error) => {
          this.$vux.loading.hide()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>

  .myContainer {
    /*告警内容样式开始*/

    .AlarmInfo{
      .vux-flexbox{

        color:#666;
        font-size:12px;
      }
      .alarmContent{
        clear:both;
        background: #fff;
        width:90%;
        margin: 0 auto;
        padding: 10px 10px;
        box-sizing: border-box;
        border-radius: 10px;
        p{
          line-height: 21px;
          min-height:25px;
        }
        p:first-child{
          span{
            color: #3A4972;
            font-weight: 600;
            font-size: 15px;
            font-family: 'MicrosoftYaHei Regular';
          }
        }
        p:last-child{
          margin-bottom: 0;
        }
        span{
        
          font-size: 13px;
          font-weight: 200;
          color: #343F65;
          margin-right: 20px;
        }
        span:last-child{
          margin-right: 0px;
        }

        .weui-btn:last-child {
          margin-bottom: 0;
          background: #F07F6C;
        }

      }
      .suggestionInfo{
        span{
          width:100%;
          white-space: normal;
        }
      }

      .weui-cells{
        margin-top: 0;
      }


      .alarmSubmit{
        background: #fff;
        width: 90%;
        border-radius: 10px;
        margin: 0 auto;
      }
      /*告警内容样式结束*/



    }
    .weui-btn{
      font-size:16px;
      width:90%;
      border:none;
      background: #00D1EF;
      color:#EAFAFD;
      border-radius: 50px;
    }
    .attentionBtn{
      background: #FF4444;
    }

    .cancelBtn{
      background: #C0C0C0;
    }

  }
</style>


