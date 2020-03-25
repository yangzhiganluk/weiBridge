
import signout from '@/mixins/signout';
import collapseItem from './collapse-item'
import api  from '@/api'
export default {
  mixins: [signout],
  data() {
    let accessToken = this.$$getCookie("accessToken") || ''
    return {
      showPannel: 'bridge',//展示哪个tab内容
      bridgeList: [], //桥梁列表
      accessToken: accessToken,//鉴权码
      loginInfo: localStorage.getItem("loginInfo") ? JSON.parse(localStorage.getItem("loginInfo")) : "", //登录成功，存储在本地的信息
      currentPage: 1,//页码
      visible: false,
    }
  },
  
  created() {
    this.judgeLogin();  //获取登录状态
    sessionStorage.removeItem("scanData");
  },
  mounted() {
    this.loadSign();
  },
  methods: {
    /*验证登录*/
    judgeLogin(){
      if(this.accessToken && this.loginInfo && this.loginInfo!=""){
        /*加载桥梁列表*/
        this.getList();
        if(this.loginInfo.type ==3) {
          this.getPermissionById();
        }
      }else{
        this.$router.push("Oauth")
      }
    },

    /*=============桥梁列表组件开始============*/
    /*获取监测物列表*/
    getList() {
      this.$vux.loading.show({
        text: '正在加载...'
      })
      this.$http.get(`${api.acquisition_url}/structure/structureList`, {
        params: {
          userId: this.loginInfo.id
        }
      }).then((res) => {
        let resData = res.data;
        if (resData.resultCode == 1) {
          if (resData.data && resData.data.length > 0) {
            localStorage.setItem("bridgeList",JSON.stringify(resData.data))
            this.bridgeList = resData.data;
          }
        } else {
          this.$vux.toast.text(resData.msg);
        }
        this.$vux.loading.hide()
      }, (error) => {
        this.$vux.loading.hide()
      });
    },

     /**
     * @description 控制longpress子组件显隐变量
     */
    cut(childId) {
      this.$children.forEach(el=> {
        el.$children.forEach(child=> {
          if(child._uid != childId) {
            child.show = false;
          }
        })
      })
    },
    /**
     * @description 判断账号权限
     */
    getPermissionById() {
      const scope = this;
      scope.$http.get(`${api.management_url}/sub/findSubaccountById`, {
        params: {
          id: scope.loginInfo.id,
        }
      }).then(res=> {
        let resData = res.data;
        if(resData.resultCode == 1) {
          let data = resData.data
          if(data.structures && data.structures.length > 0) {
            let structures = data.structures;
            localStorage.setItem("structures", JSON.stringify(structures));
          }
        } else {
          scope.$vux.toast.text(resData.msg);
        }
      })
      
    },
    /*================桥梁列表组件结束=============*/
    //获取扫一扫的签名
    loadSign() {
      const scope = this;

      this.$http.get(`${api.management_url}/user/getSignByJsApiTicket`, {
        params: {
          noncestr: '7x5P8sI4DuKdODVv',
          timestamp: 1551691785,
          // url: 'http://www.qiaohaoba.net/mobileMonitor/',
          url: (window.location.href).split('#')[0],
        }
      }).then((res) => {
        var resData = res.data;
        if (resData.resultCode == 1) {
          if (resData.data) {
            wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              //                                debug : true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              // appId : data.appId, // 必填，公众号的唯一标识
              // timestamp : data.timestamp, // 必填，生成签名的时间戳
              // nonceStr : data.noncestr, // 必填，生成签名的随机串
              // signature : data.signature,// 必填，签名，见附录1
              appId: 'wx96143db2d3a1a789', // 必填，公众号的唯一标识
              timestamp: 1551691785, // 必填，生成签名的时间戳
              nonceStr: '7x5P8sI4DuKdODVv', // 必填，生成签名的随机串
              // signature : JSON.parse(data).data,// 必填，签名，见附录1
              signature: resData.data.sign,// 必填，签名，见附录1
              jsApiList: ['checkJsApi', 'scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });

          }

        } else if (resData.resultCode == 0) {
          scope.$vux.toast.text(resData.msg);
        } else {
          scope.$vux.toast.text(resData.msg);
        }

      }, (error) => {

      });
    },
    //扫一扫
    scan(){
      const scope = this;
      if(!scope.bridgeList || scope.bridgeList.length==0){
        scope.$vux.alert.show({
          title: '提示',
          content: '请先创建监测物',
          onShow() {
          },
          onHide() {
          }
        })
        return;
      }
      wx.error(function (res) {
        if (res.errMsg && res.errMsg == 'config:invalid signature') {
          scope.$vux.alert.show({
            title: '提示',
            content: '获取签名失败，请关闭后再试',
            onShow() {

            },
            onHide() {
              WeixinJSBridge.call('closeWindow')
            }
          })
        }
      });
      wx.ready(function() {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            sessionStorage.setItem("scanData",result);
            if(scope.loginInfo.type=='3'){
              scope.$http.get(management_url + '/sub/findSubaccountById', {
                headers:{
                  accessToken: this.accessToken
                },
                params: {
                  id:scope.loginInfo.id,
                }
              }).then((subres) => {
                if (subres.data.resultCode == 1) {
                  /*判断是否有结构物，是否存在多桥和单桥*/
                  if (subres.data.data) {
                    if (subres.data.data.structures && subres.data.data.structures.length > 0) {
                      let structures=subres.data.data.structures;
                      for(let i=0;i<structures.length;i++){
                        if(structures[i].code==JSON.parse(result).structureCode){
                          let role=structures[i].role;
                          if(role.indexOf("manage")!=-1){
                            scope.$router.push("/SensorEdit");
                          }else{
                            scope.$router.push("/SensorReadonly");
                          }
                          return;
                        }
                      }
                    }
                  }
                } else if (subres.data.resultCode == 0) {
                  scope.$vux.toast.text(subres.data.data.msg);
                } else {
                  scope.$vux.toast.text(subres.data.data.msg);
                }
              }, (error) => {

              });
            }else{
              for(let i=0;i<scope.bridgeList.length;i++){
                if(scope.bridgeList[i].code==JSON.parse(result).structureCode){
                  localStorage.setItem("bridgeInfo", JSON.stringify(scope.bridgeList[i]));
                  scope.$router.push("/SensorEdit");
                }
              }

            }

          }
        });
      });
    },
    
  },
  components: {
    collapseItem
  }
}