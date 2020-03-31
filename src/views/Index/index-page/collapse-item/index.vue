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
            <div class="common-grid">
                <div class="pull-left">
                    <img @click="toAlarm(item)" v-if="item.alarmFlag" src="~assets/images/icon/icon_alarm.png">
                </div>
                <div class="pull-right">
                    <img @click="toFault(item)" v-if="item.faultFlag" src="~assets/images/fault.png">
                </div>
            </div>
            <div class="icon-link" @click.stop="toBridgeState(item)"></div>
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
            word-break: break-all;

            text-overflow: ellipsis;    /** 可以用来多行文本的情况下，用省略号“...”隐藏超出范围的文本  **/

            display: -webkit-box; /** 必须结合的属性，将对象作为弹性伸缩盒子模型显示 **/

            -webkit-box-orient: vertical; /** 必须结合的属性，设置或检索伸缩盒对象的子元素的排列方式 **/

            -webkit-line-clamp: 2; /** 显示的行数 **/

            overflow: hidden;  /** 隐藏超出的内容 **/

            width: 50%;
       }
      .weui-grid {
        padding: 0 10px;
      }
      .common-grid {
          width: 100px;
          padding: 0 10px;
          div {
            width: 28px;
            height: 28px;
            img {
                display: block;
                width: 100%;
                height: 100%;
                vertical-align: middle;
            }
          }
      }
    }
</style>