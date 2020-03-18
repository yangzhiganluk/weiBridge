<template>
  <div class="myContainer workStateInfo">
    <x-header :left-options="{backText: ''}" @click.native="goback">桥梁健康监测云平台</x-header>
    <img src="../../assets/images/scan.png" @click="scan()" class="scanStyle"/>

    <div class="space_20"></div>

    <flexbox>
      <flexbox-item>
        <div style="padding-left: 10px;font-size:16px;color:#3A4972;font-weight: 600;font-family: SimSun">检测系统工作状态</div>
      </flexbox-item>
    </flexbox>
    <div class="chartContent">
      <div id="myChart_sensorData" style="height:200px;width:100%;"></div>

      <div class="chartInfo">
        <span><i class="normal"></i>正常<b>{{normal_count}}</b></span>
        <span><i class="abnormal"></i>异常<b>{{fault_count}}</b></span>
      </div>
    </div>


    <div class="bottomContent">
      <div class="space_20"></div>
      <tab custom-bar-width="100px" bar-active-color="#319BFC" >
        <tab-item selected @on-item-click="onItemClick('type')" :span="4/9">类型</tab-item>
       <div :span="1/9" style="width:1%;text-align: center;height:44px;line-height: 44px;color: #ADB2C1;font-size: 18px;font-weight:400">|</div>
        <tab-item @on-item-click="onItemClick('position')" :span="4/9">分组</tab-item>
      </tab>

      <flexbox style="height:calc(100% - 70px);overflow-y: auto;margin-top: 30px">
        <flexbox-item style="height:100%">
          <div v-for="(item,index) in modelTreeDatas" :key="index">
            <div class="cellTop">{{item.name}}</div>
            <group class="cellBox" v-if="item.children">
              <cell-box is-link @click.native="getCurrentNode(itemSub)" v-for="(itemSub,index) in item.children" :key="index">{{itemSub.name}}</cell-box>
            </group>
          </div>


        </flexbox-item>
      </flexbox>
    </div>
  </div>
