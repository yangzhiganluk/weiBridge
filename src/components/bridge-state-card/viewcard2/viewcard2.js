import api  from '@/api'
import setTimer from '@/mixins/setTimer';
import { mapGetters } from 'vuex'
import _ from 'lodash';
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
    computed: {
        ...mapGetters(['allAccessType']),
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
            this.allAccessType.forEach((el, i) => {
                if(el.name == '桥梁总体') {
                    this.getScoreByAccessTypeTime(el.code)
                }
            })
        },
        /**
         * @description 获取评估类型时间范围内的得分
         */
        getScoreByAccessTypeTime(weight_code) {
            const scope = this;
            scope.$http.get(`${api.acquisition_url}/viewCardRel/v2/scope/getScoreByWeightSet`, {
                params: {
                    scode: scope.bridgeInfo.code,   //结构物编号
                    weight_code,    //评估项编号
                }
            }).then(res=> {
                let resData = res.data;
                if(resData.resultCode == 1) {
                    if(resData.data && resData.data.length > 0) {
                        scope.viewcardDataFlag = true;
                        let score_info = resData.data[0].score_info;
                        let data = score_info.map(item=> {
                            return {
                                score: item.score,
                                time: item.time,
                                name: '评分'
                            }
                        })
                        scope.$nextTick(function() {
                            this.renderChart(data)
                        })
                    }
                } else {
                    scope.$vux.toast.text(resData.msg);
                }
            })
        },
        renderChart(data) {
            const scope = this;
            
            // Step 1: 创建 Chart 对象
            const chart = new F2.Chart({
                id: scope.uuid,
                width: window.screen.width,
                pixelRatio: window.devicePixelRatio, // 指定分辨率
            });

            // Step 2: 载入数据源
            chart.source(data);

            chart.scale('time', {
                type: 'timeCat',//类型为日期
                mask: 'MM-DD',//日期格式
            });
            chart.scale('score', {
                type: 'linear',
                tickInterval: 5,
                alias: '评分'
            });
            
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
                .position('time*score')
                .shape('smooth');
            chart.point()
                .position('time*score');
            chart.line({
                    sortable: false,
                })
                .position('time*score')
                .color('name')
                .shape('smooth');
                
            // Step 4: 渲染图表
            chart.render();
        }
    },
};