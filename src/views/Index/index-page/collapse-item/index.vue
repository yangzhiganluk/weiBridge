<template>
  <div>
    <cell-box 
        v-longpress="showToggleBrief(item)"
    >
        <div v-if="item.pcode" class="common-box-hd">
            <img :src="imgUrl + item.pcode" alt="">
        </div>
        <div class="common-box-bd">
            <div class="title">{{item.project_name}}</div>
            <grid :show-lr-borders="false" :show-vertical-dividers="false">
                <grid-item @on-item-click="toAlarm" v-if="item.alarmFlag">
                <img slot="icon" src="~assets/images/alarm.png">
                </grid-item>
                <grid-item @on-item-click="toFault" v-if="item.faultFlag">
                <img slot="icon" src="~assets/images/fault.png">
                </grid-item>
            </grid>
            <div class="icon-link"  @click.stop="toBridgeState(item)"></div>
        </div>
        
    </cell-box>
    <transition name="fade" mode="out-in" appear>
        <div 
        class="common-brief"
        v-show="show"
        >
        <flexbox>
            <flexbox-item><div>桥梁编码：<span>{{item.code}}</span></div></flexbox-item>
            <flexbox-item><div>桥梁编码：<span>{{item.tpye}}</span></div></flexbox-item>
        </flexbox>
        <flexbox>
            <flexbox-item><div>桥梁编码：<span>{{item.address}}</span></div></flexbox-item>
        </flexbox>
        <flexbox>
            <flexbox-item><div>经度：<span>{{item.lat}}</span></div></flexbox-item>
            <flexbox-item><div>纬度：<span>{{item.lng}}</span></div></flexbox-item>
        </flexbox>
        </div>
    </transition>
  </div>
</template>

<script>
import collapseitem from './collapse-item.js'
export default collapseitem
</script>

<style lang="scss" scoped>

    .common-box-bd {
       .title {
        width: 50%;
       }
      .weui-grid {
        padding: 20px 10px;
      }
    }
</style>