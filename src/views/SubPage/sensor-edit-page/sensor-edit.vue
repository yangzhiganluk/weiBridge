<template>
  <div>
      <group gutter="0">
            <x-input 
                title="设备名称" 
                :max="20" 
                v-model="eqpName" 
                ref="eqpNameRef"
                placeholder="请输入设备名称" 
                placeholder-align="right"
                text-align="right"
                required
            >
            </x-input>
            <x-input
                title="设备编码"
                :value="sensorcode" 
                :readonly="true"
                text-align="right"
            >
            </x-input>
            <cell title="生产厂家" @click.native="handleBrand" value-align="right" is-link>{{sensorBrand}}</cell>
            <cell title="设备型号" @click.native="handleModel" value-align="right" is-link>{{sensorModel}}</cell>
            <x-input 
                title="安装位置" 
                :max="20" 
                v-model="sensorPosition" 
                ref="sensorPositionRef"
                placeholder="请输入安装位置" 
                placeholder-align="right"
                text-align="right"
                required
            >
            </x-input>
            <datetime 
                title="安装时间" 
                :value="sensor_create_time" 
                :readonly="true" 
                format="YYYY-MM-DD HH:mm"
            >

            </datetime>
             <x-switch 
                title="是否启用" 
                inline-desc="设备禁用后将不采集、不告警、不参与计算" 
                v-model="enableFlag"
                ref="enableFlagRef" 
            ></x-switch>
      </group>
  </div>
</template>

<script>
import sensoredit from './sensor-edit'
export default sensoredit
</script>

<style lang="scss" scoped>
@import './sensor-edit.scss'
</style>