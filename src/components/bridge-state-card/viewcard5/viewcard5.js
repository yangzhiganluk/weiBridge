import api  from '@/api'
import setTimer from '@/mixins/setTimer';
import setIntersection from '@/mixins/setIntersection';
const F2 = require('@antv/f2');
export default {
    mixins: [setTimer, setIntersection],
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
                    if(resData.data && resData.data.length > 0) {
                        
                        scope.viewcardDataFlag = true;
                        let data = resData.data.map(item=> {
                            return {
                                sum: item.sum,
                                time: item.time,
                                name: '告警数'
                            }
                        });

                        // 根据传感器类型统计告警次数
                        scope.$nextTick(function() {
                            scope.setIntersection('', data);
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
        renderChart(type, data) {
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
                sum: {
                    type: 'linear',
                    alias: '告警数'
                }
            };
            
            // Step 2: 载入数据源
            chart.source(data, defs);

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
            chart.tooltip({
                showCrosshairs: true,
                custom: true, // 自定义 tooltip 内容框
                onChange: function onChange(obj) {
                  const legend = chart.get('legendController').legends.top[0];
                  const tooltipItems = obj.items;
                  const legendItems = legend.items;
                  const map = {};
                  legendItems.forEach(function(item) {
                    map[item.name] = _.clone(item);
                  });
                  tooltipItems.forEach(function(item) {
                    const name = item.name;
                    const value = item.value;
                    if (map[name]) {
                      map[name].value = value;
                    }
                  });
                  legend.setItems(_.values(map));
                },
                onHide: function onHide() {
                  const legend = chart.get('legendController').legends.top[0];
                  legend.setItems(chart.getLegendItems().country);
                }
            });

            // Step 3：创建图形语法
            chart.area({
                    sortable: false,
                })
                .position('time*sum')
                .shape('smooth');
            chart.point()
                .position('time*sum');
            chart.line({
                    sortable: false,
                })
                .position('time*sum')
                .color('name')
                .shape('smooth');
                
            // Step 4: 渲染图表
            chart.render();
        }
    },
};