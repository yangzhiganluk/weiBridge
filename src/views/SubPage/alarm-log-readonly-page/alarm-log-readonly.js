import api from '@/api'
export default {
    data() {
        return {
            bridgeInfo: localStorage.getItem("bridgeInfo") ? JSON.parse(localStorage.getItem("bridgeInfo")) : {},
            logInfo: null,
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
    mounted() {
        let id = this.$route.query.id
        this.getAlarmLogById(id)
    },
    methods: {
        /**
         * @description 查询传感器告警日志详情
         */
        getAlarmLogById(id) {
            const scope = this;
            this.$http.get(`${api.acquisition_url}/eqp/log/alarm/${id}`).then(res=> {
                let resData = res.data;
                if(resData.resultCode == 1) {
                    scope.logInfo = resData.data;
                } else {
                    scope.$vux.toast.text(resData.msg);
                }
            })
        },
    },
    
};