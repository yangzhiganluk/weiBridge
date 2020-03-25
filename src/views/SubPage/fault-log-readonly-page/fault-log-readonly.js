import api from '@/api'
export default {
    
    data() {
        return {
            bridgeInfo: localStorage.getItem("bridgeInfo") ? JSON.parse(localStorage.getItem("bridgeInfo")) : {},
            name: '',
            time: '',
            content: '',
            handleContent: ''
        };
    },
    
    mounted() {
        let id = this.$route.query.id
        this.getFaultLogById(id)
    },
  
    methods: {
        /**
         * @description 查询设备故障日志详情
         */
        getFaultLogById(id) {
            const scope = this;
            this.$http.get(`${api.acquisition_url}/eqp/log/fault/${id}`).then(res=> {
                let resData = res.data;
                if(resData.resultCode == 1) {
                    scope.name = resData.data.name;
                    scope.time = resData.data.time;
                    scope.content = resData.data.content;
                    scope.handleContent = resData.data.handleContent
                } else {
                    scope.$vux.toast.text(resData.msg);
                }
            })
        },
    },
    
};