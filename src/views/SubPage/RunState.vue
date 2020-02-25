<template>
    <div class="myContainer">
      <x-header :left-options="{backText: ''}" @click.native="goback">{{bridgeInfo.shortname}}</x-header>
      <panel header="运营管理状态"></panel>
      <flexbox>
        <flexbox-item><div class="flex-thead">日期</div></flexbox-item>
        <flexbox-item><div class="flex-thead">事件</div></flexbox-item>
      </flexbox>
      <flexbox>
        <flexbox-item><div class="flex-tbody"></div></flexbox-item>
        <flexbox-item><div class="flex-tbody"></div></flexbox-item>
      </flexbox>
    </div>
</template>
<script>
import {setCookie,getCookie,delCookie} from '../../assets/js/cookie.js'
var publicapi = require('../../assets/js/publicapi.js')
var api = publicapi.proxy.target
import {mapGetters} from 'vuex'
export default {
    data(){
        return{
          bridgeInfo:JSON.parse(localStorage.getItem("bridgeInfo"))
        }
    },
    computed:{
        // ...mapGetters(['username']),
        ...mapGetters(['count','moreBridgePageUrl']),
    },
     beforeCreate(){

    },
    created(){
      this.showNoData();
    },
    methods:{
      showNoData(){
        this.$vux.toast.text('没有数据');
      },
      /*点击返回*/
      goback(){
        this.$router.replace("/BridgeManage")
      },
    }
}
</script>
<style lang="scss" scoped>

    .myContainer{
      .flex-thead{
        text-align: center;
        height: 40px;
        line-height: 40px;
        font-weight: 600;
        font-size:14px;
      }
      .flex-tbody{
        height:25px;
        line-height: 25px;
        text-align: center;
        font-size:14px;
        color:#666;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .weui-panel{
        margin-top: 0px;
      }
    }

</style>


