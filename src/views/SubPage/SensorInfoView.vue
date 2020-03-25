<template>
  <div class="myContainer sensorContainer">
    <x-header :left-options="{backText: ''}" @click.native="goback"></x-header>
    <div class="AlarmInfo">
      <div class="cellTop" style="margin:10px auto"></div>
      <div class="sensorInfo createSensorModal">

        <div class="content">
          <!-- <div class="subTitle">
             <label>传感器</label>
           </div>-->
           <!-- <div class="subTitle">
            <label>{{createSensorform.structureName}}</label>
          </div> -->
          <el-form ref="createSensorform" :model="createSensorform"  :rules="rules"  label-width="80px">
            <el-form-item label="设备名称" prop="sensorname">
              <div class="el-input">
                <input type="text" @input="sensorNameInputed" v-model="createSensorform.sensorname" class="el-input__inner" placeholder="请输入设备名称" disabled/>
              </div>
            </el-form-item>

            <el-form-item label="设备编码" prop="deviceCode" class="disabledStyle">
              <el-input v-model="createSensorform.deviceCode" disabled placeholder="请填写设备编码"></el-input>
              <!--<el-button type="primary" plain @click.native="generateCode('sensor')" :disabled="editSensorInfo">系统生成</el-button>-->
            </el-form-item>

            <el-form-item label="生产厂家" style="position:relative;" prop="cmonitorsType" >
              <el-select v-model="createSensorform.monitorsType" style="width:calc(100%);float: left;margin-right: 20px;" placeholder="请选择" @change="monitorsTypeSelect" disabled>
                <el-option
                  v-for="(item,index) in brandFrom"
                  :key="index"
                  :label="item.brand"
                  :value="item.brand">
                </el-option>
              </el-select>
              <el-input v-model="createSensorform.monitorsType" placeholder="请输入生产厂家" style="width:calc(100% - 40px);position:absolute;left:0px;" @blur="brandOrModelByInput" disabled></el-input>
            </el-form-item>


            <el-form-item label="设备型号"  style="position:relative;" prop="deviceModel" class="changeSelect">
              <el-select v-model="createSensorform.deviceModel"  style="width:calc(100%);float:left;margin-right: 20px;" placeholder="请选择" @change="sensorModelChanged" disabled>
                <el-option
                  v-for="(item,index) in qlmodel"
                  :key="index"
                  :label="item.model"
                  :value="item.model">
                </el-option>
              </el-select>
              <el-input v-model="createSensorform.deviceModel" placeholder="请输入设备型号" ref="deviceModel" style="width:calc(100% - 40px);position:absolute;left:0px;" @blur="brandOrModelByInput" disabled></el-input>

            </el-form-item>



            <el-form-item label="安装位置">
              <el-input v-model="createSensorform.position" placeholder="请输入安装位置" disabled></el-input>
            </el-form-item>

            <el-form-item label="安装时间" class="ivuSelect">

              <DatePicker
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                v-model="createSensorform.installTime"
                placeholder="选择日期时间"
                style="width: calc(100% - 0px)"
                class="datatimeStyle"
                @on-open-change="handleTimeChange"
                :editable="false"
                :clearable="false"
                disabled
              >

              </DatePicker>


            </el-form-item>
            <el-form-item label="是否启用" class="switchStyle">
              <el-switch v-model="sensorSwitch" style="margin-bottom: 5px"></el-switch>
              <label style="padding-left: 10px;color: red;font-weight:400">（设备禁用后将不采集、不告警、不参与计算）</label>
            </el-form-item>
          </el-form>



          <div class="subContent" v-if="showCreateSensor_data">
            <div class="subTitle">
              <label>数据项</label>
              <!--<el-button type="primary" icon="el-icon-plus" size="mini" @click.native="addDataItem">增加</el-button>-->
            </div>

            <el-form :model="sensorExtend" ref="sensorExtend" label-width="80px">
              <div class="sub-wrap" v-for="(item,index) in sensorExtend.sensorExtend_dataList" :key="index" >
                <!--<i class="el-icon-remove-outline deleteIcon" @click="deleteDataItem(index)"></i>-->

                <div class="el-form">
                  <el-form-item label="序号"
                                :prop="'sensorExtend_dataList.' + index + '.serialnumber'"
                                :rules="[{required: true, message: '序号不能为空', trigger: 'blur'},{ type: 'number', message: '序号必须为数字值'}]"

                  >
                    <el-input v-model.number="item.serialnumber"  placeholder="请输入序号" disabled onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="名称"
                                :prop="'sensorExtend_dataList.' + index + '.name'"
                                :rules="{required: true, message: '名称不能为空', trigger: 'blur'}"
                  >
                    <el-input v-model="item.name" placeholder="请输入名称" disabled></el-input>
                  </el-form-item>

                  <el-form-item label="监测参数"
                                :prop="'sensorExtend_dataList.' + index + '.monitorInfo'"
                                :rules="{required: true, message: '监测参数不能为空', trigger: 'change'}"
                                class="ivuSelect"
                  >
                    <Select  v-model="item.monitorInfo" placeholder="请选择"  size="large" disabled>
                      <OptionGroup
                        v-for="(item,index) in monitorList"
                        :key="index"
                        :label="item.fname">
                        <Option
                          v-for="(subItem,subIndex) in item.paramInfo"
                          :key="subIndex"
                          :label="subItem.pname"
                          :title="subItem.pname"
                          :value="subItem.pcode">
                        </Option>
                      </OptionGroup>
                    </Select>

                  </el-form-item>

                  <el-form-item label="单位">
                    <el-input v-model="item.unit" placeholder="请输入单位" disabled></el-input>
                  </el-form-item>

                  <el-form-item label="精度"
                                :prop="'sensorExtend_dataList.' + index + '.accuracy'"
                                :rules="{required: true, message: '精度不能为空', trigger: 'blur'}"
                  >
                    <el-input v-model="item.accuracy" placeholder="请输入精度" style="float:left;width:100%;" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" disabled></el-input>
                    <label >小数点后几位</label>

                  </el-form-item>
                </div>

              </div>

              <div class="saveBtn" v-if="">
                <!--<el-button type="primary" @click.native="saveSensorInfoDataItem()"><i class="fa fa-floppy-o" aria-hidden="true" style="margin-right: 10px"></i>保存</el-button>-->
              </div>

            </el-form>
          </div>
        </div>




      </div>

    </div>


  </div>
