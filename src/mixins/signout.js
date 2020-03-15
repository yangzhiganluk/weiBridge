import api  from '@/api'
export default {
    data() {
        return {

        }
    },
    methods: {
      //退出登录
      signOut(){
        console.log('退出登录...')
        const scope = this;
        scope.$vux.confirm.show({
            title: "提示",
            content: "是否确定退出登录?",
            onCancel() {},
            onConfirm() {
                if(scope.localopenid){
                    scope.$http.get(api.management_url + '/user/unbindWeChatUser', {
                        params: {
                            openid: scope.localopenid
                        }
                    }).then((res) => {
                        let resData = res.data;
                        if (resData.resultCode == 1) {
                            scope.$vux.toast.text(resData.msg);
                            scope.$$clearAllCookie();
                            localStorage.clear();
                            scope.$router.push("/Oauth")
                        } else {
                            scope.$vux.toast.text(resData.msg);
                        }
                    }, (error) => {});
                }else {
                    scope.$vux.confirm.show({
                        title: "提示",
                        content: "没有检测到您的登录秘钥，如需更换账号，请重新登录后，再执行退出操作",
                        onCancel() {
                        },
                        onConfirm() {
                            scope.$router.push("/Oauth")
                        }
                    })
                }
            }
        })
      },
    }
}