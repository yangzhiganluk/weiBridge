import switchTab from '@/components/switch-tab'
import api from '@/api'
import _ from 'lodash'

export default {
    data() {
        return {
            bridgeInfo: localStorage.getItem("bridgeInfo") ? JSON.parse(localStorage.getItem("bridgeInfo")) : [],
            handleFlag: null,   //筛选已处理
            pageSize: 4,
            totalcount: 0,  //返回总数
            lastId: '', //当前页最后一条数据id
            loglist: [],
            isLoading: false,   //是否正在加载
            loadingText: '正在加载'
        };
    },
    filters: {
        number: function(num){
            if(typeof(num)=='undefined'){
                return num
            }else{
                return Number(parseFloat(num).toFixed(3))
            }
        }
    },
    created() {
        this.params = {
            structureCode: this.bridgeInfo.code,
            pageSize: this.pageSize,
        }
    },
    mounted() {
        this.setAlarmLogParams(this.lastId)
    },
    methods: {
        /**
         * @description 显示已处理
         */
        handleSwitch() {
            this.params = {
                structureCode: this.bridgeInfo.code,
                pageSize: this.pageSize,
                handleFlag: this.handleFlag
            };
            if(this.handleFlag) {
                this.lastId = ''
                this.isLoading = false
                this.setAlarmLogParams('')
            } else {
                this.loglist = [];
                this.setAlarmLogParams(this.lastId)
            }
            
        },
        /**
         * @description 上拉加载
         */
        handlePullUp() {
            const scope = this
            console.log('....', scope.lastId)
            scope.isLoading = true
            scope.loadingText = '加载更多'
            scope.setAlarmLogParams(scope.lastId)
        },
        /**
         * @description 下拉刷新
         */
        handlePullDown() {
            const scope = this
            scope.isLoading = false
            scope.lastId = ''
            scope.setAlarmLogParams('')
        },
        /**
         * @description 获取地址栏参数生成参数对象
         */
        setAlarmLogParams(lastId) {
            console.log('此时handleFlag：', this.handleFlag, '而loadingText', this.loadingText)
            let tempObj = {}
            tempObj = _.merge({}, this.params, {
            }, lastId ? { lastId } : {})
            this.getAlarmList(tempObj)
        },
        /**
         * @description 获取告警信息
         */
        getAlarmList(params) {
            const scope = this;
            this.$http.get(`${api.acquisition_url}/eqp/log/alarm`, {
                params
            }).then(res=> {
                let resData = res.data;
                if(resData.resultCode == 1) {
                    scope.totalcount = resData.count
                    if(resData.data && resData.data.length > 0) {
                        if(!this.lastId) {
                            scope.loglist = resData.data;
                        } else {
                            scope.loglist = scope.loglist.concat(resData.data);
                        }
                        
                        let length = resData.data.length
                        scope.lastId = resData.data[length - 1].id
                        console.log(scope.lastId)
                        console.log(scope.loglist.length)
                    } else {
                        scope.loadingText = '没有更多了'
                    }
                } else {
                    scope.$vux.toast.text(resData.msg);
                }
            })
        }
       
    },
    components: {
        switchTab
    },
};