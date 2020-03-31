<template>
  <div class="myContainer">
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
                  <p></p>
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
        <div class="common-box"
          v-for="(item, index) in bridgeList"
          :key="index"
        >
        <collapse-item :item="item"></collapse-item>
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




