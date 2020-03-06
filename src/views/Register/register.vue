<template>
    <div class="myContainer">
        <!-- 注册部分开始 -->
        <group class="register-box">
            <x-input 
                title="用户名" 
                :min="6" 
                :max="20" 
                v-model="username" 
                :is-type="usernameValid" 
                ref="usernameRef"
                placeholder="请输入用户名" 
                placeholder-align="right"
                required
            ></x-input>
            <x-input 
                title="设置密码" 
                :min="6" 
                :max="20" 
                type="password" 
                v-model="password" 
                :is-type="passwordValid" 
                ref="passwordRef"
                placeholder="请输入密码" 
                placeholder-align="right"
                required
            ></x-input>
            <x-input 
                title="确认密码" 
                :min="6" 
                :max="20" 
                type="password" 
                v-model="repwd" 
                :equal-with="password"
                ref="repwdRef"
                placeholder="请再次输入密码" 
                placeholder-align="right"
                required
            ></x-input>
            <x-input 
                title="手机号" 
                :max="13" 
                mask="999 9999 9999" 
                v-model="phone" 
                is-type="china-mobile" 
                @on-change="handleChange"
                ref="telRef"
                type="tel" 
                placeholder="请输入手机号" 
                placeholder-align="right"
                required
            ></x-input>
            <x-input 
                title="验证码" 
                class="weui-vcode" 
                :min="6"
                :max="6" 
                v-model="authcode" 
                :is-type="authcodeValid"
                ref="authcodeRef"
                required
            >
                <x-button 
                    slot="right" 
                    type="primary" 
                    mini
                    :disabled="authcodeDisabled"
                    @click.native="getAuthcode"
                >{{authcodeText}}</x-button>
            </x-input>
            <cell-box class="agree-input">
                <check-icon 
                    :value.sync="isagree"
                    ref="isagreeRef"
                >
                    请阅读并同意<router-link to="/UserAgreement">《桥好吧监测云平台注册协议》</router-link>
                </check-icon>
            </cell-box>
        </group>

        <!--显示间隔开始-->
        <div class="space_80" ></div>
        <!--显示间隔结束-->

        <!--注册按钮-->
        <x-button 
            :show-loading="isLoading"
            :gradients="['#1D62F0', '#19D5FD']"
            @click.native="checkSignup"
        >注册</x-button>
        <!-- 注册部分结束 -->
    </div>
</template>

<script>
    import register from './register.js';
    export default register; 
</script>

<style scoped lang="scss">
    @import './register.scss'
</style>

