<template>
  <div id="app">
    <div style="padding-bottom: 55px;">
      <router-view></router-view>
    </div>
    <tabbar v-if="tabbarFlag">
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
          this.$route.path!='/Register')
      }
    }
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

</style>
