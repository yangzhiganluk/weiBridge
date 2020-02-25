<template>
  <div class="myContainer">
    <!--显示间隔开始-->
    <div class="space_20"></div>
    <!--显示间隔结束-->

    <!--显示头像-->
    <flexbox style="margin-top: 50px">
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
          <img  :src="login_url" class="avatar">
        </div>
      </flexbox-item>
    </flexbox>
    <!--显示头像-->

    <!--显示间隔开始-->
    <div class="space_20"></div>
    <!--显示间隔结束-->

   <!-- <div style="width:100%;font-size:18px;text-align: center">
      桥梁监测云平台
    </div>-->
    <!--显示间隔开始-->
    <div class="space_30"></div>
    <!--显示间隔结束-->
    <!--显示间隔开始-->
    <div class="space_20"></div>
    <!--显示间隔结束-->

    <!--登录部分开始-->
    <form action="#">
      <div class="loginInput">
        <!--<x-input :title="账号" placeholder="请输入账号" v-model="account" style="font-size:16px;"></x-input>-->
        <!--<x-input title="密码" placeholder="请输入密码" type="password" v-model="password" style="font-size:16px;"></x-input>-->
        <div class="longin-boder">
          <div class="image"><img :src="username_url"></div>
          <input class="input" type="text" placeholder="请输入用户名" v-model="account" />
        </div>
        <!--End用户名输入框-->
        <div class="longin-boder">
          <div class="image"><img :src="password_url"></div>
          <input class="input" type="password" placeholder="请输入密码" v-model="user_password"/>
        </div>
      </div>
    </form>



    <!--登录部分结束-->

    <!--显示间隔开始-->
    <div style="height:12vh"></div>
    <!--显示间隔结束-->

    <!--登录按钮-->
    <!--<x-button plain :gradients="['#1D62F0', '#19D5FD']" @click.native="checkLogin">登录</x-button>-->
    <div class="button" @click="checkLogin">登录</div>
    <!--显示间隔开始-->
    <!--显示间隔结束-->
  </div>
</template>


