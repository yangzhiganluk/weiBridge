import {setCookie, getCookie, delCookie} from '../../assets/js/cookie.js'
import $ from 'jquery'
var publicapi = require('../../assets/js/publicapi.js')
var management_url = publicapi.proxy.management_url;
import {mapGetters} from 'vuex'

export default {
  data() {
    return {
      login_url: require("assets/images/newlogo_word.png"),
      username_url: require("assets/images/icon_username.png"),
      password_url: require("assets/images/icon_password.png"),
      account: '',   //登录用户名
      user_password: '', //登录密码
      accessToken: getCookie("accessToken"),//鉴权码
      loginInfo: localStorage.getItem("loginInfo") ? JSON.parse(localStorage.getItem("loginInfo")) : "",
      openid: localStorage.getItem("openid") || '',//用户的openid
    }
  },
  computed: {
    ...mapGetters(['Appid', 'Secret']),
  },
  created() {
      this.judgeLogin();  //判断是否需要登录
  },
  mounted(){

  },
  methods: {
    /*授权规则，验证accesstoken和loginInfo*/
    judgeLogin(){
      if(this.accessToken && this.loginInfo && this.loginInfo!=""){
        this.$router.push("/Index")
      }else{
        this.getOpenId();
      }
    },
    //测试账号
    getOpenId() {
      console.log('开始获取参数')
      /*获取地址栏参数*/
      function GetQueryString(name) {
        let reg = new RegExp('(^|&)'+name+'=[^&](&|$)*');
        let r = window.location.search.substr(1).match(reg);
        if(r!=null) return decodeURIComponent(r[2])
      }
      let code = GetQueryString("code");
         this.$vux.loading.show({
            text: '正在拉取授权...'
          })
      if (code && code != "") {
       /**
        * @description 获取openid
        */
        this.$http.get(management_url+'/user/getOpenIdByCode', {
          params:{
            code: code,
            grant_type:'authorization_code'
          }
        }).then((res) => {
          var resData = res.data;
         if (resData.resultCode == 1) {
           if (resData.data.openid) {
               localStorage.setItem("openid", resData.data.openid);
               this.openid= resData.data.openid;
               this.loginSubmit(resData.data.openid);
           }else{
            //  var scope=this;
            //  scope.$vux.alert.show({
            //    title: '提示',
            //    content: "拉取授权失败，请退出重新进入！",
            //    onHide() {
            //      WeixinJSBridge.call('closeWindow');
            //      scope.$vux.alert.hide()
            //    }
            //  })
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
        this.$vux.loading.hide();
        // var scope=this;
        // scope.$vux.alert.show({
        //   title: '提示',
        //   content: "拉取授权失败，请退出重新进入！",
        //   onHide() {
        //     WeixinJSBridge.call('closeWindow');
        //     scope.$vux.alert.hide()
        //   }
        // })
      }
    },
    /*登录*/
    checkLogin() {
      if (this.account && this.user_password) {
        if (this.openid) {
          this.loginSubmit(this.openid);
        } else {
          this.$router.push("/Oauth")
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
        if (resData.resultCode == 1) {
          /*判断是否有结构物，是否存在多桥和单桥*/
          if (resData.data) {
            localStorage.setItem("loginInfo", JSON.stringify(resData.data));
            delCookie('accessToken');
            delCookie('refreshToken');

            setCookie('accessToken', resData.extend.accessToken, Infinity);
            setCookie('refreshToken', resData.extend.refreshToken, Infinity);
            scope.$vux.loading.hide();
            scope.$vux.toast.text('登录成功,即将跳转...', 'middle');
            setTimeout(function () {
              scope.$router.replace("/Index");
            }, 1500)
          }
        } else {
          scope.$vux.toast.text(resData.msg)
        }
        scope.$vux.loading.hide()
      }, (error) => {
        scope.$vux.loading.hide()
      });
    },

    /**注册 */
    goRegister() {
      this.$router.push('/Register')
    }
  }
}