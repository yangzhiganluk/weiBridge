import api from '@/api'
export default {
    data() {
        return {
            bridgeInfo: localStorage.getItem("bridgeInfo") ? JSON.parse(localStorage.getItem("bridgeInfo")) : {},
            sensorInfo: localStorage.getItem("sensorInfo") ? JSON.parse(localStorage.getItem("sensorInfo")) : {},
            currentPage: 1, //当前页
            pageSize: 2000, //每页数量
            eqpName: '',    //设备名称
            sensorcode: '', //设备编码
            sensorBrand: '',    //生产厂家
            brandList: [],  //厂家列表
            sensorModel: '',    //设备型号
            modelList: [], //所有厂家所有型号列表
            brandModelList: [], //指定厂家型号列表
            sensorPosition: '', //安装位置
            sensor_create_time: '', //安装时间
            enableFlag: true,   //是否启用
        }
    },
    mounted() {
        this.getSingleSensorInfo();
        this.getBrandList()
    },
    methods: {
        onChange(item) {
            console.log(item)
        },
        /**
         * @description 查询单个传感器设备
         */
        getSingleSensorInfo() {
            const scope = this;
            this.$http.get(`${api.acquisition_url}/acquisiteEquipment/findSensorEquipmentList`, {
                params: {
                    structureCode: scope.bridgeInfo.code,
                    currentPage: scope.currentPage,
                    pageSize: scope.pageSize,
                    code: scope.sensorInfo.code
                }
            }).then(res=> {
                let resData = res.data;
                if(resData.resultCode == 1) {
                    let data = resData.data[0];
                    scope.eqpName = data.eqpName;
                    scope.sensorcode = data.sensorcode;
                    scope.sensorBrand = data.sensorBrand;
                    scope.sensorModel = data.sensorModel;
                    scope.sensorPosition = data.sensorPosition;
                    scope.sensor_create_time = data.sensor_create_time;
                    scope.enableFlag = data.isenable == 1 ? true : false;
                    scope.getModelList(data.sensorBrand)
                } else {
                    scope.$vux.toast.text(resData.msg);
                }
            })
        },
        /**
         * @description 获取所有厂家
         */
        getBrandList() {
            const scope = this;
            
            this.$http.get(`${api.acquisition_url}/equipmentModel/getAllBrandFromEqpModel`, {})
                .then(res=> {
                    let resData = res.data;
                    if(resData.resultCode == 1) {
                        let data = resData.data;
                        let tempList = []
                        data.forEach((el, i)=> {
                            let tempObj = {
                                label: el.brand,
                                value: i
                            }

                            tempList.push(tempObj)
                        })
                        scope.brandList = tempList
                    } else {
                        scope.$vux.toast.text(resData.msg);
                    }
                })
        },
        handleBrand() {
            const scope = this;
            scope.$weui.picker(scope.brandList, {
                defaultValue: [scope.sensorBrand],
                onConfirm: function (result) {
                    console.log(result[0].label)
                    scope.sensorBrand = result[0].label;
                    scope.refleshBrandModelList(scope.sensorBrand);
                },
             });
        },
        /**
         * @description 获取所有型号
         */
        getModelList(sensorBrand) {
            const scope = this;
            this.$http.get(`${api.acquisition_url}/equipmentModel/findAllEquipmentModel`, {})
                .then(res=> {
                    let resData = res.data;
                    if(resData.resultCode == 1) {
                        if(resData.data && resData.data.length > 0) {
                            let data = resData.data;
                            scope.modelList = data
                            scope.refleshBrandModelList(sensorBrand)
                        }
                        
                    } else {
                        scope.$vux.toast.text(resData.msg);
                    }
                })
        },
        /**
         * @description 更新modelList
         */
        refleshBrandModelList(sensorBrand) {
            const scope = this;
            let tempList = []
            scope.modelList.forEach((el, i)=> {
                if(el.brand == sensorBrand) {
                    let temp = {
                        label: el.model,
                        value: el.id
                    }
                    tempList.push(temp);
                   if(scope.brandModelList.indexOf(temp.label) == -1) {
                    scope.sensorModel = tempList[0].label
                   }
                }
            })
            scope.brandModelList = tempList;
        },
        handleModel() {
            const scope = this;
            scope.$weui.picker(scope.brandModelList, {
                defaultValue: [scope.sensorModel],
                onConfirm: function (result) {
                    console.log(result[0].label)
                    scope.sensorModel = result[0].label
                },
             });
        }
    }
}