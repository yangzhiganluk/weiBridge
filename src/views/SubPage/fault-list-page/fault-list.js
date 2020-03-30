import api from '@/api'
import _ from 'lodash'
import BScroll from 'better-scroll'
export default {
    data() {
        return {
            bridgeInfo: localStorage.getItem("bridgeInfo") ? JSON.parse(localStorage.getItem("bridgeInfo")) : {},
            loginInfo: localStorage.getItem("loginInfo") ? JSON.parse(localStorage.getItem("loginInfo")) : {},
            handleFlag: null,
            totalcount: 0,  //返回总数
            pageSize: 10,
            lastId: '', //当前页最后一条数据id
            loglist: [],
            isLoading: false,
            loadingText: '正在加载'
        };
    },
    
    created() {
        this.params = {
            structureCode: this.bridgeInfo.code,
            pageSize: this.pageSize,
        }
    },
    mounted() {
        this.setFaultLogParams(this.lastId)
        // this.initScroll();
    },
   
    methods: {
        /**
         * @description 显示已处理
         */
        handleSwitch() {
            
            this.params = {
                structureCode: this.bridgeInfo.code,
                pageSize: this.pageSize,
                handleFlag: this.handleFlag
            };
            if(this.handleFlag) {
                this.lastId = ''
                this.setFaultLogParams('')
            } else {
                this.loglist = [];
                this.setFaultLogParams(this.lastId)
            }
            
        },
        // initScroll() {
        //     const scope = this;
        //     scope.scroll = new BScroll(scope.$refs.wrapper, {
        //         tap: true,
        //         click: true,
        //         probeTybe: 1,
        //         bounceTime:700,      //回弹时间
        //         pullUpLoad: {
        //             threshold: 50    
        //         },
        //         pullDownRefresh:{
        //             stop: 20,
        //             threshold: 50  
        //         },
        //         useTransition:false  // 防止iphone微信滑动卡顿
        //     });
        //     if (this.$refs.content) {
        //         if (this.$refs.wrapper instanceof window.SVGElement) {
        //             let rect = this.$refs.wrapper.getBoundingClientRect();
        //             this.$refs.content.style.minHeight = `${rect.height + 1}px`
        //         } else {
        //             this.$refs.content.style.minHeight = `${this.$refs.wrapper.offsetHeight + 1}px`
        //         }
        //     }
        //     scope.scroll.on('pullingUp', (pos)=> {
        //         scope.handlePullUp();
        //         scope.$nextTick(() => {
        //             scope.scroll.refresh() // DOM 结构发生变化后，重新初始化BScroll
        //         })
        //         scope.scroll.finishPullUp() // 下拉刷新动作完成后调用此方法告诉BScroll完成一次上拉动作
        //     })
        //     scope.scroll.on('pullingDown', (pos)=> {
        //         scope.handlePullDown();
        //         scope.$nextTick(() => {
        //             scope.scroll.refresh() // DOM 结构发生变化后，重新初始化BScroll
        //         })
        //         scope.scroll.finishPullDown() // 上拉加载动作完成后调用此方法告诉BScroll完成一次下拉动作
        //     })
        // },
        /**
         * @description 上拉加载
         */
        handlePullUp() {
            const scope = this
            console.log('....', scope.lastId)
            scope.isLoading = true
            scope.loadingText = '加载更多'
            scope.setFaultLogParams(scope.lastId)
        },
        /**
         * @description 下拉刷新
         */
        handlePullDown() {
            scope.isLoading = false
            scope.lastId = ''
            scope.setFaultLogParams('')
        },
        /**
         * @description 获取地址栏参数生成参数对象
         */
        setFaultLogParams(lastId) {
                const queryType = this.$route.query.type;
                let tempObj = {}
                switch(queryType) {
                    case 'sensorEqp': 
                        let sensorCode = this.$route.query.sensorCode;
                        tempObj = _.merge({}, this.params, {
                            type: 'sensorEqp',
                            sensorCode,
                        }, lastId ? { lastId } : {})
                        this.getFaultList(tempObj)
                        break;
                    case 'transmissionEqp': 
                        let tranEqpCode = this.$route.query.tranEqpCode; 
                        tempObj = _.merge({}, this.params, {
                            type: 'transmissionEqp',
                            tranEqpCode,
                        }, lastId ? { lastId } : {})
                        this.getFaultList(tempObj)
                        break;
                }
            
        },
       
        /**
         * @description 分页查询设备故障日志
         */
        getFaultList(params) {
            const scope = this;
            this.$http.get(`${api.acquisition_url}/eqp/log/fault`, {
                params
            }).then(res=> {
                let resData = res.data;
                if(resData.resultCode == 1) {
                    if(resData.data && resData.data.length > 0) {
                        scope.totalcount = resData.count
                        if(!this.lastId) {
                            scope.loglist = resData.data;
                        } else {
                            scope.loglist = scope.loglist.concat(resData.data);
                        }
                        
                        let length = resData.data.length
                        scope.lastId = resData.data[length - 1].id
                        console.log(scope.lastId)
                        console.log(scope.loglist.length)
                    } else {
                        scope.totalcount = 0;
                        scope.loglist= []
                        scope.loadingText = '没有更多了'
                    }
                } else {
                    scope.$vux.toast.text(resData.msg);
                }
            })
        },
        /**
         * @description 进入错误日志
         */
        toFaultLog(id) {
            const scope = this;
            if(scope.loginInfo.type == 3) {
                let structures = JSON.parse(localStorage.getItem("structures"));
                structures.forEach(el=> {
                    // 如果结构物的code和当前桥的code一致
                    if(el.code == scope.bridgeInfo.code) {
                        // 获取role
                        let role = el.role
                        // 判断当前子账号是否有管理权限
                        if(role.indexOf("manage")!=-1 && !scope.handleFlag) {
                            scope.$router.push({path:'/FaultLog', query: {id: id}})
                        } else {
                            scope.$router.push({path:'/FaultLogReadonly', query: {id: id}})
                        }

                    }
                })
            } else {
                scope.$router.push({path:'/FaultLog', query: {id: id}})
            }
        }
    },
};