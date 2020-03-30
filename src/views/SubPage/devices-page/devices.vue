<template>
    <div class="myContainer">
        <switch-tab :bridgeInfo="bridgeInfo"></switch-tab>
        <tab 
            :line-width="1" 
            bar-active-color="#6dddd1" 
            v-model="tabIndex" 
            prevent-default
            @on-before-index-change="switchTabItem"
        >
            <tab-item>通信</tab-item>
            <tab-item>类型</tab-item>
            <tab-item>位置</tab-item>
        </tab>
        <!-- 通信设备列表内容 -->
        <div v-if="tabIndex==0">
            <group>
                <div class="common-box"
                    v-for="(item, index) in equList"
                    :key="index"
                    >
                    <longpress-cell :item="item"></longpress-cell>
                </div>
            </group>
        </div>
        <!-- 传感器类型、位置 -->
        <div v-if="tabIndex==1 || tabIndex==2">
            <div v-if="sensorList.length>0">
                <group :title="item.name" v-for="(item, index) in sensorList" :key="index">
                        <cell-box v-for="(el, i) in item.children" :key="i">
                            <div class="common-box-bd">
                                <div class="title" @click="toSensorInfo(el)">{{el.name}}</div>
                                <grid :show-lr-borders="false" :show-vertical-dividers="false">
                                    <grid-item @on-item-click="toFault(el.code)" v-if="el.faultNum > 0">
                                        <!-- <img slot="icon" src="~assets/images/fault.png"> -->
                                        <badge :text="String(el.faultNum)"></badge>
                                    </grid-item>
                                </grid>
                                <div class="icon-link" @click="toSensorInfo(el)"></div>
                            </div>
                        </cell-box>
                </group>
            </div>
        </div>
    </div>
</template>

<script>
import devices from './devices'
export default devices
</script>
<style scoped lang="scss">
 @import './devices.scss'
</style>
