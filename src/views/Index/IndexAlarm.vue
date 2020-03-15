<template>
  <div class="myContainer">
    <x-header :left-options="{showBack: false}">桥梁健康监测云平台</x-header>
    <div class="top">
      <!--<img src="../../assets/images/scan.png" @click="scan()" class="scanStyle"/>-->
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
        <flexbox-item @click.native="selectTab('bridge')" :span="1/3"><span><img :src="iconBridge"/></span><span>桥梁</span></flexbox-item>
        <flexbox-item @click.native="selectTab('alarm')" :span="1/3"><span><img :src="iconAlarm"/><i v-if="alarmCount">{{alarmCount}}</i></span><span style="color:#6DDDD1">告警</span></flexbox-item>
        <flexbox-item @click.native="selectTab('statistics')" :span="1/3"><span><img :src="iconDeal"/></span><span>统计</span></flexbox-item>
      </flexbox>
      <!--显示tab切换结束-->
    </div>




    <!--告警信息的内容开始-->
    <panel header="告警信息" style="margin-top: 0;background: transparent" v-if="showPannel=='alarm'"></panel>

    <div class="AlarmInfo" >

      <div class="selectOption" style="display: none">
         <el-select v-model="currentBridge" placeholder="请选择"  @change="changeBridge">
           <el-option
             v-for="(item,index) in bridgeList"
             :key="index"
             :label="item.project_name"
             :value="item.project_name"
           >
           </el-option>
         </el-select>


      </div>





      <div class="AlarmInfoTop" v-if="alarmList&&alarmList.length>0">
        告警信息
        <div class="AlarmTab" @change="changeRead">
          <el-checkbox v-model="checked" >显示已读</el-checkbox>
        </div>
      </div>
      <!-- <flexbox v-for="(item,index) in alarmList" :key="item">
         <flexbox-item :span="13/20">
           <div class="alarmContent">
             <p><span style="width:40%">{{item.structure_name}}</span><span style="width:60%">&nbsp;&nbsp;{{item.name}}</span></p>
             <p><span >告警阈值&nbsp;:&nbsp;{{item.level}}&nbsp;{{item.scope}}</span></p>
             <p><span >告警值&nbsp;:&nbsp;{{item.value_scale}}</span></p>
           </div>
         </flexbox-item>
         <flexbox-item :span="7/20">
           <div class="alarmContent">
             <x-button mini type="primary" @click.native="toAlarmDeal(item)">处理</x-button>
             <x-button mini type="primary" @click.native="toIgnore(item)">忽略</x-button>
           </div>
         </flexbox-item>
       </flexbox>-->

      <group class="alarmList">
        <scroller use-pullup :pullup-config="pullupDefaultConfig" @on-pullup-loading="loadMore"
                  lock-x ref="scrollerBottom" height="-250" :use-pulldown="false">
          <div class="box2">
            <cell-box is-link v-for="(item,index) in alarmList" :key="item" @click.native="toAlarmDeal(item)"  class="cellList" :style="{borderLeft:'4px solid'+item.alarm_color }">
              <div class="alarmContent">
                <p><span style="width:40%">{{item.structure_name}}</span><span style="width:60%">&nbsp;&nbsp;{{item.typeName}}</span></p>
                <!--<p><span style="width:100%">告警阈值&nbsp;:&nbsp;{{item.level}}&nbsp;{{item.scope}}</span></p>-->
                <p><span style="width:100%">告警内容&nbsp;:&nbsp;{{item.content}}</span></p>
                <p><span style="width:100%">发生时间&nbsp;:&nbsp;{{item.time}}</span></p>
              </div>
              <!--<img :src="ioncAlreadyRead" v-if="item.state&&item.state!='待处理'" class="readed"/>-->
              <span v-if="item.state&&item.state!='待处理'" class="readed">已读</span>
              <!--<img :src="iconAttention" v-if="item.attention_time&&item.attention_time!=''" class="attention" />-->
              <span class="attention" v-if="item.attention_time&&item.attention_time!=''" ><i class="fa fa fa-check"></i>已关注</span>
            </cell-box>
            <load-more tip="loading"></load-more>
          </div>
        </scroller>
        <!--<loading v-model="showloading" :text="textloading"></loading>-->


      </group>
    </div>

    <!--告警信息的内容结束-->
  </div>
