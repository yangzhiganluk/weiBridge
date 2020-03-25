import {mapGetters} from 'vuex'
export default {
    props: {
        item: {
            type: Object,
        }
    },
    computed: {
        ...mapGetters(['imgUrl']),
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
        toAlarm() {
            this.$router.push({
                path: '/Alarms',
            })
        },
        /**
        * @description 进入故障页面
        */
        toFault() {
            console.log('fault')
            this.$router.push({
                path: '/Devices',
            })
        },
       /**
        * @description 进入桥梁状态页面
        */
       toBridgeState(item) {
        localStorage.setItem("bridgeInfo", JSON.stringify(item));
        this.$router.push('/BridgeState')
       },
    }

}