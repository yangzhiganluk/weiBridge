// 定时器设置以及清除
export default {
    data() {
        return {
            timer: null,  //定义空的变量
        }
    },
    mounted() {
        this.setTimer();
    },
    methods: {
        /**
         * @description 创建定时器
         */
        setTimer: function() {
            const scope = this;
            scope.timer = setInterval(() => {
                // do sth
                scope.initViewCard()
            }, 1000 * 60 * 5)
        },
        /**
         * @description 清除定时器
         */
        clearTimer: function() {
            const scope = this;
            clearInterval(scope.timer);
            scope.timer = null;
        }
    },
    // 最后在beforeDestroy()生命周期内清除定时器, 销毁图表
    beforeDestroy() {
        if(this.timer) {
            this.clearTimer();
        }
        if(this.chart) {
            // 将图表销毁
            this.chart.destroy();
            // 将 this.chart 属性清除
            delete this.chart;
        }
    }
}