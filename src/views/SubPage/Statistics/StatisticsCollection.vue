<template>
  <div class="myContainer">
    <x-header :left-options="{backText: ''}" @click.native="goback">{{bridgeInfo.shortname}}</x-header>
    <div class="AlarmInfo" >
      <div class="cellTop" style="margin:10px auto">基础信息</div>
      <div class="sensorInfo">
        <flexbox >
          <flexbox-item >开始时间：{{selectStartTime}}</flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item>结束时间：{{selectEndTime}}</flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item>数据采集次数：{{stCount}}</flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item>采集率：{{stCollectRatio}}</flexbox-item>
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

      <!--饼图的内容开始-->
      <div class="myChartData">
        <div id="myPieData"></div>
      </div>
      <!--饼图的内容结束-->



      <div class="space_10"></div>

      <div class="myChartData" style="height:300px;">
        <flexbox style="height:20%">
          <flexbox-item style="text-align: center">
            <el-radio-group v-model="radioCheck" @change="getRadioCheck">
              <el-radio label="1">日</el-radio>
              <el-radio label="2">月</el-radio>
              <el-radio label="3">年</el-radio>
            </el-radio-group>
          </flexbox-item>
        </flexbox>
        <div id="myBarData" style="height:calc(100% - 20%)"></div>
      </div>
    </div>


  </div>
