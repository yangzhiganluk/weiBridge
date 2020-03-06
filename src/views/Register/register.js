import publicapi from '../../assets/js/publicapi.js'
let management_url = publicapi.proxy.management_url;
export default {
    props: {

    },
    data() {
        return {
            username: '',
            password: '',
            level: 0, //定义一个变量用于存放密码强度
            repwd: '',
            phone: '',
            authcode: '',
            authcodeText: '获取验证码',
            authcodeTime: 60,
            isLoading: false,
            isagree: false,
            authcodeDisabled: true,
            usernameValid: function(value) {
                // 以[a-z,A-Z,_,0-9]中的其中一个字符开始，中间可以有任意个[a-z,A-Z,_,0-9]字符，最后再以[a-z,A-Z,_,0-9]中的一个字符结束
                let reg = /^\w+$/; 
                return {
                    valid: reg.test(value), 
                    msg: '用户名必须由6-20位英文字母、数字、下划线组成'
                }
            },
            passwordValid: function(value) {
                let reg = /(?!^\d+$)(?!^[A-Za-z]+$)(?!^[^A-Za-z0-9]+$)(?!^.*[\u4E00-\u9FA5].*$)^\S{6,20}$/;
                return {
                    valid: reg.test(value),
                    msg: '密码必须由6-20个英文字母，数字或符号（除空格），且字母、数字和标点符号至少包含两种'
                }
            },
            phoneValid: function(value) {
                let reg = /^[1][1,2,3,4,5,6,7,8,9,0][0-9]{9}$/;
                return {
                    valid: reg.test(value),
                    msg: "请输入11位手机号（仅数字有效）"
                }
            },
            authcodeValid: function(value) {
                let reg = /^\d{6}$/
                return {
                    valid: reg.test(value),
                    msg: "请输入6位验证码（仅数字有效）"
                }
            },
        };
    },
    computed: {

    },
    created() {
        
    },
    mounted() {

    },
    watch: {
        
    },
    methods: {
       
       /**
        * @description 验证密码强中弱（废弃）
        */
       checkStrong(pwd) {
            let regs = [] //定义一个数组用于存放不同的正则表达式
            regs[0] =  /[a-z]/g //小写
            regs[1] =  /[A-Z]/g //大写  
            regs[2] =  /[0-9]/g //数字
            regs[3]  = /(?=[\x21-\x7e]+)[^A-Za-z0-9]/g // 特殊符号
            if(psw.length>=6) {//用于判断用户输入的密码强度, 至少六个字符
                this.level = 0
                for (var i = 0; i < 4; i++) {//遍历所有正则表达式，检测用户输入的密码符合哪些正则表达式，如果符合则强度+1
                    if(regs[i].test(pwd)){
                        this.level++
                    }
                }
            }
            else {
                this.level = 0
            }
            //逻辑处理
            switch(level) {
                case 1:
                    return 1;
                    break;
                case 2:
                    return 2;
                    break;
                case 3:
                case 4:
                    return psw.length < 10 ? 3 : 4
                    break;
            }
            return level;
       },
       
       /**
        * @description 输入框失去焦点验证
        */
       handleChange(value) {
        if(this.$refs.telRef.valid == true && this.phone != ''){
            this.authcodeDisabled = false;
        }else{
            this.authcodeDisabled = true;
        }
       },
       /**
        * @description 获取验证码
        */
       getAuthcode() {
        let scope = this
        let phoneNumber = scope.phone.replace(/\s+/g,"")
        scope.$http.get(`${management_url}/user/getRegisterAuthcodeByMsg`, {
            params: {
                phoneNumber
            }
        }).then(res => {
            let resData = res.data
            if(resData.resultCode == 1) {
                scope.resetAuthcodeTime()
            } else {
                scope.$vux.toast.text(res.msg)
            }
        })
       },
       /**
        * @description 倒计时
        */
       resetAuthcodeTime() {
            let scope = this;
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
       checkSignup() {
        //    console.log(this.$refs)
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
        if(!this.$refs.isagreeRef.value) {
            this.$vux.toast.text('请同意协议')
            return
        }
        this.goSignUp()
       },
       /**
        * @description 注册协议
        */
       goSignUp() {
        let scope = this
        let params = new FormData();
        params.append('username', scope.username);
        params.append('nickname', scope.username);
        params.append('password', scope.password);
        params.append('phone', scope.phone.replace(/\s+/g,""));
        params.append('authcode', scope.authcode);
        scope.$http.post(`${management_url}/user/registerAccountByPhone`
            , params, {
        }).then(res => {
            // console.log(res.data)
            let resData = res.data;
            if(resData.code == 1) {
                scope.$vux.toast.text('注册成功')
                scope.$router.push('/Oauth')
            } else {
                scope.$vux.toast.text(resData.msg)
            }
        })
       },
    },
    components: {

    },
};