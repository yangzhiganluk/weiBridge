<template>
  <div class="myContainer">
    <x-header :left-options="{showBack: false}">桥梁健康监测云平台</x-header>
    <div class="top">
      <img src="../../assets/images/scan.png" @click="scan()" class="scanStyle"/>

      <!--显示间隔开始-->
      <div class="space_30"></div>
      <!--显示间隔结束-->

      <!--显示头像-->
      <flexbox class="flexTop">
        <div>
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
        </div>
        <div>
          <div class="topInfo" @click="signOut">
            <p>{{loginInfo.company}}</p>
            <span >{{loginInfo.nickname}}</span>
          </div>
        </div>
      </flexbox>

      <flexbox>
        <flexbox-item style="text-align: center;padding-top: 10px;border:none"></flexbox-item>
      </flexbox>
      <!--显示头像-->


      <!--显示tab切换开始-->
      <!-- <tab :line-width="1" custom-bar-width="60px" active-color="#169BD5" class="indexTab">
         <tab-item selected >桥梁<span style="margin-left: 5px">{{bridgeList.length}}</span></tab-item>
         <tab-item @click.native="selectTab('alarm')">告警<span style="margin-left:5px;">{{alarmCount}}</span></tab-item>
         <tab-item disabled>处置</tab-item>
       </tab>-->
      <flexbox class="indexTab">
        <flexbox-item @click.native="selectTab('bridge')" :span="1/3"><span><img :src="iconBridge"/></span><span style="color:#6DDDD1">桥梁</span></flexbox-item>
        <flexbox-item @click.native="selectTab('alarm')" :span="1/3"><span><img :src="iconAlarm"/><!--<i>{{alarmCount}}</i>--></span><span>告警</span></flexbox-item>
        <flexbox-item @click.native="selectTab('statistics')" :span="1/3"><span><img :src="iconDeal"/></span><span>统计</span></flexbox-item>
      </flexbox>
      <!--显示tab切换结束-->
    </div>


    <!--桥梁列表的内容开始-->
    <div class="bridgeList" :class="{active: showPannel == 'bridgeList',setdisplay:showPannel=='alarm'}"  >


      <!--<div id="allmap" ref="allmap" style="height:100%"></div>-->


      <panel header="桥梁列表" :list="bridgeList" :type="type" @on-click-item="onClickItem" class="panelList"></panel>

    </div>
    <!--桥梁列表的内容结束-->


  </div>
