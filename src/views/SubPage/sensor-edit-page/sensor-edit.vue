<template>
  <div>
      <!-- 桥梁名称 -->
      <div class="bridge-name">
          <divider>{{bridgeInfo.fullname}}</divider>
      </div>
      <group>
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
            <!-- <cell title="生产厂家" @click.native="handleBrand" value-align="right" is-link>{{sensorBrand}}</cell> -->
            <div class="weui-cell weui-cell_active weui-cell_access weui-cell_select weui-cell_select-after">
                <div class="weui-cell__hd"><label class="weui-label">生产厂家</label></div>
                <div class="weui-cell__bd" @click="handleClick('brand')">{{sensorBrand}}</div>
            </div>
            <!-- <cell title="设备型号" @click.native="handleModel" value-align="right" is-link>{{sensorModel}}</cell> -->
            <div class="weui-cell weui-cell_active weui-cell_access weui-cell_select weui-cell_select-after">
                <div class="weui-cell__hd"><label class="weui-label">设备型号</label></div>
                <div class="weui-cell__bd" @click="handleClick('model')">{{sensorModel}}</div>
            </div>
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
            ></x-switch>
      </group>
      <div v-if="dataItemInfo.length > 0">
            <group ref="dataItemRef" title="数据项" v-for="(item, index) in dataItemInfo" :key="index">
                <x-input
                    title="序号"
                    :value="item.serialnumber" 
                    :readonly="true"
                    text-align="right"
                >
                </x-input>
                <x-input 
                    title="名称" 
                    :max="6" 
                    v-model="item.name" 
                    
                    placeholder="请输入名称" 
                    placeholder-align="right"
                    text-align="right"
                    required
                >
                </x-input>
                <div v-if="monitoritem" class="weui-cell weui-cell_active weui-cell_access weui-cell_select weui-cell_select-after">
                    <div class="weui-cell__hd"><label class="weui-label">监测参数</label></div>
                    <div class="weui-cell__bd" @click="handleClick('monitor')">{{monitoritem}}</div>
                </div>
                <div v-else class="weui-cell weui-cell_active weui-cell_access weui-cell_select weui-cell_select-after">
                    <div class="weui-cell__hd"><label class="weui-label">监测参数</label></div>
                    <div class="weui-cell__bd"><spinner type="ripple" size="40px"></spinner></div>
                </div>
                <x-input 
                    title="单位" 
                    :max="20" 
                    v-model="item.unit" 
                    placeholder="请输入单位" 
                    placeholder-align="right"
                    text-align="right"
                >
                </x-input>
                <x-input 
                    title="精度" 
                    :max="2" 
                    v-model="item.accuracy" 
                    placeholder="请输入精度" 
                    placeholder-align="right"
                    text-align="right"
                    required
                >
                </x-input>
                <swipeout>
                    <swipeout-item transition-mode="follow">
                        <div slot="right-menu">
                        <swipeout-button @click.native="onButtonClick('delete', index)" type="warn">删除</swipeout-button>
                        </div>
                        <div slot="content" class="swipeout-box weui-cells">
                            <span class="vux-label-desc">(左滑选择删除该数据项)</span>
                        </div>
                    </swipeout-item> 
                </swipeout>
            </group>
      </div>
      <box gap="10px 10px">
         <flexbox>
            <flexbox-item>
            <x-button plain type="default" style="border-radius:99px;" @click.native="onButtonClick('add')">增加</x-button>
            </flexbox-item>
            <flexbox-item>
            <x-button :gradients="['#1D62F0', '#19D5FD']" style="border-radius:99px;" @click.native="checkSaveSensorInfo">保存</x-button>
            </flexbox-item>
        </flexbox>
      </box>
  </div>
</template>

<script>
import sensoredit from './sensor-edit'
export default sensoredit
</script>

<style lang="scss" scoped>
@import './sensor-edit.scss'
</style>