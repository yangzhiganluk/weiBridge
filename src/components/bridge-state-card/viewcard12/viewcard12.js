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
            uuid: '',   // 随机数，用于生成图表ID防止重复
            viewcardDataFlag: false,    // 没有匹配视图数据
            beginTime: moment().startOf('month').format('YYYY-MM-DD'),
            endTime: moment().endOf('month').format('YYYY-MM-DD'),
            attrs: [],  // bring v-calendar to life
            timer: null,  //定义空的变量
        };
    },
    created() {
        this.uuid = this.$$getuuid()
    },
    mounted() {
        this.setIntersection()
        this.setTimer()
    },
    methods: {
        /**
         * 
         * @description 初始化
         */
        initViewCard() {
            this.getStatusasCalendar(this.beginTime, this.endTime)
        },
        /**
         * @description 获取系统工作状态
         */
        getStatusasCalendar(beginTime, endTime) {
            const scope = this;
            scope.$http.get(`${api.acquisition_url}/viewCardRel/queryDailyFault`, {
                params: {
                    structureCode: scope.bridgeInfo.code,
                    beginTime,
                    endTime
                }
            }).then(res=> {
                let resData = res.data;
                if(resData.resultCode == 1) {
                    if(resData.data && resData.data.length > 0) {
                        let data = resData.data;
                        scope.viewcardDataFlag = true;
                        scope.attrs = data.map(item=> {
                            return {
                                key: item[0],
                                highlight: item[1] == 0 ? 'blue' : 'yellow',
                                dates: item[0],
                                popover: {
                                    label: item[1] == 0 ? '正常' : '异常',
                                    placement: 'auto',
                                    visibility: 'click'
                                },
                            }
                        })
                    }
                } else {
                    scope.$vux.toast.text(resData.msg);
                }
            })
        },


        /**
         * @description 渲染图表
         */
        pageChanged(page) {
            let nowTime = `${page.year}-${page.month}`;
            let d = moment(nowTime,"YYYY-MM"); //按照指定的年月字符串和格式解析出一个moment的日期对象
            this.beginTime = d.startOf('month').format('YYYY-MM-DD'); //通过startOf函数指定取月份的开始即第一天
            this.endTime =  d.endOf("month").format('YYYY-MM-DD'); //通过startOf函数指定取月份的末尾即最后一天
            this.initViewCard() 
        },
        /**
         * @description 懒加载
         */
        setIntersection() {
            const io = new IntersectionObserver((entries)=> {
                entries.forEach((item) => { // 遍历entries数组
                    if(item.isIntersecting){ // 当前元素可见
                        this.initViewCard()
                        io.unobserve(item.target)  // 停止观察当前元素 避免不可见时候再次调用callback函数
                    }   
                })
            }, {
                threshold: [0]
            })
            const current = document.getElementById(`${this.uuid}`) 
            // 监听
            io.observe(current)
        },
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
        
    }
};