</template>
<script>
  import {setCookie, getCookie, delCookie,clearAllCookie} from '../../assets/js/cookie.js'

  var publicapi = require('../../assets/js/publicapi.js')
  var api = publicapi.proxy.monitoring_url;
  var acquisition_url = publicapi.proxy.acquisition_url;  //
  var management_url = publicapi.proxy.management_url;
  import {mapGetters} from 'vuex'


  export default {
    data() {
      return {
        imageUrl: require("../../assets/images/newlogo.png"),
        type: '1', //pannel展示的方式 1,2,3,4,5 共5种
        showPannel: 'bridge',//展示哪个tab内容
        bridgeList: [], //桥梁列表
        alarmList: [],//告警桥梁信息
        accessToken: getCookie("accessToken"),//鉴权码
        alarmCount: '',//告警数量
        loginInfo: localStorage.getItem("loginInfo") ? JSON.parse(localStorage.getItem("loginInfo")) : "", //登录成功，存储在本地的信息

        bridgeInfo:localStorage.getItem("bridgeInfo")?JSON.parse(localStorage.getItem("bridgeInfo")):[],

        currentPage: 1,//页码

        iconBridge: require("../../assets/images/icon/icon_bridge.png"),
        iconAlarm: require("../../assets/images/icon/icon_alarm_Dark.png"),
        iconDeal: require("../../assets/images/icon/icon_statistics_Dark.png"),

        localopenid: localStorage.getItem("openid"),

      }
    },
    computed: {
      ...mapGetters(['count', 'moreBridgePageUrl', 'imgUrl']),
    },
    beforeCreate() {
      this.$store.dispatch('initcount')
    },
    created() {
      /*加载桥梁列表*/
      // this.getList();
      this.judgeLogin();  //获取登录状态

      this.getalarmCount();  //取出告警的未读数量

      sessionStorage.removeItem("scanData");

      this.loadSign();


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

      /*=============通用组件开始================*/
      /*tab切换*/
      selectTab(item) {
        if(item=='bridge'){
          this.$router.push("/Index");
        }
        if (item == 'alarm') {
          this.$router.push("/IndexAlarm")
        }
        if(item=='statistics'){
          this.$router.push("/IndexStatistics")
        }
      },
      /*=============通用组件结束================*/


      /*=============桥梁列表组件开始============*/
      /*得到桥梁列表*/
      getList() {
        this.bridgeSelect = [];
        this.$vux.loading.show({
          text: '正在加载...'
        })
        if (this.loginInfo.type == 0) {
          this.$http.get(acquisition_url + '/structure/getAll', {
            params: {
              accessToken: this.accessToken
            }
          }).then((res) => {
            var resData = res.data;
            if (res.data.resultCode == 1) {
              if (resData.data&&resData.data.length>0) {
                localStorage.setItem("bridgeList",JSON.stringify(resData.data))
                localStorage.setItem("bridgeInfo",JSON.stringify(resData.data[0]))

                this.bridgeList = [];
                for (var i = 0; i < resData.data.length; i++) {
                  let datas = resData.data[i];
                  var list = [];
                  if (datas.isAlarm) {
                    list.title = datas.project_name + "<span class='showAlarm'></span>";
                  } else {
                    list.title = datas.project_name
                  }
                  list.code = datas.code;
                  list.src = this.imgUrl + datas.pcode;
                  list.id = datas.code;
                  list.bridgeInfo = datas;
                  this.bridgeList.push(list);
                }
                // this.renderMap();
              }
            } else if (res.data.resultCode == 0) {
              this.$vux.toast.text(res.data.msg);
            } else {
              this.$vux.toast.text(res.data.msg);
            }
            this.$vux.loading.hide()



          }, (error) => {
            this.$vux.loading.hide()
          });
        } else if (this.loginInfo.type == 2) {
          this.$http.get(management_url + '/sub/findStructureByMasterId', {
            headers: {
              accessToken: this.accessToken
            },
            params: {
              master_id: this.loginInfo.id,
            }
          }).then((res) => {
            var resData = res.data;
            if (res.data.resultCode == 1) {
              /*判断是否有结构物，是否存在多桥和单桥*/
              if (resData.data&&resData.data.length>0) {
                localStorage.setItem("bridgeList",JSON.stringify(resData.data));
                localStorage.setItem("bridgeInfo",JSON.stringify(resData.data[0]))

                this.bridgeList = [];
                for (var i = 0; i < resData.data.length; i++) {
                  let datas = resData.data[i];
                  var list = [];
                  if (datas.isAlarm) {
                    list.title = datas.project_name + "<span class='showAlarm'></span>";
                  } else {
                    list.title = datas.project_name
                  }
                  list.code = datas.code;
                  list.src = this.imgUrl + datas.pcode;
                  list.id = datas.code;
                  list.bridgeInfo = datas;
                  this.bridgeList.push(list);

                }
                // this.renderMap();
              }
            } else if (res.data.resultCode == 0) {
              this.$vux.toast.text(res.data.msg);
            } else {
              this.$vux.toast.text(res.data.msg);
            }
            this.$vux.loading.hide()

          }, (error) => {
            this.$vux.loading.hide()
          });
        } else if (this.loginInfo.type == 3) {
          this.$http.get(management_url + '/sub/findSubaccountById', {
            headers: {
              accessToken: this.accessToken
            },
            params: {
              id: this.loginInfo.id,
            }
          }).then((res) => {
            var resData = res.data;
            if (resData.resultCode == 1) {
              if (resData.data) {
                if (resData.data.structures&&resData.data.structures.length>0) {
                  localStorage.setItem("bridgeList",JSON.stringify(resData.data.structures));
                  localStorage.setItem("bridgeInfo",JSON.stringify(resData.data.structures[0]))

                  this.bridgeList = [];
                  for (var i = 0; i < resData.data.structures.length; i++) {
                    let datas = resData.data.structures[i];
                    var list = [];
                    if (datas.isAlarm) {
                      list.title = datas.project_name + "<span class='showAlarm'></span>";
                    } else {
                      list.title = datas.project_name
                    }
                    list.code = datas.code;
                    list.src = this.imgUrl + datas.pcode;
                    list.id = datas.code;
                    list.bridgeInfo = datas;
                    this.bridgeList.push(list);

                  }
                  // this.renderMap();
                }
              }
            } else if (resData.resultCode == 0) {
              this.$vux.toast.text(resData.msg);
            } else {
              this.$vux.toast.text(resData.msg);
            }
            this.$vux.loading.hide()


          }, (error) => {
            this.$vux.loading.hide()
          });
        }
      },

      /*渲染地图*/
      renderMap(){
        var scope=this;
          let map =new BMap.Map("allmap"); // 创建Map实例
          map.centerAndZoom(new BMap.Point(116.404, 39.915), 13);// 初始化地图,设置中心点坐标和地图级别
          map.addControl(new BMap.MapTypeControl({//添加地图类型控件
            mapTypes:[
              BMAP_NORMAL_MAP,
              BMAP_HYBRID_MAP
            ]}));
          map.setCurrentCity("北京");// 设置地图显示的城市 此项是必须设置的
          map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
          //添加缩放平移控件
          map.addControl(new BMap.NavigationControl());
          /*添加标注*/
          function addMarkers(datas){
            //创建标注
            let point = new BMap.Point(datas.lng, datas.lat);
            var myIcon = new BMap.Icon("./static/images/ios-location.png", new BMap.Size(32,32));  //定义自己的标注
            var marker2 = new BMap.Marker(point,{icon:myIcon});  // 创建标注
            // map.centerAndZoom(point, 18);
            map.addOverlay(marker2);              // 将标注添加到地图中
            var content = "<table  style='width:100%;cursor: pointer' class='btn-hf'>";
            content = content + "<tr><td> 名称："+datas.fullname+"<td></tr>";
            content = content + "<tr><td> 类型："+datas.tpye+"</td></tr>";
            content = content + "<tr><td> 运行时间："+datas.run_time.substr(0,10)+"</td></tr>";
            // content = content + "<tr><td style='text-align: right;color:blue;'>查看详情>></td></tr>";
            content += "</table>";
            var infowindow = new BMap.InfoWindow(content);
            marker2.addEventListener("click",function(){
              // marker2.openInfoWindow(infowindow);
              localStorage.setItem("bridgeInfo", JSON.stringify(datas));
              scope.$router.push("/BridgeManage")
            });
            var label = new BMap.Label(content, {
              offset: new BMap.Size(15, -85)
            });
            label.setStyle({
              minWidth: "120px",
              padding:"5px 10px",
              color: '#666',
              background: '#fff',
              border: '1px solid "#ff8355"',
              borderRadius: "5px",
              textAlign: "left",
              minHeight: "26px",
              lineHeight: "26px"
            });
            marker2.setLabel(label);



            $('.btn-hf').click(function(){
              localStorage.setItem("bridgeInfo", JSON.stringify(datas));
              scope.$router.push("/BridgeManage")
            })
          };
        if(this.bridgeList&&this.bridgeList.length>0){
          for(var i in this.bridgeList){
            let datas=this.bridgeList[i];
            addMarkers(datas.bridgeInfo)
          }
          let defaultZoom=this.bridgeList[0].bridgeInfo;
          map.centerAndZoom(new BMap.Point(defaultZoom.lng,defaultZoom.lat),10)
        }


      },

      //这个方法只取未读的数量，不受已读等其他因素的影响
      getalarmCount(){
        this.$http.get(acquisition_url + '/acquisiteEquipment/findSensorByType', {
          // this.axios.get('acquisition_url/acquisiteEquipment/findAllSensorByType',{
          headers: {
            accessToken: this.accessToken,
          },
          params: {
            state:'waitHand',
            type:'alarm',
            currentPage: this.currentPage,
            pageSize: 1
          }
        }).then((res) => {
          var resData = res.data;
          if (resData.resultCode == 1) {
            if (resData.count) {
              this.alarmCount = resData.count;
            }

          } else if (resData.resultCode == 0) {
            if(resData.msg!="accessToken不能为空"){
              this.$vux.toast.text(resData.msg);
            }
          } else {
            if(resData.msg!="accessToken不能为空"){
              this.$vux.toast.text(resData.msg);
            }
          }

        }, (error) => {

        });
      },
      /*点击桥梁列表事件时触发*/
      onClickItem(item, $event) {
        localStorage.setItem("bridgeInfo", JSON.stringify(item.bridgeInfo));
        this.$router.push("/BridgeManage")
      },


      //退出登录
      signOut(){
        var scope = this;
        scope.$vux.confirm.show({
          title: "提示",
          content: "是否确定退出登录?",
          onCancel() {

          },
          onConfirm() {

            if(scope.localopenid){
              scope.$http.get(management_url + '/user/unbindWeChatUser', {
                // this.axios.get('acquisition_url/acquisiteEquipment/findAllSensorByType',{
                params: {
                  openid:scope.localopenid
                }
              }).then((res) => {
                var resData = res.data;
                if (resData.resultCode == 1) {
                  scope.$vux.toast.text(resData.msg);
                  clearAllCookie();
                  localStorage.clear();
                  scope.$router.push("/Oauth")
                } else if (resData.resultCode == 0) {
                  scope.$vux.toast.text(resData.msg);
                } else {
                  scope.$vux.toast.text(resData.msg);
                }

              }, (error) => {

              });


            }else {
              scope.$vux.confirm.show({
                title: "提示",
                content: "没有检测到您的登录秘钥，如需更换账号，请重新登录后，再执行退出操作",
                onCancel() {

                },
                onConfirm() {
                  scope.$router.push("/Oauth")
                }
              })
            }
          }
        })
      },


      /*================桥梁列表组件结束=============*/
      //获取扫一扫的签名
      loadSign() {
        let scope = this;

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
        let scope=this;
        if(!this.bridgeList || this.bridgeList.length==0){
          scope.$vux.alert.show({
            title: '提示',
            content: '请先创建监测物',
            onShow() {

            },
            onHide() {

            }
          })
          return;
        }
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
                          if(structures[i].code==JSON.parse(result).structureCode){
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
                for(let i=0;i<scope.bridgeList.length;i++){
                  if(scope.bridgeList[i].code==JSON.parse(result).structureCode){
                    localStorage.setItem("bridgeInfo", JSON.stringify(scope.bridgeList[i]));
                    scope.$router.push("/SensorInfo");
                  }
                }

              }

            }
          });
        });
      },

    }
  }
