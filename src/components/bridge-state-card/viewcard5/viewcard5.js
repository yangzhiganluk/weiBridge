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
            scope.$http.get(`${api.acquisition_url}/alarm/statisticsSensorAlarmCount`, {
                params: {
                    structureCode: scope.bridgeInfo.code,
                    startTime: moment(new Date()).subtract(7,'days').format('YYYY-MM-DD HH:mm:ss'),  // 减7天
                    endTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                    type: 'day'
                }
            }).then(res=> {
                let resData = res.data;
                if(resData.resultCode == 1) {
                    if(resData.data && resData.data.length > 1) {
                        let data = resData.data;
                        scope.viewcardDataFlag = true;
                        // 根据传感器类型统计告警次数
                        scope.$nextTick(function() {
                            this.renderChart(data)
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
                time: {
                    type: 'timeCat',//类型为日期
                    mask: 'MM-DD',//日期格式
                },
            };
            
            // Step 2: 载入数据源
            chart.source(data, defs);

            chart.scale('sum', {
                type: 'linear',
            })

            chart.axis('time', {
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
            });
            
            // Step 3：创建图形语法
            chart.area()
                .position('time*sum')
                .shape('smooth');
            chart.point()
                .position('time*sum');
            chart.line()
                .position('time*sum')
                .shape('smooth');
                
            // Step 4: 渲染图表
            chart.render();
        }
    },
};