</template>
<script>
  import {setCookie, getCookie, delCookie} from '../../assets/js/cookie.js'

  var publicapi = require('../../assets/js/publicapi.js')
  var api = publicapi.proxy.monitoring_url;
  var acquisition_url = publicapi.proxy.acquisition_url;  //
  var management_url = publicapi.proxy.management_url;
  import {mapGetters} from 'vuex'
  import echarts from 'echarts/lib/echarts'
  import 'echarts/lib/chart/pie'

  export default {
    data() {
      return {
        imageUrl: require("../../assets/images/logo2.png"),
        type: '3', //pannel展示的方式 1,2,3,4,5 共5种
        showPannel: 'bridge',//展示哪个tab内容
        accessToken: getCookie("accessToken"),//鉴权码
        loginInfo:localStorage.getItem("loginInfo")?JSON.parse(localStorage.getItem("loginInfo")):"", //登录成功，存储在本地的信息
        bridgeInfo:localStorage.getItem("bridgeInfo")?JSON.parse(localStorage.getItem("bridgeInfo")):"",//桥梁的信息
        sensorStauts:"",//传感器的状态
        normal_count:"",//正常的数量
        fault_count:"",//异常的数量

        bridgeList:localStorage.getItem("bridgeList")?JSON.parse(localStorage.getItem("bridgeList")):[],
        modelTreeDatas:[],   //3d结构树数组改
        modelTreeDatasByType:[],//3D结构树数组按照类型来划分
        modelTreeDatasByLocation:[],//3D结构树数组按照位置来划分


      }
    },
    computed: {
      // ...mapGetters(['username']),
      ...mapGetters(['count', 'moreBridgePageUrl','imgUrl']),
    },
    beforeCreate() {
      this.$store.dispatch('initcount')
    },
    created() {
      /*加载传感器的状态*/
      this.getsensorStauts();
      /*加载下方树节点*/
      this.navdatas();
      this.loadSign();
    },
    methods: {


      /*=============通用组件开始================*/
      /*tab切换*/
      onItemClick(item) {
        this.conversionDatas(item)
      },
      /*点击返回*/
      goback(){
        this.$router.replace("/BridgeManage")
      },

      /*得到传感器信息*/
      getsensorStauts(){
        this.$vux.loading.show({
          text: '正在加载...'
        })
        this.$http.get(acquisition_url+'/acquisiteEquipment/findSensorByStructureCode',{
          params:{
            accessToken:this.accessToken,
            structureCode:this.bridgeInfo.code,
            type:'factor'
          }
        }).then((res) => {
          var resData=res.data;
          if(resData.resultCode==1) {
            this.sensorStauts=resData;   //传感器状态
            this.normal_count=resData.extend.normal_count;
            this.fault_count=resData.extend.fault_count;
            this.initMycharsDataAssociation();
          }else if (resData.resultCode == 0) {
            this.$vux.toast.text(resData.msg);
          } else {
            this.$vux.toast.text(resData.msg);
          }
          this.$vux.loading.hide()
        },(error) =>{
          this.$vux.loading.hide()
        });
      },
      /*加载环形图数据*/
      initMycharsDataAssociation(){
        const optionDataAssociation ={
          color:["#9FDABF", "#F5B00B"],
          tooltip: {
            trigger: 'axis',
            // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
          },
          legend: {
            data:[{name:'正常'+this.normal_count,icon:'circle'},{name:'异常'+this.fault_count,icon:'circle'}],
            textStyle:{
              color:'#9E9E9E'
            },
            x:'center',
            y:'top',
            show:false,
          },
          grid: {
            left: '0%',
            right: '0%',
            bottom: '0%',  // 20
            top: '0%',     //10
            containLabel: true
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: ['40%', '60%'],
              data:[
                {value:this.normal_count, name:'正常',},
                {value:this.fault_count, name:'异常'},
              ],

              label: {
                normal: {
                  show: true,
                  position: 'outside'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '30',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: true
                }
              },
            }
          ]

        };
        const myChart = echarts.init(document.getElementById('myChart_sensorData'));
        myChart.setOption(optionDataAssociation);
        setTimeout(function () {
          window.onresize = function () {
            myChart.resize();
          }
        }, 200)
      },

      //自定义渲染树节点
      renderContent(h, { node, data, store }) {
        return (
          <span  class={node.label.isNormal}>{node.label.name}</span>
        );
      },
      //点击树节点时...
      getCurrentNode(data){
        if(data.isLeaf){
          localStorage.setItem("sensorInfo",JSON.stringify(data));
          if(this.loginInfo.type=='3'){
            this.$http.get(management_url + '/sub/findSubaccountById', {
              headers:{
                accessToken:getCookie("accessToken")
              },
              params: {
                id:this.loginInfo.id,
              }
            }).then((res) => {

              if (res.data.resultCode == 1) {
                /*判断是否有结构物，是否存在多桥和单桥*/
                if (res.data.data) {
                  if (res.data.data.structures && res.data.data.structures.length > 0) {
                    let structures=res.data.data.structures;
                    for(let i=0;i<structures.length;i++){
                      if(structures[i].code==this.bridgeInfo.code){
                        let role=structures[i].role;
                        if(role.indexOf("manage")!=-1){
                          // scope.$router.push("/SensorInfo");
                          this.$router.push({
                            name:"传感器信息",
                            params:{
                              type:'workstate'
                            }
                          })
                        }else{
                          this.$router.push({
                            name:"查看传感器信息",
                            params:{
                              type:'workstate'
                            }
                          })
                          // scope.$router.push("/SensorInfoView");
                        }

                        return;
                      }

                    }
                  }
                }
              } else if (res.data.resultCode == 0) {
                this.$vux.toast.text(res.data.data.msg);

              } else {
                this.$vux.toast.text(res.data.data.msg);

              }
            }, (error) => {

            });
          }else{
            for(let i=0;i<this.bridgeList.length;i++){
              if(this.bridgeList[i].code==this.bridgeInfo.code){
                localStorage.setItem("bridgeInfo", JSON.stringify(this.bridgeList[i]));
                // this.$router.push("/SensorInfo");
                this.$router.push({
                  name:"传感器信息",
                  params:{
                    type:'workstate'
                  }
                })
              }
            }

          }
        }
      },
      navdatas(){  //左边树获取公共方法
        /*查询位置*/
        this.$http.get(acquisition_url+'/acquisiteEquipment/findAllSensorByType',{
          params:{
            accessToken:this.accessToken,
            structureCode:this.bridgeInfo.code,
            type:'position'
          }
        }).then((res) => {
          var resData=res.data;
          if(resData.resultCode==1) {
            this.modelTreeDatasByLocation=resData.data;
          }


        },(error) =>{
          scope.$vux.toast.text('连接失败！');
        });

        /*查询类型*/
        this.$http.get(acquisition_url+'/acquisiteEquipment/findAllSensorByType',{
          params:{
            accessToken:this.accessToken,
            structureCode:this.bridgeInfo.code,
            type:'factor'

          }
        }).then((res) => {
          var resData=res.data;
          if(resData.resultCode==1) {
            this.modelTreeDatasByType=resData.data;
            this.modelTreeDatas=this.modelTreeDatasByType;
            this.conversionDatas('type') ;
          }
        },(error) =>{
          scope.$vux.toast.text('连接失败！');
        });
      },


      conversionDatas(item) {  //数据模型
        //this.modelTreeDatas对象转换数据成tree模型格式
        if(item=='type'){
          this.modelTreeDatas=this.modelTreeDatasByType;
        }else if(item=='position'){
          this.modelTreeDatas=this.modelTreeDatasByLocation;
        }
        let parents=this.modelTreeDatas;
        // this.sensorSpanColor=[];
        for (let i = 0; i < parents.length; i++) {       //循环父级
          parents[i].label = {name:parents[i].name};
          parents[i].id = parents[i].code;
          parents[i].isLeaf =false;
          let childrens = this.modelTreeDatas[i].children;    //循环子集传感器


          for (let j = 0; j < childrens.length; j++) {
            // console.log(childrens[j])
            childrens[j].id = childrens[j].sensorId;
            childrens[j].label = {isNormal:childrens[j].isNormal==false?'el-tree-node__label showAbnormal':'el-tree-node__label',name:childrens[j].name,};     // arrs[j].checked=this.checkeds;  //子集传感器checked状态
            childrens[j].isLeaf =true;
            childrens[j].sensorName=childrens[j].name;
            // delete childrens[j].name;

            // if(childrens[j].isNormal){
            // }else{
            // }


          }
        }


      },

      //获取扫一扫的签名
      loadSign() {
        const scope = this;

        this.$http.get(management_url + '/user/getSignByJsApiTicket', {
          // this.axios.get('acquisition_url/acquisiteEquipment/findAllSensorByType',{
          params: {
            noncestr: '7x5P8sI4DuKdODVv',
            timestamp: 1551691785,
            // url: 'http://www.qiaohaoba.net/mobileMonitor/',
            url: (window.location.href).split('#')[0],
          }
        }).then((res) => {
          var resData = res.data;
          if (resData.resultCode == 1) {
            if (resData.data) {
              wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                //                                debug : true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                // appId : data.appId, // 必填，公众号的唯一标识
                // timestamp : data.timestamp, // 必填，生成签名的时间戳
                // nonceStr : data.noncestr, // 必填，生成签名的随机串
                // signature : data.signature,// 必填，签名，见附录1
                appId: 'wx96143db2d3a1a789', // 必填，公众号的唯一标识
                timestamp: 1551691785, // 必填，生成签名的时间戳
                nonceStr: '7x5P8sI4DuKdODVv', // 必填，生成签名的随机串
                // signature : JSON.parse(data).data,// 必填，签名，见附录1
                signature: resData.data.sign,// 必填，签名，见附录1
                jsApiList: ['checkJsApi', 'scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
              });

            }

          } else if (resData.resultCode == 0) {
            scope.$vux.toast.text(resData.msg);
          } else {
            scope.$vux.toast.text(resData.msg);
          }

        }, (error) => {

        });
      },

      //扫一扫
      scan(){
        const scope = this;
        wx.error(function (res) {
          if (res.errMsg && res.errMsg == 'config:invalid signature') {
            scope.$vux.alert.show({
              title: '提示',
              content: '获取签名失败，请关闭后再试',
              onShow() {

              },
              onHide() {
                WeixinJSBridge.call('closeWindow')
              }
            })
          }
        });
        wx.ready(function() {
          wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
              var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果

              sessionStorage.setItem("scanData",result);


              if(scope.loginInfo.type=='3'){
                scope.$http.get(management_url + '/sub/findSubaccountById', {
                  headers:{
                    accessToken:getCookie("accessToken")
                  },
                  params: {
                    id:scope.loginInfo.id,
                  }
                }).then((subres) => {

                  if (subres.data.resultCode == 1) {
                    /*判断是否有结构物，是否存在多桥和单桥*/
                    if (subres.data.data) {
                      if (subres.data.data.structures && subres.data.data.structures.length > 0) {
                        let structures=subres.data.data.structures;
                        for(let i=0;i<structures.length;i++){
                          if(structures[i].code==scope.bridgeInfo.code){
                            let role=structures[i].role;
                            if(role.indexOf("manage")!=-1){
                              scope.$router.push("/SensorInfo");
                            }else{
                              scope.$router.push("/SensorInfoView");
                            }

                            return;
                          }

                        }
                      }
                    }
                  } else if (subres.data.resultCode == 0) {
                    scope.$vux.toast.text(subres.data.data.msg);

                  } else {
                    scope.$vux.toast.text(subres.data.data.msg);

                  }
                }, (error) => {

                });
              }else{
                if(JSON.parse(result).structureCode==scope.bridgeInfo.code){
                  scope.$router.push("/SensorInfo");
                }else{
                  scope.$vux.alert.show({
                    title: "提示",
                    content: "您当前进入的桥梁与扫描到的桥梁信息不匹配，请仔细确认",
                  })
                }

              }

            }
          });
        });
      },

      /*已废弃*/
      scan111(){

        const scope = this;

        this.$http.get(management_url + '/user/getSignByJsApiTicket', {
          // this.axios.get('acquisition_url/acquisiteEquipment/findAllSensorByType',{
          params: {
            noncestr:'7x5P8sI4DuKdODVv',
            timestamp:1551691785,
            url: 'http://www.qiaohaoba.net/mobileMonitor/',
          }
        }).then((res) => {
          var resData = res.data;
          if (resData.resultCode == 1) {
            if(resData.data){
              wx.config({
                debug : false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                //                                debug : true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                // appId : data.appId, // 必填，公众号的唯一标识
                // timestamp : data.timestamp, // 必填，生成签名的时间戳
                // nonceStr : data.noncestr, // 必填，生成签名的随机串
                // signature : data.signature,// 必填，签名，见附录1
                appId : 'wx96143db2d3a1a789', // 必填，公众号的唯一标识
                timestamp : 1551691785, // 必填，生成签名的时间戳
                nonceStr : '7x5P8sI4DuKdODVv', // 必填，生成签名的随机串
                // signature : JSON.parse(data).data,// 必填，签名，见附录1
                signature : resData.data.sign,// 必填，签名，见附录1
                jsApiList : ['checkJsApi', 'scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
              });
              wx.error(function(res){
                console.log(res,'scan')
                if(res.errMsg && res.errMsg=='config:invalid signature'){
                  scope.$vux.alert.show({
                    title: '提示',
                    content: '获取签名失败，请关闭后再试',
                    onShow () {

                    },
                    onHide () {
                      WeixinJSBridge.call('closeWindow')
                    }
                  })
                }
              });
              wx.ready(function() {
                wx.scanQRCode({
                  needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                  scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                  success: function (res) {
                    var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果

                    sessionStorage.setItem("scanData",result);


                    if(scope.loginInfo.type=='3'){
                      scope.$http.get(management_url + '/sub/findSubaccountById', {
                        headers:{
                          accessToken:getCookie("accessToken")
                        },
                        params: {
                          id:scope.loginInfo.id,
                        }
                      }).then((subres) => {

                        if (subres.data.resultCode == 1) {
                          /*判断是否有结构物，是否存在多桥和单桥*/
                          if (subres.data.data) {
                            if (subres.data.data.structures && subres.data.data.structures.length > 0) {
                              let structures=subres.data.data.structures;
                              for(let i=0;i<structures.length;i++){
                                if(structures[i].code==scope.bridgeInfo.code){
                                  let role=structures[i].role;
                                  if(role.indexOf("manage")!=-1){
                                    scope.$router.push("/SensorInfo");
                                  }else{
                                    scope.$router.push("/SensorInfoView");
                                  }

                                  return;
                                }

                              }
                            }
                          }
                        } else if (subres.data.resultCode == 0) {
                          scope.$vux.toast.text(subres.data.data.msg);

                        } else {
                          scope.$vux.toast.text(subres.data.data.msg);

                        }
                      }, (error) => {

                      });
                    }else{
                      if(JSON.parse(result).structureCode==scope.bridgeInfo.code){
                        scope.$router.push("/SensorInfo");
                      }else{
                        scope.$vux.alert.show({
                          title: "提示",
                          content: "您当前进入的桥梁与扫描到的桥梁信息不匹配，请仔细确认",
                        })
                      }

                    }

                  }
                });
              });
            }

          } else if (resData.resultCode == 0) {
            scope.$vux.toast.text(resData.msg);
          } else {
            scope.$vux.toast.text(resData.msg);
          }

        }, (error) => {

        });
      }
      /*=============通用组件结束================*/
    }
  }
