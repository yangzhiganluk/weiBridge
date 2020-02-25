<template>
  <div class="myContainer">
    <x-header :left-options="{backText: ''}" @click.native="goback">{{bridgeInfo.shortname}}</x-header>
    <div class="AlarmInfo">
      <div class="cellTop" style="margin:10px auto">{{statisticsType}}</div>
      <div class="sensorInfo">
        <div class="selectOption">
          <flexbox>
            <flexbox-item :span="4">桥梁</flexbox-item>
            <flexbox-item :span="8">
              <el-select v-model="currentBridge" placeholder="请选择"  @change="changeBridge" class="setWid">
                <el-option
                  v-for="(item,index) in bridgeList"
                  :key="index"
                  :label="item.project_name"
                  :value="item.project_name"
                >
                </el-option>
              </el-select>
            </flexbox-item>
          </flexbox>
          <flexbox>
            <flexbox-item :span="4">日期</flexbox-item>
            <flexbox-item :span="8">
              <el-select v-model="currentFormatDate" placeholder="请选择"  @change="changeDateType" class="setWid">
                <el-option
                  v-for="(item,index) in dateList"
                  :key="index"
                  :label="item.format"
                  :value="item.format"
                >
                </el-option>
              </el-select>
            </flexbox-item>
          </flexbox>
          <flexbox v-if="currentFormatDate=='自定义'">
            <flexbox-item :span="4">从</flexbox-item>
            <flexbox-item :span="8">
              <el-date-picker
                v-model="selectStartTime"
                :type="selectTimeType"
                :picker-options="pickerOptions"
                @change="getSelectStartTime"
                :value-format="datetimeFormat"
                :clearable=false
                class="dateStyle"
                format="yyyy-MM-dd"
              >
              </el-date-picker>
            </flexbox-item>
          </flexbox>
          <flexbox v-if="currentFormatDate=='自定义'">
            <flexbox-item :span="4">至</flexbox-item>
            <flexbox-item :span="8">
              <el-date-picker
                v-model="selectEndTime"
                :type="selectTimeType"
                :picker-options="pickerOptions"
                @change="getSelectEndTime"
                :value-format="datetimeFormat"
                :clearable=false
                format="yyyy-MM-dd"
                class="dateStyle"
              >
              </el-date-picker>
            </flexbox-item>
          </flexbox>
        </div>
      </div>


      <div class="space_50"></div>
      <x-button plain @click.native="toCheck">查询</x-button>
      <div class="space_20"></div>

    </div>


  </div>