<script>
  import {setCookie, getCookie, delCookie} from '../../assets/js/cookie.js'
  import $ from 'jquery'
  var publicapi = require('../../assets/js/publicapi.js')
  var api = publicapi.proxy.monitoring_url;
  var oauthUrl = publicapi.proxy.oauth_url;

  var acquisition_url = publicapi.proxy.acquisition_url;  //
  var management_url = publicapi.proxy.management_url;
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        login_url: require("../../assets/images/newlogo_word.png"),
        username_url: require("../../assets/images/icon_username.png"),
        password_url:require("../../assets/images/icon_password.png"),
        account: '',   //登录用户名
        user_password: '', //登录密码
        accessToken: getCookie("accessToken"),//鉴权码
        loginInfo: localStorage.getItem("loginInfo") ? JSON.parse(localStorage.getItem("loginInfo")) : "",
        // openid:Date.parse(new Date()),//用户的唯一标识
        localopenid: localStorage.getItem("openid"),
        openid:"",//用户的openid

      }
    },
    computed: {
      // ...mapGetters(['username']),
      ...mapGetters(['Appid', 'Secret']),
    },
    beforeCreate() {

    },
    created() {
       // this.getOpenId();
        this.judgeLogin();  //判断是否需要登录

    },
    mounted(){

    },
    methods: {
      /*授权规则，验证accesstoken和loginInfo*/
      judgeLogin(){
        if(this.accessToken&&this.loginInfo&&this.loginInfo!=""){
          this.$router.push("Index")
        }else{
          this.getOpenId();
        }

      },
      //测试账号
      getOpenId() {
        /*获取地址栏参数*/
        function GetQueryString(name) {
          var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
          var r = window.location.search.substr(1).match(reg);
          if(r!=null)return  unescape(r[2]); return null;
        }
        let code = GetQueryString("code");
           this.$vux.loading.show({
              text: '正在拉取授权...'
            })
        if (code && code != "") {
          // var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + this.Appid + '&secret=' + this.Secret + '&code=' + code + '&grant_type=authorization_code';
         this.$http.get(management_url+'/user/getOpenIdByCode', {
            // this.axios.get('acquisition_url/acquisiteEquipment/findAllSensorByType',{
            params:{
              code:code,
              grant_type:'authorization_code'
            }
          }).then((res) => {
            var resData = res.data;
           if (res.data.resultCode == 1) {
             if (resData.data&&resData.data.openid) {
                 localStorage.setItem("openid", resData.data.openid);
                 this.openid=resData.data.openid;
                 this.loginSubmit(resData.data.openid);
             }else{
               /*var scope=this;
               scope.$vux.alert.show({
                 title: '提示',
                 content: "拉取授权失败，请退出重新进入！",
                 onHide() {
                   WeixinJSBridge.call('closeWindow');
                   scope.$vux.alert.hide()
                 }
               })*/
             }
           } else if (res.data.resultCode == 0) {
             this.$vux.toast.text(res.data.msg)
           } else {
             this.$vux.toast.text(res.data.msg)
           }
           this.$vux.loading.hide()
          }, (error) => {
           this.$vux.loading.hide()
          });
          // window.location.href=url;
        }else{
          /*this.$vux.loading.hide();
          var scope=this;
          scope.$vux.alert.show({
            title: '提示',
            content: "拉取授权失败，请退出重新进入！",
            onHide() {
              WeixinJSBridge.call('closeWindow');
              scope.$vux.alert.hide()
            }
          })*/
        }
      },
      /*登录脚本*/
      checkLogin() {
        if (this.account && this.user_password) {

          if (this.openid && this.openid != "") {
            this.loginSubmit(this.openid);
          } else {
            if (this.localopenid) {
              this.loginSubmit(this.localopenid);
            } else {
              var scope=this;
              /*scope.$vux.alert.show({
                title: '提示',
                content: "拉取授权失败，请退出重新进入！",
                onHide() {
                  WeixinJSBridge.call('closeWindow');
                  scope.$vux.alert.hide()
                }
              })*/
            }
          }
        } else {
          this.$vux.toast.text('请输入用户名和密码')
        }
      },

      /*调用*/
      loginSubmit(id) {
        var scope = this;
        scope.$vux.loading.show({
          text: '正在验证...'
        });

        let params = new FormData();
        params.append('userName', scope.account);
        params.append('password', scope.user_password);
        params.append('openid', id)
        scope.$http.post(management_url+'/user/signInByWeChat ', params, {


        }).then((res) => {
          var resData = res.data;
          if (res.data.resultCode == 1) {
            /*判断是否有结构物，是否存在多桥和单桥*/
            if (resData.data) {
              localStorage.setItem("loginInfo", JSON.stringify(resData.data));
              delCookie('accessToken');
              delCookie('refreshToken');

              setCookie('refreshToken', resData.extend.refreshToken, Infinity);
              setCookie('accessToken', resData.extend.accessToken, Infinity);

              // localStorage.setItem("accessToken", resData.extend.accessToken)
              scope.$vux.loading.hide();
              scope.$vux.toast.text('登录成功,即将跳转...', 'middle');

              setTimeout(function () {
                scope.$router.replace("/Index");
              }, 1500)
            }
          } else if (res.data.resultCode == 0) {
            scope.$vux.toast.text(res.data.msg)
          } else {
            scope.$vux.toast.text(res.data.msg)
          }
          scope.$vux.loading.hide()
        }, (error) => {
          scope.$vux.loading.hide()
        });
      }

    }
  }
</script>
<style lang="scss" scoped>
  .myContainer {
    width:100%;
    height:100%;
    background: url("../../assets/images/login_bg.jpg");
    background-size:cover;
    padding-bottom: 30px;
    .flex-photo {
      text-align: center;
      .avatar {
        width:150px;
        display: block;
        margin: 0 auto;
      }
    }
    /*登录框的内容开始*/
    .loginInput {
      font-size: 14px;
    }
    .longin-boder{
      width: 75%;
      height: 40px;
      margin: 20px auto;
      line-height: 40px;
      text-align: center;
      border-bottom: 1px solid #BDBFD1;
      .image{
        width: 10%;
        margin-top: 2px;
        float: left;
        text-align: right;
        img{
          width:15px;
        }
      }
      .input{
        width: 80%;
        float: left;
        margin-left: 5%;
        height: 37px;
        line-height: 37px;
        border:0px;
        color: #ffffff;
        font-size: 16px;
        background: transparent;
        font-family: '微软雅黑 Regular';
        outline: none;
      }
      .input:focus{
        border:none;
      }
      .input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
        /* WebKit browsers */
        color: #fff;
        font-family: '微软雅黑 Regular';
      }
      .input:-moz-placeholder, textarea:-moz-placeholder {
        /* Mozilla Firefox 4 to 18 */
        color: #fff;
        font-family: '微软雅黑 Regular';
      }
      .input::-moz-placeholder, textarea::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        color: #fff;
        font-family: '微软雅黑 Regular';
      }
      .input:-ms-input-placeholder, textarea:-ms-input-placeholder {
        /* Internet Explorer 10+ */
        color: #fff;
        font-family: '微软雅黑 Regular';
      }
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
      border-radius: 50px;
      background: #ffffff;

    }

    .button:active {
      background-color:#BDBFD1;
    }
    /*登录框的内容结束*/

  }

</style>


