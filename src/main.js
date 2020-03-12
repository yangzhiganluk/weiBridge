// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
//这里是elementUI引入
import 'normalize.css/normalize.css'
//样式重置
import 'font-awesome/css/font-awesome.css'

//字体引入
import $ from 'jquery'
import echarts from 'echarts'
import '../theme/index.css'
import axios from 'axios'
//vuex
import store from './store/index.js'
import { Flexbox, FlexboxItem ,Cell, Group ,ButtonTab, ButtonTabItem, Divider,Tab, TabItem,
  XInput, XButton, Panel, ToastPlugin, LoadingPlugin, XTextarea, ConfirmPlugin, CellBox,
  VChart, VLine, VArea, VBar, VPie, VPoint, VScale, VAxis, VGuide, VTooltip, VLegend,Selector,
  Checker, CheckerItem, Datetime, XHeader, PopupPicker, AlertPlugin, Scroller,LoadMore,Loading,
  CheckIcon, Grid, GridItem
} from 'vux'



//引入iview
import ViewUI from 'view-design';
// import style
import 'view-design/dist/styles/iview.css';
Vue.use(ViewUI);


let management_url='http://www.qiaohaoba.net/platform_management';
import {setCookie, getCookie, delCookie,clearAllCookie} from './assets/js/cookie.js'
Vue.prototype.$getCookie = getCookie;
Vue.prototype.$setCookie = setCookie;
Vue.prototype.$delCookie = delCookie;

Vue.prototype.$http = axios;
Vue.config.productionTip = false
Vue.use(ElementUI);
/* eslint-disable no-new */

/*引入vux的组件，按需加载*/
Vue.component('flexbox', Flexbox)
Vue.component('flexbox-item', FlexboxItem)
Vue.component('cell', Cell)
Vue.component('cell-box', CellBox)
Vue.component('group', Group)
Vue.component('button-tab', ButtonTab)
Vue.component('button-tab-item', ButtonTabItem)
Vue.component('tab', Tab)
Vue.component('tab-item', TabItem)
Vue.component('divider', Divider)
Vue.component('x-input', XInput)
Vue.component('x-button', XButton)
Vue.component('panel', Panel)
Vue.use(ToastPlugin, {position: 'middle'})
Vue.use(LoadingPlugin)
Vue.component('x-textarea', XTextarea)
Vue.use(ConfirmPlugin)
Vue.component('v-chart', VChart)
Vue.component('v-line', VLine)
Vue.component('v-area', VArea)
Vue.component('v-bar', VBar)
Vue.component('v-pie', VPie)
Vue.component('v-point', VPoint)
Vue.component('v-scale', VScale)
Vue.component('v-axis', VAxis)
Vue.component('v-guide', VGuide)
Vue.component('v-tooltip', VTooltip)
Vue.component('v-legend', VLegend)
Vue.component('checker', Checker)
Vue.component('checker-item', CheckerItem)
Vue.component('datetime', Datetime)
Vue.component('x-header', XHeader)
Vue.component('PopupPicker', PopupPicker)
Vue.component('selector', Selector)
Vue.component('scroller', Scroller)
Vue.component('load-more', LoadMore)
Vue.component('loading', Loading)
Vue.use(AlertPlugin)
Vue.component('datetime', Datetime)
Vue.component('check-icon', CheckIcon)
Vue.component('grid', Grid)
Vue.component('grid-item', GridItem)


//给它设置一个timeout = 8000
axios.defaults.timeout =  8000;

/****************** axios拦截器设置请参考这部分(开始)******************/
axios.interceptors.request.use(
  function(config) {
    /*判断当前是否在登录页。在登录页的时候，肯定是取不到accessToken的，需要排除*/
    if(router.match(location).hash!='#/' && 
      router.match(location).hash!='#/Oauth' && 
      router.match(location).hash!='#/LoginNoAuth' &&
      router.match(location).hash!='#/Register'
    ) {
      let accessToken = getCookie('accessToken');
      let refreshToken = getCookie('refreshToken');
      let loginInfo = localStorage.getItem("loginInfo")?JSON.parse(localStorage.getItem("loginInfo")):"";
      if (accessToken&&loginInfo) {  // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
        config.headers.accessToken  = accessToken;
      }else if(refreshToken&&loginInfo&&loginInfo!=""){
        var scope=this;
        /**
         * @description 刷新请求接口accessToken
         */
        Vue.prototype.$http.get(management_url+'/user/signInByRefresh ', {
          headers: {
            accessToken: scope.accessToken
          },
          params:{
            refreshToken: refreshToken
          }
        }).then((res) => {
          var resData = res.data;
          if (res.data.resultCode == 1) {
            /*判断是否有结构物，是否存在多桥和单桥*/
            if (resData.data) {
              delCookie("accessToken");
              delCookie("refreshToken");
              clearAllCookie();

              setCookie("accessToken",resData.data.accessToken,Infinity);
              setCookie("refreshToken",resData.data.refreshToken,Infinity);

              scope.$vux.loading.hide();
              // scope.$vux.toast.text('登录成功,即将跳转...', 'middle');

              scope.$router.go(0);
           /*   setTimeout(function () {
                 scope.$router.replace("/Index");
                scope.$router.go(0);
              }, 1500)*/
            }
          } else if (res.data.resultCode == 0) {
            // scope.$vux.toast.text(res.data.msg)
          } else {
            // scope.$vux.toast.text(res.data.msg)
          }
          scope.$vux.loading.hide()
        }, (error) => {
          scope.$vux.loading.hide()
        });
      }else{
        router.push("/Oauth");
      }
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });

// http response 服务器响应拦截器,并重新跳入登页重新获取token
axios.interceptors.response.use(
  response => {
    if(response.data.resultCode=='-2'&&(response.data.msg=="该账号已过期或被其他设备登陆，请重新登陆"||response.data.msg=="accessToken不能为空")){
       // window.location.href='http://www.qiaohaoba.net/#/'
      delCookie("accessToken");
      delCookie("refreshToken");
      clearAllCookie();
      localStorage.clear();
      router.push("/Oauth");
    }

    return response;


  },
  error => {
    if (error.response) {
    }

    return Promise.reject(error.response.data)
  });

/**
 * 点击延迟
 */
const FastClick = require('fastclick')
FastClick.attach(document.body)

/**
 * 全局变量或全局方法
 */
import custom from './utils/custom'
Vue.use({
  install(Vue, options) {
    for(let key in custom) {
      Vue.prototype['$$' + key] = custom[key]
    }
  }
})

//自定义长按指令引入
import longpress  from'@/utils/longpress.js'
Vue.use(longpress)

/**
 * 微信 jssdk
 */
import { WechatPlugin } from 'vux'
Vue.use(WechatPlugin)

console.log(Vue.wechat) // 可以直接访问 wx 对象。

new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