</template>
<script>
  import {setCookie, getCookie, delCookie} from '../../../assets/js/cookie.js'
  var publicapi = require('../../../assets/js/publicapi.js')
  var api = publicapi.proxy.monitoring_url;
  var acquisition_url = publicapi.proxy.acquisition_url;  //
  var management_url = publicapi.proxy.management_url;
  var  monitoring_url=publicapi.proxy.monitoring_url;
  import {mapGetters} from 'vuex'
  import {getNowFormatDate} from '../../../assets/js/transfromTime';
  import {getPastFormatDate,dateFormat} from '../../../assets/js/transfromTime';

  import {getPastFormatDateBySelect} from '../../../assets/js/transfromTime';
  import {getNowFormatDateBySelect} from '../../../assets/js/transfromTime';
  import {formatDate} from '../../../assets/js/transfromTime';


  export default {
    data() {
      return {
        accessToken: getCookie("accessToken"),

        bridgeList: localStorage.getItem("bridgeList")?JSON.parse(localStorage.getItem("bridgeList")):"", //桥梁列表
        currentBridge:"",//当前选中的桥梁
        loginInfo: localStorage.getItem("loginInfo") ? JSON.parse(localStorage.getItem("loginInfo")) : "", //登录成功，存储在本地的信息
        bridgeInfo:localStorage.getItem("bridgeInfo")?JSON.parse(localStorage.getItem("bridgeInfo")):"",


        statisticsType:'',//统计的类型


        dateList: [
          {format: '当月'},
          {format: '上个月'},
          {format: '今年'},
          {format: '上一年'},
          {format: '自定义'},
        ], //日期的格式
        currentFormatDate:"当月",//当前选中的日期类型

        selectStartTime:new Date(new Date().getTime() - 24*60*60*1000),//选取的时间
        selectEndTime:new Date(new Date().getTime() - 24*60*60*1000),//选取的时间

        datetimeFormat:"yyyy-MM-dd",//时间的格式


        ifSelectStartTime:false,//判断是否选择了开始时间，如果没有，就以默认时间为准
        ifSelectEndTime:false,//判断是否选择了结束时间，如果没有，就以默认时间为准

        selectTimeType:'date',//时间选择器的类型

        pickerOptions: {
          disabledDate: (time) => {
            //1483200000 是2017-01-01 00:00:00
            var yesterday=new Date(new Date().setDate(new Date().getDate()-1));  //前天，精确到日期
            return time.getTime()-1 >yesterday || time.getTime() < new Date(this.bridgeDataTime).setDate(new Date(this.bridgeDataTime).getDate()-1);
          }
        },

        historydata:[], //历史数据图表数据,
      }
    },
    computed: {
      // ...mapGetters(['username']),
      ...mapGetters(['count', 'moreBridgePageUrl', 'imgUrl']),
    },
    beforeCreate() {
      this.$store.dispatch('initcount');
    },
    created() {
      //接受路由传递过来的参数
     /* if(this.$route.params.statisticsType&&this.$route.params.statisticsType!=""){
        this.statisticsType=this.$route.params.statisticsType;
      }*/
      this.statisticsType=sessionStorage.getItem("statisticsType")?sessionStorage.getItem("statisticsType"):"";
    },
    mounted(){
      this.judgeLogin();  //获取登录状态
      // this.getList();
    },
    methods: {
      /*验证登录*/
      judgeLogin(){
        if(this.accessToken&&this.loginInfo&&this.loginInfo!=""){
          this.getList();
        }else{
          this.$router.push("Oauth")
        }

      },
      /*得到桥梁列表*/
      getList() {

        if(this.bridgeList&&this.bridgeList.length>0){
          if(this.bridgeInfo&&this.bridgeInfo!=""){
            this.currentBridge=this.bridgeInfo.shortname;
            for(var i=0;i<this.bridgeList.length;i++){
              let datas=this.bridgeList[i];
              if(datas.shortname==this.currentBridge){
                this.currentBridgeIndex=i;
              }
            }
          }else{
            this.currentBridge=this.bridgeList[0].shortname;
            this.currentBridgeIndex=0;
          }
        }else{
          this.$vux.toast.text('获取桥梁信息失败，请退出重新登录');
        }


      },
      //桥梁下拉框改变的事件
      changeBridge(e){
        for(var i=0;i<this.bridgeList.length;i++){
          let datas=this.bridgeList[i];
          if(e==datas.shortname){
            localStorage.setItem("bridgeInfo",JSON.stringify(datas))
            this.currentBridgeIndex=i;
          }
        }
      },
      /*日期下拉框改变的事件*/
      changeDateType(){

      },

      /*点击返回*/
      goback(){
        this.$router.replace("/WorkState")
      },

      /*选择开始时间*/
      getSelectStartTime(val){
        //
        this.ifSelectStartTime=true;
        if(this.selectEndTime<this.selectStartTime){
          this.$vux.toast.text("结束时间不能小于起始时间!");
        }else{
        }
      },
      /*选择结束时间*/
      getSelectEndTime(val){
        // this.getChartsDataByType();
        this.ifSelectEndTime=true;
        if(this.selectEndTime<this.selectStartTime){
          this.$vux.toast.text("结束时间不能小于起始时间!");
        }else{
        }
      },

      //执行查询的方法
      toCheck(){
        var name="";//需要跳转到路由的名称
        if(this.statisticsType=='数据采集'){
          name='统计数据采集'
        }else if(this.statisticsType=='桥梁告警'){
          name='统计桥梁告警'
        }else if(this.statisticsType=='设备故障'){
          name='统计设备故障'
        }
        var date=new Date();
        var currentYear=date.getFullYear();
        var lastYear=date.getFullYear()-1;
        var currentMonth = (date.getMonth() + 1) < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);//当月
        var lastMonth = (date.getMonth()) < 9 ? "0" + (date.getMonth()) : (date.getMonth());//当月
        var lastDayOfMonth=new Date(currentYear,lastMonth,0).getDate()<9?"0"+new Date(currentYear,lastMonth,0).getDate():new Date(currentYear,lastMonth,0).getDate();//上个月的最后一天
        var lastDay=(date.getDate()-1)<9?"0"+(date.getDate()-1):(date.getDate()-1);//前一天

        var splitStr="-";//日期之间的分隔符

        if(this.currentFormatDate=='当月'){
          this.selectStartTime=currentYear+splitStr+currentMonth+splitStr+'01';
          this.selectEndTime=currentYear+splitStr+currentMonth+splitStr+lastDay;

        }else if(this.currentFormatDate=='上个月'){
          this.selectStartTime=currentYear+splitStr+lastMonth+splitStr+'01';
          this.selectEndTime=currentYear+splitStr+lastMonth+splitStr+lastDayOfMonth;

        }else if(this.currentFormatDate=='今年'){
          this.selectStartTime=currentYear+splitStr+'01'+splitStr+'01';
          this.selectEndTime=currentYear+splitStr+currentMonth+splitStr+lastDay;
        }else if(this.currentFormatDate=='上一年'){
          this.selectStartTime=lastYear+splitStr+'01'+splitStr+'01';
          this.selectEndTime=lastYear+splitStr+'12'+splitStr+'31';
        }else{
          //如果是'yyyy-mm-dd'这种格式，不需要处理
          if(isNaN(this.selectStartTime)&&!isNaN(Date.parse(this.selectStartTime))){

          }else{
            //如果直接是本地时间，就需要处理
            this.selectStartTime=formatDate(this.selectStartTime)
          }

          //如果是'yyyy-mm-dd'这种格式，不需要处理
          if(isNaN(this.selectEndTime)&&!isNaN(Date.parse(this.selectEndTime))){

          }else{
            //如果直接是本地时间，就需要处理
            this.selectEndTime=formatDate(this.selectEndTime)
          }
        }

        if(this.selectEndTime<this.selectStartTime){
          this.$vux.toast.text("结束时间不能小于起始时间!");
        }else{
          this.$router.push({
            name:name,
            params:{
              startTime:this.selectStartTime,
              endTime:this.selectEndTime,
            }
          })
        }

      }

    }
  }
</script>
<style lang="scss" scoped>

  .myContainer {
    padding-bottom: 20px;
    .AlarmInfo {

    }

    .weui-btn{
      font-size:16px;
      width:90%;
      border:none;
      background: #00D1EF;
      color:#EAFAFD;
      border-radius: 50px;
    }

    .selectOption{
      &>div{
        margin-bottom: 10px;
      }
    }
    .sensorCell{
      .weui-cells{
        margin-top: 0;
      }
      .weui-cells:before{
        border: none;
      }
    }
    .el-time-panel__content.has-seconds::before{
      padding-left: 19.33333%;
    }

    .setWid{
      width:184px;
    }

  }
</style>


