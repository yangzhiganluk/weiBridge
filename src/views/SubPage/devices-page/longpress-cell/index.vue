<template>
  <div>
    <cell-box 
        v-longpress="showToggleBrief(item)"
    >
    <div class="common-box-bd">
        <div class="title">{{item.name}}</div>
        
        <grid :show-lr-borders="false" :show-vertical-dividers="false">
            <grid-item @on-item-click="toFault" v-if="item.faultNum > 0">
                <!-- <img slot="icon" src="~assets/images/fault.png"> -->
                <badge :text="String(item.faultNum)"></badge>
            </grid-item>
        </grid>
        
    </div>
    
    </cell-box>
    <transition name="fade" mode="out-in" appear>
        <div 
            class="common-brief"
            v-show="show"
        >
            <flexbox>
                <flexbox-item><div>设备编码：<span>{{item.code}}</span></div></flexbox-item>
                <flexbox-item><div>通道数：<span>{{item.channel_num}}</span></div></flexbox-item>
            </flexbox>
            <flexbox>
                <flexbox-item><div>厂家：<span>{{item.brand}}</span></div></flexbox-item>
                <flexbox-item><div>型号：<span>{{item.model}}</span></div></flexbox-item>
            </flexbox>
        </div>
    </transition>
  </div>
</template>

<script>
import longpresscell from './longpress-cell.js'
export default longpresscell
</script>

<style lang="scss" scoped>
.common-box-bd {
    .weui-grid {
        padding: 0;
    }
}
</style>