</template>
<script>
  import {setCookie, getCookie, delCookie,clearAllCookie} from '../../assets/js/cookie.js'

  var publicapi = require('../../assets/js/publicapi.js')
  var api = publicapi.proxy.monitoring_url;
  var acquisition_url = publicapi.proxy.acquisition_url;  //
  var management_url = publicapi.proxy.management_url;
  import {mapGetters} from 'vuex'

  const pulldownDefaultConfig = {
    content: '下拉刷新',
    height: 40,
    autoRefresh: false,
    downContent: '下拉刷新',
    upContent: '释放后刷新',
    loadingContent: '正在刷新...',
    clsPrefix: 'xs-plugin-pulldown-'
  }
  const pullupDefaultConfig = {
    content: '上拉加载更多',
    pullUpHeight: 60,
    height: 40,
    autoRefresh: false,
    downContent: '释放后加载',
    upContent: '上拉加载更多',
    loadingContent: '加载中...',
    clsPrefix: 'xs-plugin-pullup-'
  }

  export default {
    data() {
      return {
        imageUrl: require("../../assets/images/newlogo.png"),
        type: '3', //pannel展示的方式 1,2,3,4,5 共5种,可参考vux的文档pannel部分
        showPannel: 'bridge',//展示哪个tab内容
        bridgeList: localStorage.getItem("bridgeList")?JSON.parse(localStorage.getItem("bridgeList")):[], //桥梁列表
        alarmList: [],//告警桥梁信息
        accessToken: getCookie("accessToken"),//鉴权码
        alarmCount: '',//告警数量
        loginInfo: localStorage.getItem("loginInfo") ? JSON.parse(localStorage.getItem("loginInfo")) : "", //登录成功，存储在本地的信息

        checked:false,//显示已读

        currentPage: 1,//页码

        iconBridge: require("../../assets/images/icon/icon_bridge_Dark.png"),
        iconAlarm: require("../../assets/images/icon/icon_alarm.png"),
        iconDeal: require("../../assets/images/icon/icon_statistics_Dark.png"),

        iconAttention:require("../../assets/images/icon/icon_attention4.png"),
        ioncAlreadyRead:require("../../assets/images/icon/icon_alreadyRead.png"),

        currentBridge:"",//当前选中的桥梁
        currentBridgeIndex:0,//当前选中桥梁的下标
        bridgeInfo:localStorage.getItem("bridgeInfo")?JSON.parse(localStorage.getItem("bridgeInfo")):[],

        pullupDefaultConfig: pullupDefaultConfig,
        pulldownDefaultConfig: pulldownDefaultConfig,

        localopenid: localStorage.getItem("openid"),
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
      sessionStorage.removeItem("scanData");

    },
    mounted(){
      // this.getList();
      this.judgeLogin();  //获取登录状态

      var readType=localStorage.getItem("readType");
      //0 代表未读 1代表已读
      if(readType==0){
        this.checked=false;
      }else if(readType==1){
        this.checked=true;
      }

      this.$nextTick(() => {
        this.$refs.scrollerBottom.reset({top: 0})
      })
      this.loadMore()
    },
    methods: {
      /*验证登录*/
      judgeLogin(){
        if(this.accessToken&&this.loginInfo&&this.loginInfo!=""){
          this.getList();//取出桥梁列表

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
          // this.getAlarm(); //获取告警信息
          this.getalarmCount();//获取未读的数量
        }else{
          // this.$vux.toast.text('获取桥梁信息失败，请退出重新登录');
        }


      },


      /*================桥梁列表组件结束=============*/

      /*================告警信息组件开始=============*/

      //第一次加载的时候容易为空true
      getAlarm() {
        /*let name= this.$route.query.name;
        if(name=='alarm'){
          this.showPannel='alarm'
        }*/
        this.$vux.loading.show({
          text: '正在加载...'
        })

        /*调用接口取值*/
        this.$http.get(acquisition_url + '/acquisiteEquipment/findSensorByType', {
          // this.axios.get('acquisition_url/acquisiteEquipment/findAllSensorByType',{
          headers: {
            accessToken: this.accessToken,
          },
          params: {
            state: this.checked ? "" : 'waitHand',
            platform: this.checked ? "wechat" : "",
            type:'alarm',
            // structureCode: this.bridgeList[this.currentBridgeIndex].code,
            currentPage: this.currentPage,
            pageSize: 40
          }
        }).then((res) => {
          var resData = res.data;
          if (resData.resultCode == 1) {
            if (resData.data&&resData.data.length>0) {
              this.currentPage++;
              this.alarmList=this.alarmList.concat(resData.data);
              this.$refs.scrollerBottom.donePullup();
              this.$nextTick(() => {
                this.$refs.scrollerBottom.reset()
              })
            } else if (resData.data && resData.data.length == 0) {
              this.$nextTick(() => {
                this.$refs.scrollerBottom.donePullup();
                this.$refs.scrollerBottom.reset({
                  top:230
                })
               /* this.$refs.scrollerBottom.reset({
                  top:40
                })*/
              })

              this.$vux.toast.text('没有更多数据');
            }

          } else if (resData.resultCode == 0) {
            // this.$vux.toast.text(resData.msg);
            if(resData.msg!="accessToken不能为空"){
              this.$vux.toast.text(resData.msg);
            }
          } else {
            // this.$vux.toast.text(resData.msg);
            if(resData.msg!="accessToken不能为空"){
              this.$vux.toast.text(resData.msg);
            }
          }
          this.$vux.loading.hide();
        }, (error) => {
          this.$vux.loading.hide();
        });
      },

      loadMore() {
        this.getAlarm();
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
          // structureCode: this.bridgeList[this.currentBridgeIndex].code,
          currentPage: 1,
          pageSize: 1
        }
      }).then((res) => {
        var resData = res.data;
        if (resData.resultCode == 1) {
          if (resData.count) {
            this.alarmCount = resData.count;
          }

        } else if (resData.resultCode == 0) {
          this.$vux.toast.text(resData.msg);
        } else {
          this.$vux.toast.text(resData.msg);
        }

      }, (error) => {

      });
    },
    toAlarmDeal(item) {
      localStorage.setItem("alarmInfo", JSON.stringify(item));
      this.$router.push("/AlarmInfoDeal")
    },

    //下拉框改变的事件
    changeBridge(e){
      for(var i=0;i<this.bridgeList.length;i++){
        let datas=this.bridgeList[i];
        if(e==datas.shortname){
          localStorage.setItem("bridgeInfo",JSON.stringify(datas))
          this.currentBridgeIndex=i;
          this.getAlarm();
        }
      }
    },
    //显示已读的复选框
    changeRead(){
        this.alarmList=[];
        this.$nextTick(() => {
          this.$refs.scrollerBottom.reset({
            top:0
          })
        });
        //1 代表已读 查全部的  0 代表未读 只查未读
        if(this.checked){
          localStorage.setItem("readType",'1');
        }else{
          localStorage.setItem("readType",'0')
        }

        this.currentPage=1;
        this.getAlarm();
    },
    /*忽略功能*/
    toIgnore(item) {
      const scope = this;
      scope.$vux.confirm.show({
        title: "提示",
        content: "是否确定删除?",
        onCancel() {

        },
        onConfirm() {
          scope.delLog(item);
        }
      })
    },
    /*向服务器请求删除数据*/
    delLog(item) {
      this.$vux.loading.show({
        text: '正在删除...'
      })
      this.$http.get(acquisition_url + '/alarm/delEqpFault', {
        params: {
          accessToken: this.accessToken,
          ids: item.id
        }
      }).then((res) => {
        var resData = res.data;
        if (resData.resultCode == 1) {
          this.$vux.toast.text(resData.msg);
          this.getAlarm();
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





    //设置全部已读
    setAllHand(){
      const scope = this;
      scope.$vux.confirm.show({
        title: "提示",
        content: "是否全部设为已读，该操作无法撤销!",
        onCancel() {

        },
        onConfirm() {

          scope.$vux.loading.show({
            text: '正在操作中...'
          })

          scope.$http.get(acquisition_url + '/alarm/solveAllFaultInfo', {
            params: {
              accessToken: scope.accessToken,
              scode:scope.bridgeList[scope.currentBridgeIndex].code,
              username:scope.loginInfo.username,
              suggestion:"",
            }
          }).then((res) => {
            var resData = res.data;
            if (resData.resultCode == 1) {
              scope.$vux.toast.text(resData.msg);
              scope.getAlarm();
              scope.getalarmCount();
            } else if (resData.resultCode == 0) {
              scope.$vux.toast.text(resData.msg);
            } else {
              scope.$vux.toast.text(resData.msg);
            }
            scope.$vux.loading.hide();

          }, (error) => {
            scope.$vux.loading.hide()
          })
        }
      })
    },
      //退出登录
      signOut(){
        const scope = this;
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




    /*================告警信息组件结束==============*/


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
    overflow: hidden;
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
          /*width:50%;*/
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

    .panelList{
      margin: 20px 0;
    }
    /*告警内容样式开始*/
    .AlarmInfo {
      height: calc(100% - 200px);
      width:90%;
      margin: 0 auto;


      &>.AlarmInfoTop{
        color:#3e4047;
        padding-left: 10px;
        font-weight: 300;
        font-size:14px;
        padding: 14px 15px 10px;
        color: #999999;
        font-size: 13px;
        position: relative;
        background: #fff;
        .AlarmTab{
          float: right;
          margin-top: -2px
        }
      }


      .alarmList{
        .weui-cells{
          margin-top: 0;
        }
      }

      .vux-flexbox {
        border-bottom: 1px solid #ddd;
        padding: 10px 10px;
        overflow: hidden;
        background: #fff;
        margin-bottom: 20px;
        border-radius: 10px;
      }
      .cellList{
        position: relative;
        margin-top: 0;
        box-sizing: border-box;
        padding-right: 50px;
       /* .attention{
          display: inline-block;
          position: absolute;
          right: 30px;
          bottom: 10px;
        }*/
        .attention{
          border:1px solid red;
          color:red;
          height:23px;
          line-height: 23px;
          font-size:12px;
          width:63px;
          display: inline-block;
          box-sizing: border-box;
          position: absolute;
          right: 30px;
          bottom: 10px;
          text-align: center;
          border-radius: 5px;
          i{
            margin-right: 5px;
          }
        }
       /* .readed{
          display: inline-block;
          position: absolute;
          right: 30px;
          bottom: 35px;
        }*/
        .readed{
          position: absolute;
          right: 30px;
          bottom: 40px;
          display: inline-block;
          background: red;
          border-radius: 5px;
          background: red;
          color: #fff;
          font-size:10px;
          padding: 2px 5px;
        }
      }
      .alarmList{
        /*overflow-y: auto;*/
        height:calc(100% - 44px);
      }
      .alarmContent {
        padding-right: 20px;
        box-sizing: border-box;
        width:100%;
        p {
          margin-bottom: 5px;
          line-height: 25px;
          height: 25px;
        }
        p:first-child{
          span{
            font-size:14px;
            font-weight: 600;
            color:#343F65;
          }
        }
        p:last-child {
          margin-bottom: 0;
        }
        span {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 12px;
          font-weight: 200;
          color: #343F65;
        }
        .weui-btn {
          font-size: 12px;
          padding: 0 10px;
          margin-bottom: 10px;
          background:#00D1EF ;
          border-radius: 20px;
          margin-top: 58px;
        }
        .weui-btn:last-child {
          margin-bottom: 0;
          background: #F07F6C;
        }


      }

      /*下拉框的样式*/
      .selectOption{
        overflow: hidden;
        margin-bottom: 20px;

      }



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