</template>
<script>
  import {setCookie, getCookie, delCookie} from '../../../assets/js/cookie.js'
  import echarts from 'echarts/lib/echarts'
  import 'echarts/lib/chart/line'
  import 'echarts/lib/chart/pie'
  import 'echarts/lib/chart/bar'

  var publicapi = require('../../../assets/js/publicapi.js')
  var api = publicapi.proxy.monitoring_url;
  var acquisition_url = publicapi.proxy.acquisition_url;  //
  var management_url = publicapi.proxy.management_url;
  var  monitoring_url=publicapi.proxy.monitoring_url;
  import {mapGetters} from 'vuex'
  import {getNowFormatDate} from '../../../assets/js/transfromTime';
  import {getPastFormatDate} from '../../../assets/js/transfromTime';

  import {getPastFormatDateBySelect} from '../../../assets/js/transfromTime';
  import {getNowFormatDateBySelect} from '../../../assets/js/transfromTime';
  import {getFormatDateBySelect} from '../../../assets/js/transfromTime';

  export default {
    data() {
      return {
        accessToken: getCookie("accessToken"),


        selectStartTime:"",//选取的时间
        selectEndTime:"",//选取的时间

        datetimeFormat:"yyyy-MM-dd HH:mm:ss",//时间的格式

        maxDataChecked:true,//最大值选框 控制---->图表
        minDataChecked:true,//最小值选框 控制---->图表
        valueDataChecked:true,//最小值选框 控制---->图表

        historydata:[], //历史数据图表数据,
        bridgeInfo:localStorage.getItem("bridgeInfo")?JSON.parse(localStorage.getItem("bridgeInfo")):[],
        bridgeList: localStorage.getItem("bridgeList")?JSON.parse(localStorage.getItem("bridgeList")):[], //桥梁列表


        stCount:"",//采集总数
        stCollectRatio:"",//桥梁采集占比

        pieList:[],//饼图的数据

        barList:[],//柱状图的数据

        radioCheck:"1",//柱状图单选框的选项
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
    watch:{

    },
    mounted(){
      var params=this.$route.params;//获取从路由传递过来的信息
      if(params){
          this.selectStartTime=params.startTime;
          this.selectEndTime=params.endTime
      }



      this.getRunInfoByBar();//获取采集率和采集数量的柱状图
    },
    methods: {

      //加载饼图的数据
      initPieDatas(){
        var legendData = [];
        var seriesData = [];
        for(var i=0;i<this.pieList.length;i++){
          let datas=this.pieList[i];
          legendData.push('次数'+datas.count+","+'比例'+datas.ratio)
          var seriesDataObj={};
          seriesDataObj.name=datas.name;
          seriesDataObj.value=datas.ratio.substring(0,datas.ratio.length-1);
          seriesDataObj.count=datas.count;
          seriesData.push(seriesDataObj)
        }

        const  option = {
       /* title: {
          text: '各类型比例和次数',
          x: 'center'
        },*/
        tooltip: {
          trigger: 'item',
          // formatter: "{a} <br/>{b} : {c} ({d}%)"
          formatter: function (name) {
            return "名称："+name.data.name+ '<br/>'+"比例："+name.data.value+"%"+"&nbsp;&nbsp;"+"次数："+name.data.count ;
          }
        },
        series: [
          {
            name: '姓名',
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            data: seriesData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
        const myChart = echarts.init(document.getElementById('myPieData'));

        myChart.setOption(option);
        setTimeout(function () {
          window.onresize = function () {
            myChart.resize();
          }
        }, 200)
      },

      /*点击返回*/
      goback(){
        this.$router.replace("/WorkState")
      },

      /*获取采集率的饼状图*/
      getRatioRunInfo(){
        this.$vux.loading.show({
          text: '正在加载...'
        })
        /*调用接口取值*/
        this.$http.get(acquisition_url + '/alarm/piechart/style/getRatioRunInfo', {
          // this.axios.get('acquisition_url/acquisiteEquipment/findAllSensorByType',{
          params: {
            scode:this.bridgeInfo.code,
            startTime: this.selectStartTime,
            endTime:this.selectEndTime,
            type:'factor',
            style:'collect',
          }
        }).then((res) => {
          var resData = res.data;
          if (resData.resultCode == 1) {
            if(resData.data){
              this.stCount=resData.data.stCollectCount;
            }
            if(resData.data.stCollectRatio&&resData.data.stCollectRatio!=""){
              this.stCollectRatio=resData.data.stCollectRatio
            }
            if(resData.data.typelist&&resData.data.typelist.length>0){
              this.pieList=resData.data.typelist;
              this.initPieDatas(); //加载饼图的数据
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


      //得到单选框组选项改变事件
      getRadioCheck(){
        this.getRunInfoByBar();
      },

      //获取采集率和采集数量的柱状图
      getRunInfoByBar(){
        this.$vux.loading.show({
          text: '正在加载...'
        })
        var type="";
        if(this.radioCheck=='1'){
          type='day';
        }else if(this.radioCheck=='2'){
          type='month';
        }else if(this.radioCheck=='3'){
          type='year';
        }
        /*调用接口取值*/
        this.$http.get(acquisition_url + '/alarm/columnchart/style/getRatioRunInfo', {
          // this.axios.get('acquisition_url/acquisiteEquipment/findAllSensorByType',{
          headers:{
            accessToken:getCookie("accessToken")
          },
          params: {
            scode:this.bridgeInfo.code,
            startTime: this.selectStartTime,
            endTime:this.selectEndTime,
            type:type,
            style:'collect',
          }
        }).then((res) => {
          var resData = res.data;
          if (resData.resultCode == 1) {
            if (resData.data) {
              if(resData.data&&resData.data.length>0){
                this.barList=resData.data;
                this.initBarData();//加载柱状图的数据
              }
            }

          } else if (resData.resultCode == 0) {
            this.$vux.toast.text(res.data.msg);
          } else {
            this.$vux.toast.text(res.data.msg);
          }
          this.getRatioRunInfo();//获取采集率的饼状图
        }, (error) => {
          this.$vux.loading.hide()
        });
      },

      //加载柱状图的
      initBarData(){
        var dataAxis=[];
        var dataSeriesRatio=[];
        var dataSeriesCount=[];
        var dataSeriesTotal={};
        for(var i=0;i<this.barList.length;i++){
          let datas=this.barList[i]
          dataAxis.push(datas.time.substring(0,11))
          dataSeriesRatio.push(datas.ratio.substring(0,datas.ratio.length-1))
          dataSeriesCount.push(datas.count)
        }
        dataSeriesTotal.dataSeriesCount=dataSeriesCount;
        dataSeriesTotal.dataSeriesRatio=dataSeriesRatio;

        const option = {
          color: ['#2F4554','#ACCACE'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          grid: {
            left: '3%',
            top:'5%',
            right: '3%',
            bottom: '3%',
            containLabel: true
          },
          xAxis : [
            {
              type : 'category',
              data : dataAxis,
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis : [
            {
              type: 'value',
              name: '次数',
              axisLabel: {
                formatter: '{value}'
              }
            },
            {
              type: 'value',
              name: '比例',
              min: 0,
              max: 100,
              axisLabel: {
                formatter: '{value} %'
              }
            }
          ],
          series : [
            {
              name:'比例(%)',
              type:'line',
              yAxisIndex: 1,
              data:dataSeriesTotal.dataSeriesRatio
            },
            {
              name:'次数',
              type:'bar',
              data:dataSeriesTotal.dataSeriesCount
            }
          ]
        };
        const myChart = echarts.init(document.getElementById('myBarData'));

        myChart.setOption(option);
        setTimeout(function () {
          window.onresize = function () {
            myChart.resize();
          }
        }, 200)
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
    .myChartData > div:last-child{
      height:100%;
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


