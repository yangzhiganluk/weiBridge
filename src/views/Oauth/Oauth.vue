<template>
  <div class="myContainer">
    <!--显示间隔开始-->
    <div class="space_30"></div>
    <!--显示间隔结束-->

    <!--显示头像-->
    <flexbox>
      <flexbox-item>
        <div class="flex-photo">
      <!--    <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-picture avatar-uploader-icon"></i>
          </el-upload>-->
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
        </div>
      </flexbox-item>
    </flexbox>
    <!--显示头像-->

    <!--显示间隔开始-->
    <div class="space_30"></div>
    <!--显示间隔结束-->

    <div style="width:100%;font-size:18px;text-align: center;color:#fff">
        桥梁监测云平台
    </div>
    <!--显示间隔开始-->
    <div class="space_30" ></div>
    <!--显示间隔结束-->


    <!--显示间隔开始-->
    <div class="space_80" ></div>
    <!--显示间隔结束-->

    <!--登录按钮-->
    <!--<x-button plain  :gradients="['#1D62F0', '#19D5FD']"  @click.native="getCode">正在拉取授权...</x-button>-->
    <div class="button loading">正在获取授权<span class="dotting"></span></div>
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
        imageUrl: require("../../assets/images/newlogo.png"),
      }
    },
    computed: {
      // ...mapGetters(['username']),
      ...mapGetters(['Appid', 'Secret']),
    },
    beforeCreate() {

    },
    created() {
       this.getCode();
    },
    methods: {
      getCode() {
         window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx96143db2d3a1a789&redirect_uri=http://www.qiaohaoba.net/mobileMonitor&response_type=code&scope=snsapi_base&state=1#wechat_redirect';
      }
    }
  }
</script>
<style lang="scss" scoped>
    body{
      background-color: red;
    }
  .myContainer {
    width:100%;
    height:100%;
    background: url("../../assets/images/login_bg.jpg");
    background-size:cover;
    .flex-photo{
      text-align: center;
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
        width:100px;
        height:100px;
        line-height: 100px;
        border-radius: 50%;
        display: block;
        margin: 0 auto;
      }
    }
    .flex-demo {
      text-align: center;
      color: #fff;
      background-color: #20b907;
      border-radius: 4px;
      background-clip: padding-box;
    }
    .loginInput {
      font-size:16px;
      .weui-cell{
       font-size:16px;
      }
      .weui-input{
        font-size:16px;
      }
    }
    .weui-btn{
      font-size:16px;
      width:60%;
      border:none;
    }
    .button{
      height: 50px;
      width: 80%;
      line-height: 50px;
      text-align: center;
      color:#60598d;
      margin: 0 auto;
      margin-top: 20px;
      font-size: 18px;
      font-family: "微软雅黑";
      font-weight: bold;
      border-radius: 5px;
      background: #ffffff;

    }

    .button:active {
      background-color:#BDBFD1;
    }

    .dotting {
      display: inline-block; width: 14px; min-height: 2px;
      padding-right: 4px;padding-left: 4px;margin-left: 5px;
      border-left: 2px solid currentColor; border-right: 2px solid currentColor;
      background-color: currentColor; background-clip: content-box;
      box-sizing: border-box;
      -webkit-animation: dot 2s infinite step-start both;
      animation: dot 2s infinite step-start both;
      /**zoom: expression(this.innerHTML = '...'); !* IE7 *!*/
    }
    .dotting:before { content: '...'; } /* IE8 */
    .dotting::before { content: ''; }
    :root .dotting { margin-left: 2px; padding-left: 2px; } /* IE9+ */

    @-webkit-keyframes dot {
      25% { border-color: transparent; background-color: transparent; }
      50% { border-right-color: transparent; background-color: transparent; }
      75% { border-right-color: transparent; }
    }
    @keyframes dot {
      25% { border-color: transparent; background-color: transparent; }
      50% { border-right-color: transparent; background-color: transparent; }
      75% { border-right-color: transparent; }
    }
  }

</style>


