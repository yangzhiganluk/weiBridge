<template>
  <div class="myContainer">
    <x-header :left-options="{backText: ''}" @click.native="goback">{{bridgeInfo.shortname}}</x-header>
    <div class="AlarmInfo" v-for="item in sensorInfo" :key="item">
      <div class="cellTop" style="margin:10px auto">基础信息</div>
      <div class="sensorInfo">
        <flexbox >
          <flexbox-item >传感器编号：{{item.sensorCode}}</flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item>传感器类型：{{item.factor_name}}</flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item>当前状态：{{item.status}}</flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item>测量单位：{{item.unit}}</flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item>当前值：{{item.value}} <span style="margin-left: 10px">{{item.time}}</span></flexbox-item>
        </flexbox>
      </div>


      <div class="space_10"></div>
<!--      <flexbox>
        <flexbox-item :span="2">数据粒度</flexbox-item>
        <flexbox-item :span="10">
          <el-radio-group   v-model="radioCheck" @change="getRadioCheck" @click.native="clearDate">
            <el-radio label="1">5分钟</el-radio>
            <el-radio label="2">1小时</el-radio>
            <el-radio label="3">1天</el-radio>
            <el-radio label="4">1月</el-radio>
          </el-radio-group>

        </flexbox-item>
      </flexbox>-->
      <group class="commonCell sensorCell">
        <popup-picker title="数据粒度" :data="checkList" v-model="radioCheck" value-text-align="right"  @on-change="getChartsDataByType"></popup-picker>

        <flexbox style="padding: 10px 20px;box-sizing: border-box" v-if="routerType=='workstate'&&dataItemList&&dataItemList.length>0">
          <flexbox-item :span="4">数据项</flexbox-item>
          <flexbox-item :span="8">
            <el-select v-model="currentDataItem" placeholder="请选择"  @change="changeDataItem">
              <el-option
                v-for="(item,index) in dataItemList"
                :key="index"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>

          </flexbox-item>
        </flexbox>

        <flexbox style="padding: 10px 20px;box-sizing: border-box" v-if="routerType=='alarmInfoDeal'&&dataItemName">
          <flexbox-item :span="4">数据项</flexbox-item>
          <flexbox-item :span="8">
           {{dataItemName}}
          </flexbox-item>
        </flexbox>

        <flexbox style="padding: 10px 20px;box-sizing: border-box">
          <flexbox-item :span="4">开始时间</flexbox-item>
          <flexbox-item :span="8">
            <el-date-picker
              v-model="selectStartTime"
              :type="selectTimeType"
              @change="getSelectStartTime"
              :value-format="datetimeFormat"
              :clearable=false
              class="dateStyle"
            >
            </el-date-picker>

          </flexbox-item>
        </flexbox>


        <flexbox style="padding: 10px 20px;box-sizing: border-box">
          <flexbox-item :span="4">结束时间</flexbox-item>
          <flexbox-item :span="8">
            <el-date-picker
              v-model="selectEndTime"
              :type="selectTimeType"
              @change="getSelectEndTime"
              :value-format="datetimeFormat"
              :clearable=false
              class="dateStyle"
            >
            </el-date-picker>
          </flexbox-item>
        </flexbox>

      </group>




      <div class="space_10"></div>

      <div class="myChartData">
        <flexbox style="height:20%">
          <flexbox-item style="text-align: center">
             <el-checkbox v-model="maxDataChecked" @change="setLegendDisplay('最大值')"><span style="color:#FF6600">最大值</span></el-checkbox>
             <el-checkbox v-model="valueDataChecked" @change="setLegendDisplay('平均值')" disabled><span style="color:#C652DE">平均值</span></el-checkbox>
             <el-checkbox v-model="minDataChecked" @change="setLegendDisplay('最小值')"><span style="color:#0099FF">最小值</span></el-checkbox>
          </flexbox-item>
        </flexbox>
        <div id="myChartData"></div>
      </div>
    </div>


  </div>
