<template>
  <div id="app">
    <div :style="tabbarFlag ? 'paddingBottom: 55px;' : 'height: 100%;'">
      <router-view></router-view>
    </div>
    <tabbar v-if="tabbarFlag" v-bind:class="{ 'nav-hide': hideClass }">
        <tabbar-item link="/Index">
            <span slot="label">桥梁列表</span>
        </tabbar-item>
        <tabbar-item link="/BridgeState">
            <span slot="label">桥梁状态</span>
        </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      bridgeInfo: localStorage.getItem("bridgeInfo")?JSON.parse(localStorage.getItem("bridgeInfo")):[],
       // 默认屏幕高度
      docmHeight: document.documentElement.clientHeight,  //一开始的屏幕高度
      showHeight: document.documentElement.clientHeight,   //一开始的屏幕高度
      hideClass: false, //显示或者隐藏tabbar
      isResize:false, //默认屏幕高度是否已获取
    }
  },
  computed: {
      tabbarFlag: function() {
        return this.bridgeInfo && 
        (this.$route.path!='/' && 
          this.$route.path!='/Index' && 
          this.$route.path!='/BridgeState' && 
          this.$route.path!='/Oauth' && 
          this.$route.path!='/LoginNoAuth' &&
          this.$route.path!='/Register' &&
          this.$route.path!='/ChangePwd'
        )
      }
  },
  watch:{
    showHeight: 'inputType'  
  },
  mounted() {
     // window.onresize监听页面高度的变化
    window.onresize = () => {
      return (() => {
          window.screenHeight = document.body.clientHeight;
          this.showHeight = window.screenHeight;
      })()
    }
  },
  methods: {
     // 检测屏幕高度变化
     inputType() {
        if (!this.timer) {
           this.timer = true
           let that = this
           setTimeout(() => {
              if (that.docmHeight > that.showHeight) {
              //显示class
                 this.hideClass = true;
              } else if (that.docmHeight <= that.showHeight) {
               //显示隐藏
                 this.hideClass = false;
              }
              that.timer = false;
           }, 20)
        }
     },
  },
}
  
</script>


<style lang="less">
  @import '~vux/src/styles/reset.less';
  @import '~vux/src/styles/1px.less';
  @import '~vux/src/styles/tap.less';

  body {
    background-color: #ffffff;
  }
  html, body {
    width: 100%;
    height:100%;
    background: #F4F4FA;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
<style lang="scss">

.nav-hide {
  position: static!important;
}
</style>
