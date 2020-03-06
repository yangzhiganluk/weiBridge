<template>
  <div class="myContainer">
    <!--显示间隔开始-->
    <div class="space_20"></div>
    <!--显示间隔结束-->

    <!--显示头像-->
    <flexbox style="margin-top: 50px">
      <flexbox-item>
        <div class="flex-photo">
          <!--    <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-picture avatar-uploader-icon"></i>
              </el-upload>-->
          <img  :src="login_url" class="avatar">
        </div>
      </flexbox-item>
    </flexbox>
    <!--显示头像-->

    <!--显示间隔开始-->
    <div class="space_20"></div>
    <!--显示间隔结束-->

   <!-- <div style="width:100%;font-size:18px;text-align: center">
      桥梁监测云平台
    </div>-->
    <!--显示间隔开始-->
    <div class="space_30"></div>
    <!--显示间隔结束-->
    <!--显示间隔开始-->
    <div class="space_20"></div>
    <!--显示间隔结束-->

    <!--登录部分开始-->
    <form action="#">
      <div class="loginInput">
        <!--<x-input :title="账号" placeholder="请输入账号" v-model="account" style="font-size:16px;"></x-input>-->
        <!--<x-input title="密码" placeholder="请输入密码" type="password" v-model="password" style="font-size:16px;"></x-input>-->
        <div class="longin-boder">
          <div class="image"><img :src="username_url"></div>
          <input class="input" type="text" placeholder="请输入用户名" v-model="account" />
        </div>
        <!--End用户名输入框-->
        <div class="longin-boder">
          <div class="image"><img :src="password_url"></div>
          <input class="input" type="password" placeholder="请输入密码" v-model="user_password"/>
        </div>
      </div>
    </form>



    <!--登录部分结束-->

    <!--显示间隔开始-->
    <div style="height:12vh"></div>
    <!--显示间隔结束-->

    <!--登录按钮-->
    <!--<x-button plain :gradients="['#1D62F0', '#19D5FD']" @click.native="checkLogin">登录</x-button>-->
    <div class="button" @click="checkLogin">登录</div>

    <div class="button" @click="goRegister">注册</div>
  </div>
</template>


<script>
import login from './login.js'
export default login
</script>
<style lang="scss" scoped>
  @import './login.scss'
</style>


