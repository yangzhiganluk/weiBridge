<template>
  <div class="myContainer">

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

      }
    },
    computed: {
      // ...mapGetters(['username']),
      ...mapGetters(['count', 'moreBridgePageUrl','imgUrl']),
    },
    beforeCreate() {
    },
    created() {
    },
    methods: {

    }
  }
</script>
<style lang="scss" scoped>

  .myContainer {
    /*告警内容样式结束*/

  }
</style>