</template>
<script>
  import {setCookie, getCookie, delCookie} from '../../assets/js/cookie.js'
  import echarts from 'echarts/lib/echarts'
  import 'echarts/lib/chart/line'

  var publicapi = require('../../assets/js/publicapi.js')
  var api = publicapi.proxy.monitoring_url;
  var acquisition_url = publicapi.proxy.acquisition_url;  //
  var management_url = publicapi.proxy.management_url;
  var  monitoring_url=publicapi.proxy.monitoring_url;
  import {mapGetters} from 'vuex'
  import {getNowFormatDate} from '../../assets/js/transfromTime';
  import {getPastFormatDate} from '../../assets/js/transfromTime';

  import {getPastFormatDateBySelect} from '../../assets/js/transfromTime';
  import {getNowFormatDateBySelect} from '../../assets/js/transfromTime';
  import {getFormatDateBySelect} from '../../assets/js/transfromTime';

  export default {
    data() {
      return {
        accessToken: getCookie("accessToken"),
        sensorInfo: '',//传感器信息
        alarmInfo:"",//告警信息
        radioCheck: ['5分钟'],//单选框选中项
        checkList: [['5分钟', '1小时', '1天', '1月']],

        selectStartTime:getPastFormatDate('minute'),//选取的时间
        selectEndTime:getNowFormatDate('minute'),//选取的时间

        datetimeFormat:"yyyy-MM-dd HH:mm:ss",//时间的格式

        maxDataChecked:true,//最大值选框 控制---->图表
        minDataChecked:true,//最小值选框 控制---->图表
        valueDataChecked:true,//最小值选框 控制---->图表

        ifSelectStartTime:false,//判断是否选择了开始时间，如果没有，就以默认时间为准
        ifSelectEndTime:false,//判断是否选择了结束时间，如果没有，就以默认时间为准

        selectTimeType:'datetime',//时间选择器的类型


        historydata:[], //历史数据图表数据,
        bridgeInfo:localStorage.getItem("bridgeInfo")?JSON.parse(localStorage.getItem("bridgeInfo")):[],
        bridgeList: localStorage.getItem("bridgeList")?JSON.parse(localStorage.getItem("bridgeList")):[], //桥梁列表
        dataItemList:[],//数据项的列表
        currentDataItem:"",//当前选中的数据项的值
        currentDataIndex:0,//当前选中的数据项的下标

        dataItemName:"",//数据项名称  只在点击告警详情页的时候才有
        dataItemCode:"",//数据项的CODE

        routerType:"",//路由器传过来的类型，是从告警信息详情里面的单个数据项还是传感器信息的数据项组

        scanData:"",//扫一扫的数据
      }
    },
    computed: {
      // ...mapGetters(['username']),
      ...mapGetters(['count', 'moreBridgePageUrl', 'imgUrl']),
    },
    beforeCreate() {
      this.$store.dispatch('initcount')
    },
    created() {


    },
    mounted(){
      this.scanData=sessionStorage.getItem("scanData")?JSON.parse(sessionStorage.getItem("scanData")):"";
      if(this.scanData && this.scanData!=""){
        this.getSensorData(this.scanData.id)
      }else{
        var routerType=this.$route.params.type;//获取从路由传递过来的信息
        if(routerType=='workstate'){   //表明是从工作状态那边传递过来的，是一个数据项的集合
          var sensorInfo=localStorage.getItem("sensorInfo")?JSON.parse(localStorage.getItem("sensorInfo")):[];
          if(sensorInfo.dataItemInfo&&sensorInfo.dataItemInfo.length>0){
            this.dataItemList=sensorInfo.dataItemInfo;
            this.currentDataItem=this.dataItemList[0].name;
            this.dataItemCode=this.dataItemList[0].code;
          }
          this.routerType='workstate';
        }else if(routerType=='alarmInfoDeal'){
          var alarmInfo=localStorage.getItem("alarmInfo")?JSON.parse(localStorage.getItem("alarmInfo")):[];
          if(alarmInfo){
            this.alarmInfo=alarmInfo;
            this.dataItemName=alarmInfo.dataItemName;
            this.dataItemCode=alarmInfo.dataItemCode;
          }
          this.routerType='alarmInfoDeal';
        }
        //得到本地数据
        this.getlocalSensorData();
      }


    },
    methods: {
      /*改变数据项下拉框的值*/
      changeDataItem(){
        if(this.dataItemList&&this.dataItemList.length>0){
          for(var i=0;i<this.dataItemList.length;i++){
            var datas=this.dataItemList[i];
            if(datas.name==this.currentDataItem){
              this.currentDataIndex=i;
              this.dataItemCode=this.dataItemList[i].code;
            }
          }
        }
      },
      /*加载图表数据*/
      initMycharsDataAssociation(type) {
        const scope = this;
        function setTime(arr){
          //截取时间戳
          var outArr=[];
          for(var i=0; i<arr.length; i++) {
            if(type=='minute'){
              outArr.push(arr[i].substr(0,16))
            }else if(type=='hours'){
              outArr.push(arr[i].substr(0,13)+'时')
            }else if(type=='day'){
              outArr.push(arr[i].substr(0,10))
            }else{
              outArr.push(arr[i].substr(0,7))
            }

          }
          return outArr;
        }

        let mindata="";
        let maxdata="";
        function removeByValue(arr, val) {
          var outArr=[];
          for(var i=0; i<arr.length; i++) {
            if(arr[i] != val) {
              outArr.push(arr[i])
            }
          }
          return outArr;
        }
        let historymax = Math.max.apply(null, removeByValue(this.historydata.maxValueInfo,'-'));
        let historymin =Math.min.apply( null, removeByValue(this.historydata.minValueInfo,'-'));

        maxdata=historymax;
        mindata=historymin;

        const optionDataAssociation ={
          color:["#FF6600", "#0099FF","#C652DE"],
          tooltip: {
            trigger: 'axis',
            // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
          },
          legend: {
            data:['最大值','最小值','平均值'],
            textStyle:{
              color:'#BDC1D8'
            },
            x:'center',
            icon: 'rect',
            show:false
          },
          /*toolbox: {
            y: -30,
            show: true,
            feature: {
              mark: {show: true},
              dataZoom: {show: true},
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },*/
          dataZoom: {
            type: 'slider',
            show: true,
            realtime: true,
            textStyle:{
              color: '#BDC1D8'
            }
          },
          grid: {
            left: '0%',
            right: '5%',
            bottom: '25%',  // 20
            top: '5%',     //10
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: true,
              data: setTime(this.historydata.timeInfo),
              axisLine: {
                onZero: true,
                lineStyle: {
                  type: 'solid',
                  color: '#BDC1D8',//左边线的颜色
                  width:'1',//坐标线的宽度
                }
              },
            }
          ],
          yAxis: [
            {
              min:mindata,
              max:maxdata,
              type: 'value',
              scale: true,
              splitNumber: 3,
              boundaryGap: [0.05, 0.05],
              splitArea: {show: false},
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  color: '#BDC1D8',//左边线的颜色
                  width:'1'//坐标线的宽度
                }
              },
            }
          ],
          series: [
            {
              name:['最大值'],
              type: 'line',
              smooth: true,  //设置平滑
              // symbol:'none',
              connectNulls: true,  //处理断点
              data:scope.historydata.maxValueInfo,
            },
            {
              name: ['最小值'],
              type: 'line',
              smooth: true,  //设置平滑
              // symbol:'none',
              connectNulls: true,  //处理断点
              data:scope.historydata.minValueInfo,
            },
            {
              name:['平均值'],
              type: 'line',
              smooth: true,  //设置平滑
              // symbol:'none',
              connectNulls: true,  //处理断点

              data:scope.historydata.valueInfo,
            },

          ]
        };
        const myChart = echarts.init(document.getElementById('myChartData'));

        myChart.setOption(optionDataAssociation);
        setTimeout(function () {
          window.onresize = function () {
            myChart.resize();
          }
        }, 200)
      },

      /*点击返回*/
      goback(){
        // this.$router.replace("/WorkState")
        this.$router.go(-1);
      },
      /*得到本地数据中的传感器信息*/
      getlocalSensorData() {
        let sensor = JSON.parse(localStorage.getItem("sensorInfo"));
        this.getSensorData(sensor.sensorId);
      },
      /*使用复选框代替legend控制显隐*/
      setLegendDisplay(name){
        const myChart = echarts.init(document.getElementById('myChartData'));
        var option=myChart.getOption();
        if(name=='最大值'){
          if(this.maxDataChecked){
            option.legend[0].selected['最大值'] = true;
          }else{
            option.legend[0].selected['最大值'] = false;
          }
        }
        if(name=='最小值'){
          if(this.minDataChecked){
            option.legend[0].selected['最小值'] = true;
          }else{
            option.legend[0].selected['最小值'] = false;
          }
        }
        if(name=='平均值'){
          if(this.valueDataChecked){
            option.legend[0].selected['平均值'] = true;
          }else{
            option.legend[0].selected['平均值'] = false;
          }
        }
        myChart.setOption(option)

      },
      /*得到传感器信息*/
      getSensorData(id) {
        this.$vux.loading.show({
          text: '正在加载...'
        })
        /*调用接口取值*/
        this.$http.get(acquisition_url + '/acquisiteEquipment/findSensorDetailForWindow', {
          // this.axios.get('acquisition_url/acquisiteEquipment/findAllSensorByType',{
          params: {
            id: id,
            accessToken: this.accessToken,
          }
        }).then((res) => {
          var resData = res.data;
          if (resData.resultCode == 1) {
            this.sensorInfo = [];
            if (resData.data) {
              this.sensorInfo.push(resData.data);
              //预先加载五分钟的数据
              this.getChartsData(monitoring_url+'/report/getRawData','minute');
            }

          } else if (resData.resultCode == 0) {
            this.$vux.toast.text(res.data.msg);
          } else {
            this.$vux.toast.text(res.data.msg);
          }
          this.$vux.loading.hide()
        }, (error) => {
          this.$vux.loading.hide()
        });
      },


      /*选择开始时间*/
      getSelectStartTime(val){
        //
        this.ifSelectStartTime=true;
        if(this.selectEndTime<this.selectStartTime){
          this.$vux.toast.text("结束时间不能小于起始时间!");
        }else{
          this.getChartsDataByType();
        }
      },
      /*选择结束时间*/
      getSelectEndTime(val){
        // this.getChartsDataByType();
        this.ifSelectEndTime=true;
        if(this.selectEndTime<this.selectStartTime){
          this.$vux.toast.text("结束时间不能小于起始时间!");
        }else{
          this.getChartsDataByType();
        }
      },

      /*通过选择的数据粒度来调不同的接口*/
      getChartsDataByType(val){

        if(this.radioCheck[0]=='5分钟'){
          this.datetimeFormat='yyyy-MM-dd HH:00:00';

          /*如果没有选择时间开始时间，就以默认时间为主*/
          if(!this.ifSelectStartTime){
            this.selectStartTime=getPastFormatDate('minute');
          }


          /*如果没有选择结束时间，就以默认时间为主*/
          if(!this.ifSelectEndTime){
            this.selectEndTime=getNowFormatDate('minute');
          }
          this.getChartsData(monitoring_url+'/report/getRawData','minute');

        }else if(this.radioCheck[0]=='1小时'){

          /*如果没有选择时间开始时间，就以默认时间为主*/
          if(!this.ifSelectStartTime){
            this.selectStartTime=getPastFormatDate('hours');
          }

          /*如果没有选择结束时间，就以默认时间为主*/
          if(!this.ifSelectEndTime) {
            this.selectEndTime=getNowFormatDate('hours');
          }
          this.getChartsData(monitoring_url+'/report/getHourData','hours');
        }else if(this.radioCheck[0]=='1天'){


          /*如果没有选择时间开始时间，就以默认时间为主*/

          if(!this.ifSelectStartTime){
            this.selectStartTime=getPastFormatDate('day');
          }


          /*如果没有选择结束时间，就以默认时间为主*/
          if(!this.ifSelectEndTime){
            this.selectEndTime=getNowFormatDate('day');
          }

          this.getChartsData(monitoring_url+'/report/getDayData','day');

        }else if(this.radioCheck[0]=='1月'){


          /*如果没有选择时间开始时间，就以默认时间为主*/
          if(!this.ifSelectStartTime){
            this.selectStartTime=getPastFormatDate('mouth');
          }


          /*如果没有选择结束时间，就以默认时间为主*/
          if(!this.ifSelectEndTime){
            this.selectEndTime=getNowFormatDate('mouth');
          }
          this.getChartsData(monitoring_url+'/report/getMonthData','mouth');
        }
      },
      /*加载服务器图表数据*/
      getChartsData(url,type){
       var startTime,endTime;
        if(this.ifSelectStartTime){
          startTime=getFormatDateBySelect(type,this.selectStartTime);
        }else{
          startTime=getPastFormatDate(type);
        }

        if(this.ifSelectEndTime){
          endTime=getFormatDateBySelect(type,this.selectEndTime);
        }else{
          endTime=getNowFormatDate(type)
        }
        this.$vux.loading.show({
          text: '正在加载...'
        });
        var sensorCode="";
        if(this.routerType=='workstate'){
          sensorCode=this.sensorInfo[0].sensorCode;
        }else if(this.routerType=='alarmInfoDeal'){
          sensorCode=this.alarmInfo.code;
        }else{
          sensorCode=this.scanData.sensorcode;
        }
        this.$http.get(url, {
          headers:{
            accessToken:this.accessToken,
          },
          params: {
            sensorCode: sensorCode,     //有
            structureCode: this.sensorInfo[0].structureCode,  //有
            dataItemCode:this.dataItemCode,
            startTime:startTime,  //有
            endTime:  endTime     //有
          }
        }).then((res) => {
          let resData=res.data;
          if(resData.resultCode==1) {
            if(resData.data){
              this.historydata=resData.data;
              this.initMycharsDataAssociation(type);
            }
          }else if (resData.resultCode == 0) {
            this.$vux.toast.text(resData.msg);
          } else {
            this.$vux.toast.text(resData.msg);
          }
          this.$vux.loading.hide()
        },(error)=>{
          this.$vux.loading.hide()
        });
      },

    }
  }
</script>
<style lang="scss" scoped>

  .myContainer {
    padding-bottom: 20px;
    .AlarmInfo {

    }

    .weui-btn {
      font-size: 16px;
      width: 60%;
      border: none;
    }

    .sensorCell{
      .weui-cells{
        margin-top: 0;
      }
      .weui-cells:before{
        border: none;
      }
    }
  }
</style>


