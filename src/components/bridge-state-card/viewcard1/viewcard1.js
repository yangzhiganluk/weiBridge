import api  from '@/api'
export default {
    props: {
        bridgeInfo: {
            type: Object,
            default: undefined,
            required: true
        },
        struc: {
            type: Object,
            default: undefined,
            required: true
        }
    },
    data() {
        return {
            timer: null,  //定义空的变量
            scoreInfo: '--', //桥梁总体得分
            weightInfo: [], //评估列表
            viewcardDataFlag: false,    //没有匹配视图数据
        }
    },
    mounted() {
        this.getScoreByTime('minute')
        this.setTimer();
    },
    methods: {
        /**
         * @description 获取评估类型时间范围内的得分
         */
        getScoreByTime(type) {
            let scope = this;
            scope.$http.get(`${api.acquisition_url}/viewCardRel/v2/scope/getScoreByWeightSet`, {
                params: {
                    scode: scope.bridgeInfo.code,
                    type
                }
            }).then(res=> {
                let resData = res.data;
                if(resData.resultCode == 1) {
                    // 数据匹配
                    scope.viewcardDataFlag = true;
                    let data = resData.data;
                    data.forEach((el, i) => {
                        if(el.weight_name == '桥梁总体') {
                            this.getScoreByWeightType(el.weight_code)
                        }
                    })
                } else {
                    scope.$vux.toast.text(resData.msg);
                }
            })
        },
        /**
         * @description 获取评估类型当前得分
         */
        getScoreByWeightType(code) {
            let scope = this;
            scope.weightInfo = []
            scope.$http.get(`${api.acquisition_url}/weight/scope/getScoreByWeightSet`, {
                params: {
                    scode: scope.bridgeInfo.code,
                    code, 
                }
            }).then(res=> {
                let resData = res.data;
                if(resData.resultCode == 1) {
                    let data = resData.data;
                    scope.scoreInfo = data.scoreInfo ? data.scoreInfo : '--';
                    if(data.weightInfo && data.weightInfo.length > 0) {
                        let weightInfo = data.weightInfo
                        weightInfo.forEach((el, i)=> {
                            weightInfo[i].name = el.name.substr(0, 2);
                            // 评估列表
                            scope.weightInfo.push(weightInfo[i])
                        })
                    }
                    
                } else {
                    scope.$vux.toast.text(resData.msg);
                }
            })
        },
         /**
         * @description 创建定时器
         */
        setTimer: function() {
            let scope = this;
            scope.timer = setInterval(() => {
                // do sth
                scope.getScoreByTime('minute')
            }, 1000 * 60 * 5)
        },
        /**
         * @description 清除定时器
         */
        clearTimer: function() {
            let scope = this;
            clearInterval(scope.timer);
            scope.timer = null;
        }
    },
    // 最后在beforeDestroy()生命周期内清除定时器：
    beforeDestroy() {
        clearInterval(this.timer);        
        this.timer = null;
    }
}