</script>
<style lang="scss" scoped>

  .myContainer {
    height: 100%;
    background: #F4F4FA;

    /*顶部内容开始*/
    .top {
      background: url("../../assets/images/index_top.jpg") no-repeat;
      background-size: 100% 100%;
      height: 160px;
      position: relative;
      margin-bottom: 40px;
      .flexTop {
        width:90%;
        margin: 0 auto;
        &>div{
          float: left;
        }
        &>div:last-child{
         /* width:50%;*/
        }
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: block;
          float: left;
        }
      }
      .topInfo {
        padding-left: 5px;
        box-sizing: border-box;
        p {
          font-size: 18px;
          color: #fff;
          display: inline-block;
          margin-right: 10px;
        }
        span {
          background: #7BBDCE;
          border-radius: 50px;
          width: auto;
          text-align: center;
          color: #fff;
          font-size: 14px;
          padding: 3px 15px;
          margin-top: 5px;
          margin-left: -5px;
          font-weight: 200;
        }
      }
    }

    /*顶部内容结束*/

    /*tab切换的内容开始*/
    .indexTab {
      width: 90%;
      margin: 0 auto;
      height: 80px;
      border-radius: 20px;
      position: absolute;
      margin-left: 5%;
      z-index: 1;
      bottom: -25px;
      background: #fff;
      .vux-flexbox-item {
        text-align: center;
        margin-left: 0 !important;
        span{
          display: inline-block;
          text-align: center;
          width: 100%;
          color:#555555;
          img{
            width:26px;
            height:26px;
          }
        }
        span:first-child{
          position: relative;
          height:30px;
          margin-top: 10px;
          i{
            position: absolute;
            top:0px;
            display: inline-block;
            text-align: center;
            background: #f74c31;
            color: #fff;
            font-size: 12px;
            height: 16px;
            line-height: 16px;
            border-radius: 8px;
            padding: 0 6px;
            background-clip: padding-box;
            vertical-align: middle;
          }
        }
      }


    }

    /*tab切换的内容结束*/



    /*桥梁内容展示*/
    .bridgeList{
      height:calc(100% - 160px);
      width:90%;
      margin: 0 auto;
      opacity: 1
    }


    .active{
      opacity: 1 !important;
      display: block;
    }
    .setdisplay{
      opacity: 0 !important;
      display: none;
    }
    /*告警内容样式结束*/
  }


  /*扫一扫的样式*/
  .scanStyle{
    position: absolute;
    right: 20px;
    width: 32px;
    top: 10px;
  }
</style>

<style lang="scss">
  .panelList{
    margin: 20px 0;
    .weui-media-box__title{
      font-size:14px;
      color: #343F65;
    }
    .weui-media-box_appmsg .weui-media-box__thumb{
      vertical-align: middle;
    }
  }
</style>


