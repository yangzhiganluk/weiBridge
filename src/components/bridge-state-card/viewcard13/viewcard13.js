import api  from '@/api'
import setTimer from '@/mixins/setTimer';
import setIntersection from '@/mixins/setIntersection';
import F2 from "@antv/f2/lib/index-all";
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
            this.getSensorStatus()
        },
        /**
         * @description 查询传感器状态
         */
        getSensorStatus() {
            const scope = this;
            scope.$http.get(`${api.acquisition_url}/viewCardRel/querySensorStatus`, {
                params: {
                    structureCode: scope.bridgeInfo.code,
                }
            }).then(res=> {
                let resData = res.data;
                if(resData.resultCode == 1) {
                    let pieMap = resData.data
                    scope.viewcardDataFlag = true;
                    let status_info = [];
                    for(let i in pieMap) {
                        let obj = {
                            name: i,
                            count: pieMap[i],
                            percent: 0,
                            a: '1'
                        }
                        status_info.push(obj)
                    }
                    let sum = status_info.reduce((prev, current)=> {
                       return prev.count + current.count
                    })
                    status_info.forEach((el, i) => {
                        function toFix(num, unit){
                            if(typeof(num)=='undefined'){
                                return num
                            }else{
                                return Number(parseFloat(num).toFixed(unit))
                            }
                        }
                        status_info[i].percent = toFix(el.count / sum, 3);
                    });
                    scope.$nextTick(function() {
                        scope.setIntersection(pieMap, status_info);
                    })
                } else {
                    scope.$vux.toast.text(resData.msg);
                }
            })
        },

        /**
         * @description 渲染图表
         */
        renderChart(pieMap, data) {
            const scope = this;
            // Step 1: 创建 Chart 对象
            const chart = new F2.Chart({
                id: scope.uuid,
                width: window.screen.width,
                pixelRatio: window.devicePixelRatio, // 指定分辨率
            });

            const defs = {
                percent: {
                    formatter: function formatter(val) {
                        return val * 100 + '%';
                    }
                },
            };
            
            // Step 2: 载入数据源
            chart.source(data, defs);

            chart.legend({
                position: 'right',
                itemFormatter: function itemFormatter(val) {
                  return val + '  ' + pieMap[val];;
                }
            });

            chart.coord('polar', {
                transposed: true,   // 坐标系翻转
                innerRadius: 0.7,
                radius: 0.85    // 半径，数值为 0 - 1 范围
            });

            chart.axis(false);  // 不渲染坐标轴

            // 添加饼图文本
            chart.pieLabel({
                sidePadding: 40, // 文本距离画布左右两边的距离
                label1: function label1(data, color) { // label1 文本内容及其样式，Function 类型，回调函数
                    return {
                        text: data.name, // 文本内容
                        fill: color // 文本颜色
                    };
                },
                label2: function label2(data) {// label2 文本内容及其样式，Function 类型，回调函数
                    return {
                        text: data.count,
                        fill: '#808080',
                        fontWeight: 'bold'
                    };
                }
            });
            
            // Step 3：创建图形语法
            chart.interval()    //使用矩形或者弧形，用面积来表示大小关系的图形，一般构成柱状图、饼图等图表。
                .position('a*percent')
                .color('name', [ '#1890FF', '#FACC14' ])
                .adjust('stack')
                .style({
                    lineWidth: 1,
                    stroke: '#fff',
                    lineJoin: 'round',
                    lineCap: 'round'
                })
                .animate({
                    appear: {
                    duration: 1200,
                    easing: 'bounceOut'
                }
            });
                
            // Step 4: 渲染图表
            chart.render();
        }
    },
};