<template>
  <div class="myContainer">
    <x-header :left-options="{showBack: false}">桥梁健康监测云平台</x-header>
    <!-- 通用头部 -->
    <div class="top">
      <img src="~assets/images/scan.png" @click="scan()" class="scanStyle"/>

      <!--显示间隔开始-->
      <div class="space_30"></div>
      <!--显示间隔结束-->

      <!--显示头像-->
      <flexbox class="flexTop">
        <div>
          <img src="~assets/images/newlogo.png" class="avatar">
        </div>
        <div>
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
      <!--显示头像-->
    </div>

    <!--桥梁列表的内容开始-->
    <group title="桥梁列表">
        <div class="bridge-box"
          v-for="(item, index) in bridgeList"
          :key="index"
        >
        <cell-box 
          v-longpress="showToggleBrief(item)"
        >
          <div class="bridge-box-hd">
            <img :src="imgUrl + item.pcode" alt="">
          </div>
          <div class="bridge-box-bd">
            <div class="title">{{item.project_name}}</div>
            
            <grid :show-lr-borders="false" :show-vertical-dividers="false">
              <grid-item @on-item-click="toAlarm" v-if="item.alarmFlag">
                <img slot="icon" src="~assets/images/alarm.png">
                <!-- <span slot="label">告警</span> -->
              </grid-item>
              <grid-item @on-item-click="toFault" v-if="item.faultFlag">
                <img slot="icon" src="~assets/images/fault.png">
                <!-- <span slot="label">故障</span> -->
              </grid-item>
            </grid>
            <div class="icon-link"  @click.stop="toBridgeState(item)"></div>
          </div>
          
        </cell-box>
        <transition name="fade" mode="out-in" appear>
          <div 
            class="bridge-brief"
            v-show="item.code == briefId"
          >
            <flexbox>
              <flexbox-item><div>桥梁编码：<span>{{item.code}}</span></div></flexbox-item>
              <flexbox-item><div>桥梁编码：<span>{{item.tpye}}</span></div></flexbox-item>
            </flexbox>
            <flexbox>
              <flexbox-item><div>桥梁编码：<span>{{item.address}}</span></div></flexbox-item>
            </flexbox>
            <flexbox>
              <flexbox-item><div>经度：<span>{{item.lat}}</span></div></flexbox-item>
              <flexbox-item><div>纬度：<span>{{item.lng}}</span></div></flexbox-item>
            </flexbox>
          </div>
        </transition>
      </div>
    </group>
      
    <!--桥梁列表的内容结束-->

  </div>
</template>
<script>
  import index from './index.js'
  export default index
</script>
<style lang="scss" scoped>
 @import './index.scss'
</style>




