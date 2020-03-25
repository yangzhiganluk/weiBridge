export default {
    props: {
        item: {
            type: Object,
        }
    },
    data() {
        return {
            show: false,
        }
    },
    methods: {
        /**
         * @decription 打开设备简介
         */
        showToggleBrief(item) { //高阶函数
            const scope = this;
            return ()=> {
                scope.$parent.$parent.cut(scope._uid)
                scope.show = !scope.show
            }
        },
        /**
         * @description 进入告警页面
         */
        // toAlarm() {
        //     console.log('alarm')
        // },
        /**
        * @description 进入故障页面
        */
        toFault() {
            this.$router.push({
                path: '/FaultList',
                query: {
                    type: 'transmissionEqp',
                    tranEqpCode: this.item.code
                }
            })
        },
        
    }

}