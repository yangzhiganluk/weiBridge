import api  from '@/api'
import setTimer from '@/mixins/setTimer';
const F2 = require('@antv/f2');
import _ from 'lodash';
export default {
    mixins: [setTimer],
    props: {
        sensorCode: {
            type: String,
            default: '',
        },
        structureCode: {
            type: String,
            default: '',
        },
        dataItemCode: {
            type: String,
            default: '',
        }
    },
    data() {
        return {
            uuid: '',   //随机数，用于生成图表ID防止重复
            viewcardDataFlag: false,    //没有匹配视图数据
            timeType: '近一小时',
            options: [
                '近一小时',
                '近一天',
                '近半月',
                '近一年'
            ]
        }
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
            this.selectTimeType(this.timeType)
        },
        /**
         * @description 切换时间粒度
         */
        selectTimeType(timeType) {
            let startTime = null,   endTime = null;
            switch(timeType) {
                case '近一小时':
                    startTime = moment(new Date()).subtract(1,'hours').format('YYYY-MM-DD HH:mm:ss');
                    endTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                    this.getChartDataByType(`${api.monitoring_url}/report/getRawData`,'minute', startTime, endTime);
                    break;
                case '近一天':
                    startTime = moment(new Date()).subtract(1,'days').format('YYYY-MM-DD HH:mm:ss');
                    endTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                    this.getChartDataByType(`${api.monitoring_url}/report/getHourData`,'hour', startTime, endTime);
                    break;
                case '近半月':
                    startTime = moment(new Date()).subtract(1,'month').format('YYYY-MM-DD HH:mm:ss');
                    endTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                    this.getChartDataByType(`${api.monitoring_url}/report/getDayData`,'day', startTime, endTime);
                    break;
                case '近一年':
                    startTime = moment(new Date()).subtract(1,'years').format('YYYY-MM-DD HH:mm:ss');
                    endTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                    this.getChartDataByType(`${api.monitoring_url}/report/getMonthData`,'month', startTime, endTime);
                    break;
            }

        },
        /**
         * @description 显示分钟数据、小时数据、月数据、年数据
         */
        getChartDataByType(url, type, startTime, endTime) {
            const scope = this;
            scope.$http.get(url, {
                params: {
                    sensorCode: scope.sensorCode,
                    structureCode: scope.structureCode,
                    dataItemCode: scope.dataItemCode,
                    startTime: startTime,
                    endTime: endTime,
                }
            }).then(res=> {
                const resData = res.data;
                if(resData.resultCode == 1) {
                    let data = resData.data,
                    timeInfo = data.timeInfo,
                    maxValueInfo = data.maxValueInfo,
                    minValueInfo = data.minValueInfo,
                    valueInfo = data.valueInfo
                    let tempList = []
                    timeInfo.forEach((item, i)=> {
                        tempList.push({
                            date: item,
                            type: "最大值",
                            value: maxValueInfo[i],
                        },
                        {
                            date: item,
                            type: "最小值",
                            value: minValueInfo[i],
                        },
                        {
                            date: item,
                            type: "采集值",
                            value: valueInfo[i],
                        })
                    })
                    scope.$nextTick(function() {
                        this.renderChart(tempList, type)
                    })
                } else {
                    scope.$vux.toast.text(resData.msg);
                }
            })
        },
        renderChart(data, type) {
            const scope = this;
            // Step 1: 创建 Chart 对象
            const chart = new F2.Chart({
                id: scope.uuid,
                width: window.screen.width,
                pixelRatio: window.devicePixelRatio, // 指定分辨率
            });
            // Step 2: 载入数据源
            chart.source(data);
            chart.scale('date', {
                type: 'timeCat',
                formatter: function(time) {
                    switch(type) {
                        case 'minute': return moment(time).format('HH:mm');
                        case 'hour': return moment(time).format('HH:mm');
                        case 'day': return moment(time).format('MM-DD');
                        case 'month': return moment(time).format('YYYY-MM');
                    }
                },
                tickCount: 3
            });

            chart.scale('value', {
                tickCount: 4
            });

            chart.axis('date', {
                label: function label(text, index, total) {
                    // 只显示每一年的第一天
                    const textCfg = {};
                    if (index === 0) {
                        textCfg.textAlign = 'left';
                    } else if (index === total - 1) {
                        textCfg.textAlign = 'right';
                    }
                    return textCfg;
                }
            });

            chart.tooltip({
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
            chart.line().position('date*value').color('type').shape('smooth');;
            chart.render();
        }
    }
}