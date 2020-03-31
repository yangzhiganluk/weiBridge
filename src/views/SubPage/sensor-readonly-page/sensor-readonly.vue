<template>
  <div>
      <!-- 桥梁名称 -->
      <div class="bridge-name">
          <divider>{{bridgeInfo.fullname}}</divider>
      </div>
       <tab 
            :line-width="1" 
            bar-active-color="#6dddd1" 
            v-model="tabIndex" 
            prevent-default
            @on-before-index-change="switchTabItem"
        >
            <tab-item>基本信息</tab-item>
            <tab-item>采集数据</tab-item>
        </tab>
        <div v-if="tabIndex==0">
            <group>
                    <cell title="设备名称" :value="eqpName"></cell>
                    <cell title="设备编码" :value="sensorcode"></cell>
                    <cell title="生产厂家" :value="sensorBrand"></cell>
                    <cell title="设备型号" :value="sensorModel"></cell>
                    <cell title="安装位置" :value="sensorPosition"></cell>
                    <datetime 
                        title="安装时间" 
                        :value="sensor_create_time" 
                        :readonly="true" 
                        format="YYYY-MM-DD HH:mm"
                    >
                    </datetime>
                    <x-switch 
                        title="是否启用" 
                        disabled
                        inline-desc="设备禁用后将不采集、不告警、不参与计算" 
                        v-model="enableFlag"
                    ></x-switch>
            </group>
            <div v-if="dataItemInfo.length > 0">
                    <group ref="dataItemRef" title="数据项" v-for="(item, index) in dataItemInfo" :key="index">
                        <cell title="序号" :value="item.serialnumber"></cell>
                        <cell title="名称" :value="item.name"></cell>
                        <cell v-if="monitoritem" title="监测参数" :value="monitoritem"></cell>
                        <cell-box v-else title="监测参数">
                            <spinner type="ripple" size="40px"></spinner>
                        </cell-box>
                        <cell title="单位" :value="item.unit"></cell>
                        <cell title="精度" :value="item.accuracy"></cell>
                    </group>
            </div>
        </div>
        <div v-if="tabIndex==1">
            <history-graphs 
                :sensorCode="sensorcode"
                :structureCode="bridgeInfo.code"
                :dataItemCode="dataItemInfo[0].code"
            ></history-graphs>
        </div>
  </div>
</template>

<script>
import sensorreadonly from './sensor-readonly'
export default sensorreadonly
</script>

<style lang="scss" scoped>
@import './sensor-readonly.scss'
</style>