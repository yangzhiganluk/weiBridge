import api  from '@/api'
import setTimer from '@/mixins/setTimer';
const F2 = require('@antv/f2');
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
            uuid: '',   //随机数，用于生成图表ID防止重复
            viewcardDataFlag: false,    //没有匹配视图数据
        };
    },
    mounted() {
        this.uuid = this.$$getuuid()
        this.initViewCard()
    },
    methods: {
        /**
         * 
         * @description 初始化
         */
        initViewCard() {
            this.getRatioAlarmByType()
        },
        /**
         * @description 获取类型下的告警的饼图
         */
        getRatioAlarmByType() {
            const scope = this;
            scope.$http.get(`${api.acquisition_url}/alarm/v2/piechart/getRatioAlarmInfoByType`, {
                params: {
                    scode: scope.bridgeInfo.code,
                    startTime: moment(new Date()).subtract(7,'days').format('YYYY-MM-DD')+" 00:00:00",  // 减7天
                    endTime: moment(new Date()).format('YYYY-MM-DD')+" 23:59:59",
                    type: 'factor'
                }
            }).then(res=> {
                let resData = res.data;
                if(resData.resultCode == 1) {
                    if(resData.data && resData.data.length > 1) {
                        let data = resData.data;
                        scope.viewcardDataFlag = true;
                        // 根据传感器类型统计告警次数
                        let count_info = data.map((el, i)=> {
                            return {
                                "name": el.name,
                                "count": el.count
                            }
                        })
                        scope.$nextTick(function() {
                            this.renderChart(count_info)
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
        renderChart(data) {
            const scope = this;
            // Step 1: 创建 Chart 对象
            const chart = new F2.Chart({
                id: scope.uuid,
                width: window.screen.width,
                pixelRatio: window.devicePixelRatio, // 指定分辨率
            });

            const defs = {
                name: {
                    type: 'cat',
                },
            };
            
            // Step 2: 载入数据源
            chart.source(data, defs);

            chart.scale('count', {
                type: 'linear',
                tickInterval: 5
            })

            chart.axis('name', {
                grid: (text, index, total) => {
                    if (text === '0%') {
                      // 0％ 处的栅格线着重显示
                      return {
                        stroke: '#efefef',
                      };
                    }
                    return {
                      stroke: '#f7f7f7',
                    };
                },
                // label: (text, index, total) => {
                //     const cfg = {
                //       textAlign: 'center',
                //     };
                //     // 第一个点左对齐，最后一个点右对齐，其余居中，只有一个点时左对齐
                //     if (index === 0) {
                //       cfg.textAlign = 'start';
                //     }
                //     if (index > 0 && index === total - 1) {
                //       cfg.textAlign = 'end';
                //     }
                //     return cfg;
                // },
            });
            
            // Step 3：创建图形语法
            chart.interval()
                .position('name*count')
                .color('l(90) 0:#1890ff 1:#70cdd0'); // 定义柱状图渐变色;
                
            // Step 4: 渲染图表
            chart.render();
        }
    },
};