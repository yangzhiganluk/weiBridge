import api  from '@/api'
import setTimer from '@/mixins/setTimer';
const F2 = require('@antv/f2');
const Shape = F2.Shape;
const Util = F2.Util;
const Global = F2.Global;
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
            this.getSensorStatusByType()
        },
        /**
         * @description 按类型获取传感器的状态
         */
        getSensorStatusByType() {
            const scope = this;
            scope.$http.get(`${api.acquisition_url}/viewCardRel/getSensorEqpStatusByType`, {
                params: {
                    scode: scope.bridgeInfo.code,
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
                                "normalCount": el.normalCount,
                                "faultCount": el.faultCount
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
            
            function getRectRange(points, step) {
                const xValues = [];
                const yValues = [];
                for (let i = 0, len = points.length; i < len; i++) {
                  const point = points[i];
                  xValues.push(point.x - step);
                  yValues.push(point.y);
                }
                const xMin = Math.min.apply(null, xValues);
                const yMin = Math.min.apply(null, yValues);
                const xMax = Math.max.apply(null, xValues);
                const yMax = Math.max.apply(null, yValues);
              
                return {
                  x: xMin,
                  y: yMin,
                  width: xMax - xMin,
                  height: yMax - yMin
                };
              }
              
              // 左侧柱子
              Shape.registerShape('interval', 'left', {
                draw: function(cfg, container) {
                  var points = this.parsePoints(cfg.points);
                  var style = Util.mix({
                    fill: cfg.color
                  }, Global.shape.interval, cfg.style);
                  
                  var rectCfg = getRectRange(points, cfg.size); // cfg.size 对应 .size()
              
                  return container.addShape('rect', {
                    className: 'interval',
                    attrs: Util.mix(rectCfg, style)
                  });
                }
              });
              // 右侧柱子
              Shape.registerShape('interval', 'right', {
                draw: function(cfg, container) {
                  var points = this.parsePoints(cfg.points);
                  var style = Util.mix({
                    fill: cfg.color
                  }, Global.shape.interval, cfg.style);
                  var rectCfg = getRectRange(points, -cfg.size / 2);  // cfg.size 对应 .size()
              
                  return container.addShape('rect', {
                    className: 'interval',
                    attrs: Util.mix(rectCfg, style)
                  });
                }
              });
              
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
                normalCount: {
                    type: 'linear',
                    tickInterval: 5,
                    alias: '正常'
                },
                faultCount: {
                    type: 'linear',
                    tickInterval: 5,
                    alias: '异常'
                },
            };
            
            // Step 2: 载入数据源
            chart.source(data, defs);

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
            });
            chart.tooltip({
              triggerOn: [ 'touchstart', 'touchmove' ], // tooltip 出现的触发行为，可自定义，用法同 legend 的 triggerOn
              triggerOff: 'touchend', // 消失的触发行为，可自定义
            })
            // Step 3：创建图形语法
            chart.interval().position('name*normalCount').shape('left').size('name', name=> {
              if(data.length > 4) {
                  return 10
              }
              return 50;
            });
            chart.interval().position('name*faultCount').color('#36B3C3').shape('right').size('name', name=> {
              if(data.length > 4) {
                  return 10
              }
              return 50;
            }); 
            
            
            // Step 4: 渲染图表
            chart.render();
        }
    },
};