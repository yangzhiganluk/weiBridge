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

    <div style="width:100%;font-size:18px;text-align: center">
      桥梁监测云平台
    </div>
    <!--显示间隔开始-->
    <div class="space_30" ></div>
    <!--显示间隔结束-->

    <!--登录部分开始-->
    <group class="loginInput">
      <x-input title="账号" placeholder="请输入账号" v-model="account" style="font-size:16px;"></x-input>
      <x-input title="密码" placeholder="请输入密码"  type="password" v-model="user_password" style="font-size:16px;"></x-input>
    </group>

    <!--登录部分结束-->

    <!--显示间隔开始-->
    <div class="space_80" ></div>
    <!--显示间隔结束-->

    <!--登录按钮-->
    <x-button :gradients="['#1D62F0', '#19D5FD']" @click.native="checkLogin">登录</x-button>
    <!--显示间隔开始-->
    <div class="space_10"></div>
    <!--显示间隔结束-->
    <!-- 注册按钮 -->
    <x-button type="default" link="/Register">免费注册</x-button>
    
    
  </div>
</template>



<script>
  import {setCookie, getCookie, delCookie} from 'assets/js/cookie.js'
  var publicapi = require('assets/js/publicapi.js')
  var management_url = publicapi.proxy.management_url;
  export default {
    data() {
      return {
        imageUrl: require("assets/images/logo1.png"),
        account:'',   //登录用户名
        user_password:'', //登录密码
        accessToken:'',//鉴权码
        openid: ''
      }
    },
    created() {
      this.openid = Date.parse(new Date()) //用户的唯一标识
      localStorage.setItem("openid", this.openid);
    },
    methods: {

      /*登录脚本*/
      checkLogin(){
        if(this.account&&this.user_password){
          this.loginSubmit();
        }else{
          this.$vux.toast.text('请输入用户名和密码')
        }
      },

      /*调用*/
      loginSubmit(){
        var scope=this;
        scope.$vux.loading.show({
          text: '正在验证...'
        })
        let params = new FormData();
        params.append('userName',scope.account);
        params.append('password',scope.user_password);
        params.append('openid',scope.openid)
        scope.$http.post(management_url + '/user/signInByWeChat ',params, {
        }).then((res) => {
          var resData = res.data;
          if (resData.resultCode == 1) {
            /*判断是否有结构物，是否存在多桥和单桥*/
            if (resData.data) {
              localStorage.setItem("loginInfo",JSON.stringify(resData.data));
              delCookie("accessToken");
              delCookie("refreshToken");

              setCookie("accessToken",resData.extend.accessToken,Infinity);
              setCookie("refreshToken",resData.extend.refreshToken,Infinity);
              scope.$vux.loading.hide();
              scope.$vux.toast.text('登录成功,即将跳转...', 'middle');
              setTimeout(function(){
                scope.$router.push("/Index");
              },1500)
            }
          }else if(res.data.resultCode==0){
            scope.$vux.toast.text(res.data.msg)
          }else{
            scope.$vux.toast.text(res.data.msg)
          }
          scope.$vux.loading.hide()
        }, (error) => {

        });
      },

     

    }
  }
</script>
<style lang="scss" scoped>
    @import './login-noauth.scss';
</style>