</template>
<script>
  import {setCookie, getCookie, delCookie} from '../../assets/js/cookie.js'
  import echarts from 'echarts/lib/echarts'
  import 'echarts/lib/chart/line'

  var publicapi = require('../../assets/js/publicapi.js')
  var api = publicapi.proxy.monitoring_url;
  var acquisition_url = publicapi.proxy.acquisition_url;  //
  var management_url = publicapi.proxy.management_url;
  var  monitoring_url=publicapi.proxy.monitoring_url;
  import {mapGetters} from 'vuex'
  import {getNowFormatDate} from '../../assets/js/transfromTime';
  import {getPastFormatDate} from '../../assets/js/transfromTime';
  import {getFormatDateBySelect} from '../../assets/js/transfromTime';

  import $ from 'jquery'



  export default {
    data() {
      var checkCmonitorsType = (rule, value, callback) => {
        if (!this.createSensorform.monitorsType || this.createSensorform.monitorsType=="") {
          return callback(new Error('请输入生产厂家'));
        }  else {
          callback();
        }
      };
      var checkDeviceModel = (rule, value, callback) => {
        if (!this.createSensorform.deviceModel || this.createSensorform.deviceModel=="") {
          return callback(new Error('请输入设备型号'));
        }  else {
          callback();
        }
      };
      return {
        accessToken: getCookie("accessToken"),
        sensorInfo: [],//传感器信息

        selectTimeType:'datetime',//时间选择器的类型

        structureInfo:'',
        loginInfo:localStorage.getItem("loginInfo")&&typeof localStorage.getItem("loginInfo") !="object"?JSON.parse(localStorage.getItem("loginInfo")):"",//获取登录权限
        bridgeList: localStorage.getItem("bridgeList")?JSON.parse(localStorage.getItem("bridgeList")):[], //桥梁列表

        routerType:"",//路由器传过来的类型，是从告警信息详情里面的单个数据项还是传感器信息的数据项组

        scanData:"",//扫一扫的数据


        rules: {

          sensorname:[
            {required: true, message: '请输入设备名称', trigger: 'blur'},
          ],

          deviceCode:[
            {required: true, message: '请输入设备编码', trigger: 'blur'},
          ],
          dtuCode:[
            {required: true, message: '请输入设备编码', trigger: 'blur'},
          ],
          cmonitorsType:[
            // {required: true, message: '请输入生产厂家', trigger: 'blur'},
            {validator: checkCmonitorsType, trigger: 'blur'},
          ],
          deviceModel:[
            // {required: true, message: '请输入设备型号', trigger: 'blur'},
            {validator: checkDeviceModel, trigger: 'blur'},
          ],
        },
        createSensorform: {
          // structureName: '',
          sensorname: "",//设备名称
          monitorsType: "",//生产厂家
          deviceCode: "",//设备编码
          deviceModel:"",//设备型号
          position: "",//安装位置
          installTime:moment(new Date()).format('YYYY-MM-DD HH:ss:mm'),//安装时间
          // installTime:new Date(),//安装时间

          sensorId:"",//需要修改的传感器的ID
        },




        createSensorModal: false,//新增传感器的模态框
        sensorSwitch: true,

        judgeRebuildSensor:false,//判断是否是新增传感器的状态

        brandFrom:[],//品牌库
        qlmodel:[],//型号库
        qlmodelTotal:[],//全部的型号库

        showCreateSensor_data:true,//是否显示新增时的传感器下的数据项

        //用来校验数据项
        sensorExtend:{
          sensorExtend_dataList:[{serialnumber:1,name:"",monitorInfo:"",accuracy:2}],//传感器下的数据项
        },

        sensorExtend_dataInfo:{
          name:"",
          source:"",
          monitorInfo:"",
          unit:"",
          accuracy:""
        },
        monitorList:[],//监测因素
        dataSourceList:[],//数据来源


        showDeviceModelInput:false,//是否显示设备型号文本框
        showMonitorsTypeInput:false,//是否显示生产厂家输入框


        sensorTableList:[],//传感器
        sensorCount:0,//传感器列表的数目
        dataItemCount:0,//数据项数量
        factorCount:0,//已配置的项数
        classifiedData:[],//按类型分类的数据
        classifiedDataIndex:"",//按类型分类的数据下标
        clickedDataInfo:{},//当前选择的数据项信息

        editSensorInfo:true,//是否是编辑传感器的状态

        editSensorData:[],//编辑的传感器信息
      }
    },
    computed: {
      // ...mapGetters(['username']),
      ...mapGetters(['count', 'moreBridgePageUrl', 'imgUrl']),
    },
    beforeCreate() {
      this.$store.dispatch('initcount')
    },
    created() {


    },
    mounted(){
      this.scanData=sessionStorage.getItem("scanData")?JSON.parse(sessionStorage.getItem("scanData")):"";
      if(this.scanData && this.scanData!=""){
        // this.getSensorData(this.scanData.id)
        this.getall();

      }else{
        var routerType=this.$route.params.type;//获取从路由传递过来的信息

        if(routerType=='workstate'){   //表明是从工作状态那边传递过来的，是一个数据项的集合
          this.structureInfo=localStorage.getItem("bridgeInfo")?JSON.parse(localStorage.getItem("bridgeInfo")):[];

          var sensorInfo=localStorage.getItem("sensorInfo")?JSON.parse(localStorage.getItem("sensorInfo")):[];
          this.routerType='workstate';
          let rows=sensorInfo;
          rows.sensorcode=sensorInfo.code;
          this.getEditSensorInfo(rows);
          this.getMonitorInfoByType();//获取监测参数
        }else{
          this.$vux.toast.text('系统异常，请稍后再试', 'middle')
        }
      }

      this.getAllBrandFromEqpModel();//获取品牌

    },
    destroyed(){
      sessionStorage.removeItem("scanData");
    },
    methods: {
      /*点击返回*/
      goback(){
        this.$router.go(-1);
      },

      //查询全部结构物
      getall() {
        this.$http.get(management_url + '/sub/getStructureList', {
          params: {
            accessToken: getCookie('accessToken'),
            user_id: this.loginInfo.id,
            user_type: this.loginInfo.type
          }
        }).then((res) => {
          if (res.data.resultCode == 1) {
            if(res.data.data&&res.data.data.length>0){
              let structureList=res.data.data;
              for(let i=0;i<structureList.length;i++){
                if(structureList[i].sCode==this.scanData.structureCode){
                  this.structureInfo=structureList[i];
                  this.structureInfo.code=this.structureInfo.sCode;//后台接口命令不一致
                  this.structureInfo.tpye=this.structureInfo.type;//后台接口命令不一致
                  this.getEditSensorInfo(this.scanData);
                  this.getMonitorInfoByType();//获取监测参数
                  return;
                }
              }
            }else{
              this.$vux.toast.text('获取数据异常，请退出再试', 'middle')
            }
          }else if (res.data.resultCode == 0) {
            this.$vux.toast.text(res.data.msg, 'middle')
          } else {
            this.$vux.toast.text(res.data.msg, 'middle')

          }
        });

      },

      //修改传感器
      getEditSensorInfo(rows){

        this.editSensorData="";
        this.sensorSwitch=true;

        this.$http.get(acquisition_url+'/acquisiteEquipment/findSensorEquipmentList', {
          // this.$http.get('api/acquisiteEquipment/findSensorEquipmentList', {
          params: {
            structureCode:this.structureInfo.code,
            currentPage:1,
            pageSize:"20000",
            // state:this.$route.params.state,
            code:rows.sensorcode,
          }
        }).then((res) => {
          if(res.data.resultCode==1){
            if(res.data.data&&res.data.data.length>0){
              let row=res.data.data[0];


              this.editSensorData=row;
              // this.createSensorform=row;
              // this.createSensorform.structureName = row.structureName;
              this.createSensorform.sensorname=row.eqpName;
              this.createSensorform.monitorsType=row.sensorBrand;
              this.createSensorform.deviceModel=row.sensorModel;
              this.createSensorform.deviceCode=row.sensorcode;
              this.createSensorform.position=row.sensorPosition;
              this.createSensorform.installTime=row.sensor_create_time;
              // this.createSensorform.sensorId=row.id;
              this.sensorSwitch=row.isenable==1?true:false;

              this.qlmodel = [];
              if (this.qlmodelTotal && this.qlmodelTotal.length > 0) {
                for (let i = 0; i < this.qlmodelTotal.length; i++) {
                  let parents = this.qlmodelTotal[i];
                  if (this.createSensorform.monitorsType == parents.brand) {
                    this.qlmodel.push(parents)
                  }
                }
              }


              for(let i=0;i<row.dataItemInfo.length;i++){
                let datas=row.dataItemInfo[i];
                datas.monitorInfo=datas.paramcode;
                datas.dataId=datas.id;
              }
              this.sensorExtend.sensorExtend_dataList=row.dataItemInfo;
              this.createSensorModal=true;
            }
          }else if (res.data.resultCode == 0) {
            this.$vux.toast.text(res.data.msg, 'middle')


          } else {
            this.$vux.toast.text(res.data.msg, 'middle')

          }

        });


      },


      /*新增传感器的脚本开始*/
      //生成设备编码
      generateCode(type){
        let structureCode="";
        if(type=='sensor' || type=='dtu'){
          structureCode=this.structureInfo.code;
        }
        this.$http.get(acquisition_url + '/item/autoGenerationCodeByType', {
          // this.$http.get('api/equipmentModel/findAllEquipmentModel', {
          params: {
            accessToken: getCookie('accessToken'),
            type:type,
            structureCode:structureCode
          }
        }).then((res) => {
          if (res.data.resultCode == 1) {
            if (res.data.data) {
              if(type=='structure'){
                this.ruleForm.code=res.data.data;
              }else if(type=='sensor' ){
                this.createSensorform.deviceCode=res.data.data;
              }else if(type=='dtu'){
                this.createSensorform.dtuCode=res.data.data;
              }
            }
          } else if (res.data.resultCode == 0) {
            this.$vux.confirm.show({
              title: '提示',
              content: res.data.msg,
              onCancel () {

              },
              onConfirm () {
              }
            })
          } else {
            this.$vux.toast.text(res.data.msg, 'middle')

          }

          this.findALLmsg1();
        });
      },
      //查询品牌
      getAllBrandFromEqpModel() {
        this.brandFrom = [];
        this.$http.get(acquisition_url + '/equipmentModel/getAllBrandFromEqpModel', {
          // this.$http.get('api/equipmentModel/findAllEquipmentModel', {
          params: {
            accessToken: getCookie('accessToken'),
          }
        }).then((res) => {
          if (res.data.resultCode == 1) {
            if (res.data.data && res.data.data.length > 0) {
              this.brandFrom = res.data.data;
              // this.brandFrom.push({brand: "手动输入"})
              // this.createSensorform.monitorsType = this.brandFrom[0].brand;
            }
          } else if (res.data.resultCode == 0) {
            this.$vux.toast.text(res.data.msg, 'middle')

          } else {
            this.$vux.toast.text(res.data.msg, 'middle')

          }

          this.findALLmsg1();
        });
      },
      //查询全部型号
      findALLmsg1() {
        this.qlmodel = [];
        this.qlmodelTotal = [];
        this.$http.get(acquisition_url + '/equipmentModel/findAllEquipmentModel', {
          // this.$http.get('api/equipmentModel/findAllEquipmentModel', {
          params: {
            accessToken: getCookie('accessToken'),
          }
        }).then((res) => {
          if (res.data.resultCode == 1) {

            if (res.data.data && res.data.data.length > 0) {
              this.qlmodelTotal = res.data.data;

              if (this.qlmodelTotal && this.qlmodelTotal.length > 0) {
                for (let i = 0; i < this.qlmodelTotal.length; i++) {
                  let parents = this.qlmodelTotal[i];
                  if (this.createSensorform.monitorsType == parents.brand) {
                    this.qlmodel.push(parents)
                  }
                }
                /*      if (this.qlmodel.length > 0) {
                        this.createSensorform.deviceModel = this.qlmodel[0].model;
                        let obj = {};
                        obj.model = this.qlmodel[0].model ? this.qlmodel[0].model : "";
                        obj.brand = this.createSensorform.monitorsType ? this.createSensorform.monitorsType : "";
                        this.findEquipmentModelInfo(obj);
                      }*/
              } else {
                this.qlmodel = res.data.data;
                this.createSensorform.deviceModel = this.qlmodel[0].model;

                /* let obj = {};
                 obj.model = this.qlmodel[0].model ? this.qlmodel[0].model : "";
                 obj.brand = this.createSensorform.monitorsType ? this.createSensorform.monitorsType : "";
                 this.findEquipmentModelInfo(obj);*/
              }
              /*this.qlmodel.push({
                brand: "",
                description: "",
                id: 68,
                model: "手动输入",
              });*/
            }
          } else if (res.data.resultCode == 0) {
            this.$vux.toast.text(res.data.msg, 'middle')

          } else {
            this.$vux.toast.text(res.data.msg, 'middle')

          }
        });
      },
      //生成数据项信息
      generateDataInfo(){
        if(this.createSensorform.sensorname!=""){
          let sensorExtend_dataList=this.sensorExtend.sensorExtend_dataList;
          for(let i=0;i<sensorExtend_dataList.length;i++){
            this.sensorExtend.sensorExtend_dataList[i].name=this.createSensorform.sensorname+"-"+(i+1);
          }
        }
      },

      //查找型号里面的数据项
      findEquipmentModelInfo(data) {
        this.loading=false;
        // this.sensorExtend.sensorExtend_dataList = [{serialnumber:1,name:'数据项-01'}];
        this.$http.get(acquisition_url + '/equipmentModel/findEquipmentModelInfo', {
          // this.$http.get('api/equipmentModel/findEquipmentModelInfo', {
          params: {
            currentPage: 1,
            model: data.model,
            brand: data.brand,
            pageSize: 1000,
            structureCode: this.structureInfo.code,
          }
        }).then((res) => {
          //console.log('============')

          if (res.data.resultCode == 1) {
            if (res.data.data && res.data.data.length > 0) {
              if (res.data.data[0].paramInfo && res.data.data[0].paramInfo.length>0) {
                let paramInfo=res.data.data[0].paramInfo;
                for(let i=0;i<paramInfo.length;i++){
                  if(paramInfo[i].code=='data'){
                    let value=paramInfo[i].value;

                    if(value && value.length>0){
                      value=JSON.parse(value);
                      for(let j=0;j<value.length;j++){
                        value[j].serialnumber=j+1;
                        value[j].accuracy=value[j].accuracy && value[j].accuracy!=""? value[j].accuracy:2;
                      }
                      this.sensorExtend.sensorExtend_dataList=value;

                    }
                  }
                }

                this.generateDataInfo();
              }
            }

          } else if (res.data.resultCode == 0) {
            this.$vux.toast.text(res.data.msg, 'middle')

          } else {
            this.$vux.toast.text(res.data.msg, 'middle')

          }


          // this.dataBackups = res.data
        })
      },
      //获取桥梁监测参数
      getMonitorInfoByType() {
        this.monitorList = [];
        this.$http.get(acquisition_url + '/item/getMonitorInfoByType', {
          // this.$http.get('api/equipmentModel/findAllEquipmentModel', {
          params: {
            type: this.structureInfo.tpye,
          }
        }).then((res) => {
          if (res.data.resultCode == 1) {

            if (res.data.data && res.data.data.length > 0) {
              this.monitorList = res.data.data;
            }
          } else if (res.data.resultCode == 0) {
            this.$vux.toast.text(res.data.msg, 'middle')

          } else {
            this.$vux.toast.text(res.data.msg, 'middle')

          }
        });
      },


      //厂家（品牌下拉框改变事件）
      monitorsTypeSelect() {
        /*   if(this.current==1){
             this.$refs['sensorExtend'].resetFields();
           }*/

        this.qlmodel = [];
        if (this.qlmodelTotal && this.qlmodelTotal.length > 0) {
          for (let i = 0; i < this.qlmodelTotal.length; i++) {
            let parents = this.qlmodelTotal[i];
            if (this.createSensorform.monitorsType == parents.brand) {
              this.qlmodel.push(parents)
            }
          }
          this.createSensorform.deviceModel = this.qlmodel[0].model;
        }
        this.generateDataItem(this.createSensorform.deviceModel,this.createSensorform.monitorsType)
      },
      //设备型号改变事件
      sensorModelChanged(e) {
        // this.$refs.deviceModel.value=e
        this.createSensorform = {
          sensorname:this.createSensorform.sensorname ,//设备名称
          monitorsType: this.createSensorform.monitorsType,//生产厂家
          deviceCode: this.createSensorform.deviceCode,//设备编码
          deviceModel: e,//设备型号
          position: this.createSensorform.position,//安装位置
          installTime: this.createSensorform.installTime,//安装时间
          // installTime:new Date(),//安装时间
          directive: this.createSensorform.directive,//采集模式
          directiveTime: this.createSensorform.directiveTime,//采集时间
          sensorId:this.createSensorform.sensorId
        }
        this.generateDataItem(this.createSensorform.deviceModel,this.createSensorform.monitorsType)
      },

      //厂家和型号的手动输入事件
      brandOrModelByInput(){
        if(this.createSensorform.monitorsType!="" || this.createSensorform.deviceModel!=""){
          this.generateDataItem(this.createSensorform.deviceModel,this.createSensorform.monitorsType)
        }

      },

      //通过厂家或者是型号生成数据项
      generateDataItem(model,brand) {
        if(!this.editSensorInfo){
          let obj = {};
          obj.model = model;
          obj.brand = brand;
          this.findEquipmentModelInfo(obj);
        }
      },

      //时间选择器的相关事件
      handleTimeChange(e){
        if(e){
          $(".sensorContainer").addClass("sensorLocked")
        }else{
          $(".sensorContainer").removeClass("sensorLocked")
        }
      },

      //设备名称改变事件
      sensorNameInputed(){
        if(this.createSensorform.sensorname!=""){
          let sensorExtend_dataList=this.sensorExtend.sensorExtend_dataList;
          for(let i=0;i<sensorExtend_dataList.length;i++){
            this.sensorExtend.sensorExtend_dataList[i].name=this.createSensorform.sensorname+"-"+(i+1);
          }
        }


      },
      //添加数据项
      addDataItem() {
        // this.sensorExtend.sensorExtend_dataList.unshift(this.sensorExtend_dataInfo);
        let index=this.sensorExtend.sensorExtend_dataList.length;
        let sensorExtend_dataList=this.sensorExtend.sensorExtend_dataList;
        this.sensorExtend.sensorExtend_dataList.push({
          /*name: index<9?("数据项-0"+(index+1)):("数据项-"+(index+1)),
          serialnumber:(index+1),*/
          name:"",
          serialnumber:sensorExtend_dataList[sensorExtend_dataList.length-1].serialnumber+1,
          source: "",
          monitorInfo: "",
          unit: "",
          accuracy: 2
        });
        // this.sensorExtend.sensorExtend_dataList.reverse();
      },
      //删除数据项
      deleteDataItem(index) {
        const scope = this;
        /*      this.$confirm('此操作将删除该数据项, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                scope.sensorExtend.sensorExtend_dataList.splice(index, 1);
                let sensorExtend_dataList=this.sensorExtend.sensorExtend_dataList;
                for(let i=0;i<sensorExtend_dataList.length;i++){
                  this.sensorExtend.sensorExtend_dataList[i].serialnumber=i+1
                }
              }).catch(() => {

              });*/
        this.$vux.confirm.show({
          title: '提示',
          content: '此操作将删除该数据项, 是否继续?',
          onCancel () {

          },
          onConfirm () {
            scope.sensorExtend.sensorExtend_dataList.splice(index, 1);
            let sensorExtend_dataList=scope.sensorExtend.sensorExtend_dataList;
            for(let i=0;i<sensorExtend_dataList.length;i++){
              scope.sensorExtend.sensorExtend_dataList[i].serialnumber=i+1
            }
          }
        })
      },




      //取消新增传感器
      cancelCreateSensor() {
        this.createSensorform = {
          sensorname: "",//设备名称
          monitorsType: "",//生产厂家
          deviceCode: "",//设备编码
          deviceModel: "",//设备型号
          position:"",//位置
          installTime: moment(new Date()).format('YYYY-MM-DD HH:ss:mm'),//安装时间
        };
        this.sensorExtend = {
          sensorExtend_dataList: [{name:""}],//传感器下的数据项
        };
        this.createSensorModal = false;


        this.editSensorInfo=false;

        this.$refs['createSensorform'].resetFields();
        this.$refs['sensorExtend'].resetFields();
      },
      //再建一个传感器
      rebuildSensor() {
        this.judgeRebuildSensor=true;
        // this.cancelCreateSensor();
        // this.createSensorModal = false,
        //   setTimeout((res) => {
        //   this.createSensorModal = true;
        // }, 500)
        this.saveSensorInfoDataItem();
      },

      /*验证数据项传感器信息*/
      saveSensorInfoDataItem() {
        this.$refs['createSensorform'].validate((valid) => {
          if (valid) {
            this.$refs['sensorExtend'].validate((valid) => {
              if (valid) {

                function changeDate(dateA) {
                  var dateee = new Date(dateA).toJSON();
                  var date = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
                  return date;
                };

                let sensorInfo={};
                sensorInfo.name=this.createSensorform.sensorname;
                sensorInfo.model=this.createSensorform.deviceModel;
                sensorInfo.brand=this.createSensorform.monitorsType;
                sensorInfo.position=this.createSensorform.position;
                sensorInfo.create_time=changeDate(this.createSensorform.installTime);
                sensorInfo.sensorCode=this.createSensorform.deviceCode;

                sensorInfo.sensorId=this.editSensorData.id;
                sensorInfo.isenable=this.sensorSwitch?1:0;

                let dataInfo=[];

                let monitorInfoList=[]; //输出监测参数
                for(let i=0;i<this.monitorList.length;i++) {
                  let parents = this.monitorList[i];
                  for (let k = 0; k < parents.paramInfo.length; k++) {
                    let childrens = parents.paramInfo[k];
                    for (let j = 0; j < this.sensorExtend.sensorExtend_dataList.length; j++) {
                      let subchildrens = this.sensorExtend.sensorExtend_dataList[j];
                      if(subchildrens.monitorInfo==""){
                        this.$Message.error('您有监测参数未选择');
                        return false;
                      }
                      if (childrens.pcode == subchildrens.monitorInfo) {
                        let obj={};
                        obj.name=subchildrens.name;
                        obj.fcode=childrens.fcode;
                        obj.paramCode=childrens.pcode;
                        obj.unit=subchildrens.unit;
                        obj.accuracy=subchildrens.accuracy;
                        obj.serialnumber=subchildrens.serialnumber;
                        obj.dataId=subchildrens.dataId;

                        dataInfo.push(obj)
                      }
                    }
                  }
                }
                // this.$refs['createSensorform'].resetFields();
                this.updateSensorAndDataInfo(sensorInfo,dataInfo)


              } else {
                // this.$Message.error('您有必输项未填写或填写有误');
                this.$vux.toast.text('您有必输项未填写或填写有误', 'middle')

              }
            })
          } else {
            this.$vux.toast.text('您有必输项未填写或填写有误', 'middle')
          }
        })

      },
      //新增传感器同时新增数据项
      updateSensorAndDataInfo(sensorInfo,dataInfo){
        let params = new FormData();
        params.append('structureCode', this.structureInfo.code);
        // params.append('code', this.formValidate.code);
        params.append('sensorInfo', JSON.stringify(sensorInfo));
        params.append('dataInfo', JSON.stringify(dataInfo));

        // this.$http.post('api/item/addDataItem',params,{
        this.$http.post(acquisition_url + '/acquisiteEquipment/v3/updateSensorAndDataInfo', params, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then((res) => {

          if (res.data.resultCode == 1) {


            this.getAllBrandFromEqpModel();//获取品牌


            // this.$refs['createSensorform'].resetFields();

            this.$vux.toast.show({
              text: res.data.msg
            })

          } else if (res.data.resultCode == 0) {
            this.$vux.confirm.show({
              title: '提示',
              content: res.data.msg,
              onCancel () {

              },
              onConfirm () {
              }
            })

          } else {
            this.$vux.toast.text(res.data.msg, 'middle')

          }
        })
      },


    }
  }
</script>
<style lang="scss" scoped>

  .myContainer {
    padding-bottom: 20px;
    .AlarmInfo {

    }

    .weui-btn {
      font-size: 16px;
      width: 60%;
      border: none;
    }

    .sensorCell{
      .weui-cells{
        margin-top: 0;
      }
      .weui-cells:before{
        border: none;
      }
    }
  }

  .sensorLocked{
    height:100%;
    overflow: hidden;
  }

  /*新增传感器的模态框*/
  .createSensorModal {
    .title {
      height: 35px;
      line-height: 35px;
      label {
        margin-right: 30px;
        font-size: 18px;
      }
      .ivu-switch {
        margin-bottom: 7px;
      }
    }
    /*中间内容*/
    .content {
      overflow-y: auto;
      box-sizing: border-box;
      &>.subTitle {
        height: 35px;
        line-height: 35px;
        font-size: 14px;
        padding-left: 12px;
        label {
          font-weight: 400;
          margin-right: 20px;
        }
      }
      .el-form{
        overflow: hidden;
      }
      .el-form-item {
        width: 100%;
        float: left;
        margin-bottom: 15px;
      }
      .el-select {
        width: 100%;
      }
      .showbtn {
        .el-input {
          float: left;
          width: calc(100% - 140px);
          margin-right: 20px;
        }
        .el-button {
          float: left;
        }
      }
      .el-date-editor {
        width: 100%;
      }

      .saveBtn{
        width:100%;
        margin-top: 30px;
        clear: both;
        text-align: center;
      }
      .el-switch__core .el-switch__button{
        top:2px;
      }

      /*数据项的样式*/
      .subContent {
        margin-top: 40px;
        clear: both;
        .subTitle {
          height: 35px;
          line-height: 35px;
          font-size: 18px;
          padding-left: 12px;
          label {
            font-weight: 400;
            margin-right: 20px;
          }
        }
        .sub-wrap {
          margin-top: 30px;
          overflow: hidden;
          padding-left: 10px;
          box-sizing: border-box;
          .deleteIcon{
            display: inline-block;
            float: left;
            width:20px;
            height:20px;
            font-size: 20px;
            cursor: pointer;
            margin-top: 10px;
          }
          .el-form{
            float: left;
            width: calc(100% - 20px);
          }
          .el-form-item {
            width: 100%;
          }
          .el-input-number .el-input__inner{
            text-align: left;
          }
          .el-form-item__content {

          }
        }

      }
    }
  }


</style>


<style lang="scss">
  .ivuSelect .ivu-select-large{
    .ivu-select-selection .ivu-select-selected-value{
      height:40px;
      line-height: 40px;
      padding-left: 15px;
    }
    .ivu-select-selection{
      height:40px;
    }

  }
  .ivuSelect{
    .ivu-date-picker{
      .ivu-input-wrapper{
        .ivu-input{
          height:36px;
          line-height: 36px;
          font-size:14px;
          border: 1px solid rgb(191, 203, 217);
        }
        .ivu-input-icon{
          height:36px;
          line-height: 36px;
          font-size:14px;
        }
        .ivu-input{
          padding-left: 16px;
        }

      }
    }
  }

  .ivuSelect{
    .el-form-item__content{
      position:static;
    }
    .ivu-select-dropdown{
      overflow-x: hidden;
    }
  }

  .changeSelect{
    .ivu-select-single .ivu-select-selection{
      height:40px;
      .ivu-select-arrow{
        right: 13px;
        margin-top: -6px;
      }
      .ivu-icon-arrow-down-b:before{
        content: "\E605";
      }
    }
  }
  /*简介的样式*/
  .introduction{
    .el-textarea__inner{
      height:150px;
    }
  }


  /*二维码的样式*/
  .qrcodeStyle{
    height:300px;
    padding-top: 20px;
    &>table{
      margin: 0 auto;
      border: 1px solid #000000;
    }
  }

  .switchStyle{
    .el-switch__core .el-switch__button{
      top:2px;
    }
  }


  /*时间选择器的样式*/
  .datatimeStyle{
    color: rgb(31, 45, 61);
    border-radius: 4px;
    .ivu-input{
      text-align: left;
    }
  }

  #date-wrapper h3{
    color: #fff;
    background-color: #20a0ff !important;
    border-color: #20a0ff;
  }
  #d-confirm{
    background-color: #20a0ff !important;
  }

  /*禁用状态下的样式*/
  .disabledStyle{
    .el-input.is-disabled .el-input__inner{
      color: rgb(31, 45, 61);
    }
  }
</style>

