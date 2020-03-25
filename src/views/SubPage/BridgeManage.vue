<template>
  <div class="myContainer">
    <x-header :left-options="{backText: ''}" @click.native="goback">{{bridgeInfo.fullname}}</x-header>
    <!--显示头像-->
    <flexbox>
      <flexbox-item>
        <div class="flex-photo">
          <div id="allmap" ref="allmap" style="height:100%;width:100%;"></div>
        </div>
      </flexbox-item>
    </flexbox>
    <!--显示头像-->

    <!--显示间隔开始-->
    <div class="space_20"></div>
    <!--显示间隔结束-->
    <div class="cellTop">设备管理</div>

    <group  class="cellBox">
      <cell-box is-link @click.native="switchCell('workState')">监测系统工作状态</cell-box>
      <cell-box is-link @click.native="switchCell('runState')">运营管理状态</cell-box>
    </group>

    <div class="space_20"></div>

    <div class="cellTop">桥梁健康评估</div>
    <group class="cellBox">
      <cell-box is-link @click.native="switchCell('YB')">应变</cell-box>
      <cell-box is-link @click.native="switchCell('WD')">温度</cell-box>
    </group>
    <!--显示间隔开始-->
    <div class="space"></div>
    <!--显示间隔结束-->
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
        imageUrl: "http://www.qiaohaoba.net/data_acquisition/file/get/"+JSON.parse(localStorage.getItem("bridgeInfo")).pcode,
        accessToken:getCookie("accessToken"),//鉴权码
        bridgeInfo:JSON.parse(localStorage.getItem("bridgeInfo")),
        loginInfo: localStorage.getItem("loginInfo") ? JSON.parse(localStorage.getItem("loginInfo")) : "", //登录成功，存储在本地的信息

      }
    },
    computed: {
      // ...mapGetters(['username']),
      ...mapGetters(['imgUrl', '']),
    },
    beforeCreate() {

    },
    created() {

    },
    mounted(){
      this.renderMap();//渲染地图
    },
    methods: {
      switchCell(type){
        if(type=='workState'){
           this.$router.push("/WorkState")
        }else if(type=='runState'){
        }else if(type=='YB'){

        }else if(type=='WD'){

        }
      },
      /*点击返回*/
      goback(){
        this.$router.replace("/Index")
      },
      /*渲染地图*/
      renderMap(){
        const scope = this;
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
          if(datas.run_time&&datas.run_time!=""){
            content = content + "<tr><td> 运行时间："+datas.run_time.substr(0,10)+"</td></tr>";
          }
          // content = content + "<tr><td style='text-align: right;color:blue;'>查看详情>></td></tr>";
          content += "</table>";
          var infowindow = new BMap.InfoWindow(content);
         /* marker2.addEventListener("click",function(){
            // marker2.openInfoWindow(infowindow);
            localStorage.setItem("bridgeInfo", JSON.stringify(datas));
            scope.$router.push("/BridgeManage")
          });*/
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

        };


          let defaultZoom=this.bridgeInfo;
          map.centerAndZoom(new BMap.Point(defaultZoom.lng,defaultZoom.lat),10);

          addMarkers(this.bridgeInfo);


      },

    }
  }
</script>
<style lang="scss" scoped>
    body{
      background-color: red;
    }
  .myContainer {
    .flex-photo{
      text-align: center;
      height:200px;
      .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width:100px;
        height:100px;
        line-height: 100px;
        text-align: center;
        border:1px solid #ddd;
        border-radius: 50%;
      }
      .avatar {
       height:200px;
        width:100%;
        display: block;
        margin: 0 auto;
      }
    }



    .weui-cells__title{
      font-weight:600;
      font-size:18px;
    }
  }

</style>


