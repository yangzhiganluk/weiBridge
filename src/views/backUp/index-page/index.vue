<template>
  <div class="myContainer">
    <x-header :left-options="{showBack: false}">桥梁健康监测云平台</x-header>
    <div class="top">
      <img src="~assets/images/scan.png" @click="scan()" class="scanStyle"/>

      <!--显示间隔开始-->
      <div class="space_30"></div>
      <!--显示间隔结束-->

      <!--显示头像-->
      <flexbox class="flexTop">
        <div>
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
        </div>
        <div>
          <!-- <div class="topInfo" @click="signOut">
            <p>{{loginInfo.company}}</p>
            <span >{{loginInfo.nickname}}</span>
          </div> -->
          <Dropdown trigger="click">
              <a href="javascript:void(0)" >
                <div class="topInfo">
                  <p>{{loginInfo.company}}</p>
                  <span >{{loginInfo.nickname}}</span>
                  <Icon type="ios-arrow-down"></Icon>
                </div>
              </a>
              <DropdownMenu slot="list">
                  <DropdownItem>
                    <router-link to="/ChangePwd">修改密码</router-link>
                  </DropdownItem>
                  <DropdownItem @click.native="signOut">退出登录</DropdownItem>
              </DropdownMenu>
          </Dropdown>
        </div>
      </flexbox>
      
      <flexbox>
        <flexbox-item style="text-align: center;padding-top: 10px;border:none"></flexbox-item>
      </flexbox>
      <!--显示头像-->


      <!--显示tab切换开始-->
      <flexbox class="indexTab">
        <flexbox-item @click.native="selectTab('bridge')" :span="1/3"><span><img :src="iconBridge"/></span><span style="color:#6DDDD1">桥梁</span></flexbox-item>
        <flexbox-item @click.native="selectTab('alarm')" :span="1/3"><span><img :src="iconAlarm"/><!--<i>{{alarmCount}}</i>--></span><span>告警</span></flexbox-item>
        <flexbox-item @click.native="selectTab('statistics')" :span="1/3"><span><img :src="iconDeal"/></span><span>统计</span></flexbox-item>
      </flexbox>
      <!--显示tab切换结束-->
    </div>


    <!--桥梁列表的内容开始-->
    <div class="bridgeList" :class="{active: showPannel == 'bridgeList',setdisplay:showPannel=='alarm'}"  >


      <!--<div id="allmap" ref="allmap" style="height:100%"></div>-->


      <panel header="桥梁列表" :list="bridgeList" :type="type" @on-click-item="onClickItem" class="panelList"></panel>

    </div>
    <!--桥梁列表的内容结束-->


  </div>
</template>
<script>
  import index from './index.js'
  export default index
</script>
<style lang="scss">
  .panelList{
    margin: 20px 0;
    .weui-media-box__title{
      font-size:14px;
      color: #343F65;
    }
    .weui-media-box_appmsg .weui-media-box__thumb{
      vertical-align: middle;
    }
  }
</style>
<style lang="scss" scoped>
 @import './index.scss'
</style>




