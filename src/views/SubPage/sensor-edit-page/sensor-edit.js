import api from '@/api'
import weui from 'weui.js'
export default {
    data() {
        return {
            bridgeInfo: localStorage.getItem("bridgeInfo") ? JSON.parse(localStorage.getItem("bridgeInfo")) : {},
            sensorInfo: localStorage.getItem("sensorInfo") ? JSON.parse(localStorage.getItem("sensorInfo")) : {},
            currentPage: 1, //当前页
            pageSize: 2000, //每页数量
            sensorId: '',   //传感器id
            eqpName: '',    //设备名称
            sensorcode: '', //设备编码
            sensorBrand: [''],    //生产厂家
            brandList: [],  //厂家列表
            
            sensorModel: [''],    //设备型号
            modelList: [], //所有厂家所有型号列表
           
            brandModelList: [], //指定厂家型号列表
            sensorPosition: '', //安装位置
            sensor_create_time: '', //安装时间
            enableFlag: true,   //是否启用
            dataItemInfo: [ //数据项
                {
                    serialnumber: '',   //序号
                    name: '',   //名称
                    unit: '',    //单位
                    accuracy: 2,   //精度
                    paramcode: '', //用来和数据项对比控制监测参数 
                    fcode: '',   //用来和数据项对比控制监测参数
                    id: ''
                }
            ],   
            monitoritem: '',    //监测参数
            monitorList: [],   //监测参数列表
            monitorVaule: [],
            monitors: [],
            format: function (value, name) {
                return `${name}`
            }
        }
    },
    mounted() {
        this.getSingleSensorInfo();
        this.getBrandList();
    },
    methods: {
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
                    scope.sensorBrand = [data.sensorBrand];
                    scope.sensorModel = [data.sensorModel];
                    scope.sensorPosition = data.sensorPosition;
                    scope.sensor_create_time = data.sensor_create_time;
                    scope.enableFlag = data.isenable == 1 ? true : false;
                    scope.sensorId = data.id;

                    scope.getModelList(data.sensorBrand)
                    
                    scope.dataItemInfo = data.dataItemInfo;
                    this.$nextTick(function() {
                        scope.getMonitorList(data.dataItemInfo)
                    })
                    
                } else {
                    scope.$vux.toast.text(resData.msg);
                }
            })
        },
        /**
         * @description 获取桥梁监测参数
         */
        getMonitorList(dataItemInfo) {
            const scope = this;
            this.$http.get(`${api.acquisition_url}/item/getMonitorInfoByType`, {
                params: {
                    type: scope.bridgeInfo.tpye
                }
            }).then(res=> {
                let resData = res.data;
                if(resData.resultCode == 1) {
                    if(resData.data && resData.data.length > 0) {
                        let data = resData.data;
                        let parentList = []
                        data.forEach(el=> {
                            let parentObj = {
                                name: el.fname,
                                value: el.fcode,
                                parent: 0,
                            }
                            parentList.push(parentObj)
                            el.paramInfo.forEach((item)=> {
                                let childObj = {
                                        name: item.pname,
                                        value: item.pcode,
                                        parent: item.fcode,
                                }
                                
                                parentList.push(childObj)
                           })
                        })
                        scope.monitors = JSON.parse(JSON.stringify(parentList));
                        this.$nextTick(function() {
                            // 设置监测参数
                            dataItemInfo.forEach(el=> {
                                JSON.parse(JSON.stringify(parentList)).forEach(item=> {
                                    if(item.value == el.paramcode) {
                                        scope.monitorVaule.push(item.value);
                                    }
                                })
                            })
                        })
                    }
                    
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
                            tempList.push(el.brand)
                        })
                        scope.brandList = [tempList]
                    } else {
                        scope.$vux.toast.text(resData.msg);
                    }
                })
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
         * @description 更新brandModelList
         */
        refleshBrandModelList(sensorBrand) {
            const scope = this;
            let tempList = []
            scope.modelList.forEach((el)=> {
                if(el.brand == sensorBrand) {
                    let temp =  el.model
                    tempList.push(temp);
                   if(scope.brandModelList.indexOf(temp) == -1) {
                        scope.sensorModel = [JSON.parse(JSON.stringify(tempList))[0]]
                   }
                }
            })
            
            scope.brandModelList = [JSON.parse(JSON.stringify(tempList))];
        },

        handleChange(value) {
            const scope = this;
            scope.refleshBrandModelList(value[0]);
            console.log(scope.sensorModel[0])
        },
        
        onButtonClick (type, index) {
            const scope = this;
            let dataItemInfo = scope.dataItemInfo
            let length = dataItemInfo.length
            // 添加数据项
            if(type == 'add') {
                let serialnumber = '';
                if(length > 0) {
                    serialnumber = dataItemInfo[length - 1].serialnumber + 1
                } else {
                    serialnumber = 1;
                }
                let tempObj = {
                    serialnumber,   //序号
                    name: '',   //名称
                    unit: '',    //单位
                    accuracy: 2,   //精度
                    paramcode: '',  //用来和数据项对比控制监测参数
                    fcode: ''   //用来和数据项对比控制监测参数
                }
                scope.dataItemInfo.push(tempObj)
            }
            // 删除数据项
            if(type == 'delete') {
                scope.$vux.confirm.show({
                    title: '操作提示',
                    content: '此操作将删除该数据项, 是否继续?',
                    onCancel () {},
                    onConfirm () {
                      dataItemInfo.splice(index, 1);
                      dataItemInfo.forEach((el, i)=> {
                        el.serialnumber = i + 1
                      })
                      scope.dataItemInfo = dataItemInfo;
                    }
                })
            }
        },
       
        /**
         * @description 验证表单输入 整合数据
         */
        checkSaveSensorInfo() {
            // 设置标志位
            let flag = false
            for(let x in this.$refs) {
                if (this.$refs[x].validate) {
                    this.$refs[x].validate();
                    let valid = this.$refs[x].valid;
                    if(!valid) {
                        this.$refs[x].focus();
                        this.$refs[x].blur();
                        flag = true
                    }
                }
                if(x == 'dataItemRef') {
                    this.$refs[x].forEach(el=> {
                        el.$children.forEach(item=> {
                            if(item.validate) {
                                item.validate();
                                let itemvalid = item.valid;
                                if(!itemvalid) {
                                    item.focus();
                                    item.blur();
                                    flag = true
                                }
                            }
                        })
                    })
                }
            }
            // if(flag) return
            let sensorInfo = {};
            const scope = this
            sensorInfo.name = scope.eqpName
            sensorInfo.model = scope.sensorModel[0]
            sensorInfo.brand = scope.sensorBrand[0]
            sensorInfo.position = scope.position
            sensorInfo.create_time = scope.sensor_create_time
            sensorInfo.sensorCode = scope.sensorcode
            sensorInfo.sensorId = scope.sensorId
            sensorInfo.isenable = scope.enableFlag ? 1 : 0

            let dataInfo = [];
            // 遍历数据项
            scope.dataItemInfo.forEach(el=> {
                let tempObj = {}
                tempObj.name= el.name
                tempObj.fcode= el.fcode
                tempObj.paramCode= el.paramCode
                tempObj.unit= el.unit
                tempObj.accuracy= el.accuracy
                tempObj.serialnumber= el.serialnumber
                tempObj.dataId= el.id

                dataInfo.push(tempObj)
            })
            scope.updateSensorandDataInfo(sensorInfo, dataInfo)
        },

        /**
         * @description 更新传感器
         */
        updateSensorandDataInfo(sensorInfo, dataInfo) {
            const scope = this;
            let params = new FormData();
            params.append('structureCode', scope.bridgeInfo.code);
            params.append('sensorInfo', JSON.stringify(sensorInfo));
            params.append('dataInfo', JSON.stringify(dataInfo));
            this.$http.post(`${api.acquisition_url}/acquisiteEquipment/v3/updateSensorAndDataInfo`, params, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
            }).then(res=> {
                let resData = res.data;
                if(resData.resultCode == 1) {
                    scope.$vux.toast.show({
                        type: 'success',
                        text: resData.msg
                    })
                } else {
                    scope.$vux.toast.text(resData.msg)
                }
            })
        }
       
    }
}