</script>
<style lang="scss" scoped>

  .myContainer {
    width: 100%;
    height:100%;
    background: #ffffff;


    .el-tree{
      border:none;
      height:100%;
    }
    .el-tree-node.is-expanded > .el-tree-node__children{
      background: #F2F2F2;
    }
    /*图表内容开始*/
    .chartContent{
      width: 100%;
      height:260px;
      .chartInfo{
         width:100%;
         text-align: center;
        span{
          width:80px;
          display: inline-block;
          font-size:12px;
          color:#ADB0BC;
          i{
            display: inline-block;
            border-radius: 50%;
            width:10px;
            height:10px;
            margin-right: 10px;
          }
          i.normal{
            background:#9FDABF ;
          }
          i.abnormal{
            background: #F5B00B;
          }
          b{
            font-weight: normal;
            margin-left: 5px;
          }
        }
      }
    }

    /*图表下方内容样式*/
    .bottomContent{
      background: #F4F4FA;
      width:100%;
      margin: 0 auto;
      position: relative;
      height:calc(100% - 305px);
      .vux-tab-wrap{
        width:90%;
        position: absolute;
        top:-20px;
        margin-left: 5%;
        border-radius: 10px;
        box-sizing: border-box;
        font-weight: 500;
      }

      .vux-tab-bar-inner{
        background-color: #0bb20c;
      }
      .vux-tab .vux-tab-item{
        background: none;
        line-height: 50px;
        font-size:16px;
        color:#333F65;
        font-family: SimSun;
        font-weight: 600;
      }
    }

  }

  /*扫一扫的样式*/
  .scanStyle{
    position: absolute;
    right: 20px;
    width: 28px;
    top: 15px;
  }
</style>


