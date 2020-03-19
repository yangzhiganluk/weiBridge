<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
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
