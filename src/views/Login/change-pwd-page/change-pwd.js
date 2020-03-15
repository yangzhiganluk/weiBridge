import api  from '@/api'
export default {
    data() {
        let accessToken = this.$$getCookie("accessToken") || '';
        let loginInfo = localStorage.getItem("loginInfo") ? JSON.parse(localStorage.getItem("loginInfo")) : "";
        let userName = loginInfo ? loginInfo.username : ''
        return {
            oldpwd: '',
            newpwd: '',
            renewpwd: '',
            phone: '',
            authcode: '',
            authcodeText: '获取验证码', //获取验证码按钮文字
            authcodeTime: 60,   //获取验证码倒计时
            authcodeDisabled: true, //获取验证码按钮是否禁用
            codeFlag: false, //判断验证码是否正确
            accessToken: accessToken,
            userName: userName,
            newpwdValid: function(value) {
                let reg = /(?!^\d+$)(?!^[A-Za-z]+$)(?!^[^A-Za-z0-9]+$)(?!^.*[\u4E00-\u9FA5].*$)^\S{6,20}$/;
                return {
                    valid: reg.test(value),
                    msg: '密码必须由6-20个英文字母，数字或符号（除空格），且字母、数字和标点符号至少包含两种'
                }
            },
            authcodeValid: function(value) {
                let reg = /^\d{6}$/
                return {
                    valid: reg.test(value),
                    msg: "请输入6位验证码（仅数字有效）"
                }
            },
        }
    },
    methods: {
        /**
        * @description 输入框失去焦点验证
        */
       handleChange(value) {
        if(this.$refs.telRef.valid == true && this.phone != ''){
            this.judgeTelExist()
        }else{
            this.authcodeDisabled = true;
        }
       },
       
       /**判断手机号是否存在 */
       /**
        * @description 获取验证码
        */
       judgeTelExist() {
        const scope = this
        let useraparam = scope.phone.replace(/\s+/g,"")
        scope.$http.get(`${api.management_url}/user/validateUserInfoIsTrue`, {
            params: {
                useraparam
            }
        }).then(res => {
            let resData = res.data
            if(resData.resultCode == 1) {
                this.authcodeDisabled = false;
            } else {
                scope.$vux.toast.text(resData.msg)
            }
        })
       },
       /**
        * @description 获取验证码
        */
       getAuthcode() {
        const scope = this;
        let phoneNumber = scope.phone.replace(/\s+/g,"");
        scope.$http.get(`${api.management_url}/user/getFindPasswordAuthcodeByMsg`, {
            params: {
              phoneNumber,
            }
        }).then((res) => {
            let resData = res.data
            if(resData.resultCode == 1) {
                scope.codeFlag = true
                scope.resetAuthcodeTime()
            } else {
                scope.codeFlag = false
                scope.$vux.toast.text(resData.msg)
            }
        })
       },
       /**
        * @description 倒计时
        */
       resetAuthcodeTime() {
            const scope = this;
            scope.authcodeDisabled = true;
            scope.authcodeText = `${scope.authcodeTime}s`
            let timer = setInterval(function() {
                scope.authcodeTime--
                if(scope.authcodeTime > 0) {
                    scope.authcodeText = `${scope.authcodeTime}s`
                } else {
                    clearInterval(timer);
                    scope.authcodeDisabled = false;
                    scope.authcodeTime = 60
                    scope.authcodeText = `重新获取验证码`
                }
            }, 1000)
       },
       checkChange() {
        for(let x in this.$refs) {
            if (this.$refs[x].validate) {
                // validate函数校验当前是否有值，是否为必填，如果当前值的校验方式是函数，将校验结果赋值给valid。
                this.$refs[x].validate();
                let valid = this.$refs[x].valid;
                if (!valid) {
                    this.$refs[x].focus();
                    this.$refs[x].blur();
                    return
                }
            }
        }
        this.toChangePwd()
       },
       /**修改密码 */
       toChangePwd() {
        const scope = this
        if(!scope.codeFlag) {
            scope.$vux.toast.text('验证码输入错误')
            return
        }
        scope.$http.get(`${api.management_url}/user/modifyAccountPassword`, {
            headers: {
                accessToken: scope.accessToken,
            },
            params: {
                userName: scope.userName,
                oldPassword: scope.oldpwd,
                newPassword: scope.newpwd
            }
        }).then(res=> {
            let resData = res.data;
            if(resData.resultCode == 1) {
                scope.$$clearAllCookie();
                localStorage.clear();
                scope.$vux.toast.text(resData.msg)
                scope.$router.push('/Oauth')
            } else {
                scope.$vux.toast.text(resData.msg)
            }
        })
       }
    }
}