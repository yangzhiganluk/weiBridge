import api  from '@/api'
import setTimer from '@/mixins/setTimer';
export default {
    mixins: [setTimer],
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
            scoreInfo: '--', //桥梁总体得分
            weightInfo: [], //评估列表
            viewcardDataFlag: false,    //没有匹配视图数据
        }
    },
    mounted() {
        this.initViewCard()
    },
    methods: {
        /**
         * 
         * @description 初始化
         */
        initViewCard() {
            this.getAllAccessType()
        },
        /**
         * @description 获取所有的评估类型
         */
        getAllAccessType() {
            const scope = this;
            scope.$http.get(`${api.acquisition_url}/weight/getAllWeightSet`, {
                params: {
                    scode: scope.bridgeInfo.code,
                }
            }).then(res=> {
                let resData = res.data;
                if(resData.resultCode == 1) {
                    if(resData.data && resData.data.length > 1) {
                        let data = resData.data;
                        data.forEach((el, i) => {
                            if(el.name == '桥梁总体') {
                                this.getPresentScoreByAccessType(el.code)
                            }
                        })
                    }
                } else {
                    scope.$vux.toast.text(resData.msg);
                }
            })
        },
        /**
         * @description 获取评估类型当前得分
         */
        getPresentScoreByAccessType(code) {
            const scope = this;
            scope.weightInfo = []
            scope.$http.get(`${api.acquisition_url}/weight/scope/getScoreByWeightSet`, {
                params: {
                    scode: scope.bridgeInfo.code,
                    code, 
                }
            }).then(res=> {
                let resData = res.data;
                if(resData.resultCode == 1) {
                    scope.viewcardDataFlag = true;
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
    },
}