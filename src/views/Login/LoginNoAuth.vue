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
    <x-button plain  :gradients="['#1D62F0', '#19D5FD']"  @click.native="checkLogin">登录</x-button>

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
        imageUrl: require("../../assets/images/logo1.png"),
        account:'',   //登录用户名
        user_password:'', //登录密码
        accessToken:'',//鉴权码
        openid:Date.parse(new Date()),//用户的唯一标识
      }
    },
    computed: {
      // ...mapGetters(['username']),
      ...mapGetters(['', '']),
    },
    beforeCreate() {

    },
    created() {

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
          if (res.data.resultCode == 1) {
            /*判断是否有结构物，是否存在多桥和单桥*/
            if (resData.data) {
              localStorage.setItem("loginInfo",JSON.stringify(resData.data));
              delCookie("accessToken");
              delCookie("refreshToken");

             // setCookie("accessToken",resData.extend.accessToken,2*3600);
             // setCookie("refreshToken",resData.extend.accessToken,3*3600)
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
      }

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
  }

</style>


