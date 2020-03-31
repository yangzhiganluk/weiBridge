<template>
    <div>
        <!-- 桥梁名称 -->
        <div class="bridge-name">
            <divider>{{bridgeInfo.fullname}}</divider>
        </div>
        <group gutter="0">
            <x-switch title="显示已处理" :value-map="[null, true]" v-model="handleFlag" @on-change="handleSwitch"></x-switch>
        </group> 
        <div v-if="loglist.length>0">   
            <!-- <div class="wrapper" ref="wrapper">
                <div class="content" ref="content"> -->
            <BetterScroll :handlePullUp="handlePullUp" :handlePullDown="handlePullDown">
                    <group>
                            <group-title slot="title">故障列表<span style="marginLeft: 10px; color: red;">{{totalcount}}</span></group-title>
                            <cell-box 
                                v-for="(item, index) in loglist" 
                                :key="index" 
                                is-link
                                @click.native="toFaultLog(item.id)"
                            >
                                <div>
                                    <div>故障时间：<span>{{item.time}}</span></div>
                                    <div>故障说明：<span>{{item.content}}</span></div>
                                </div>
                            </cell-box>
                            <div v-if="isLoading" class="no-data">
                                <p>
                                {{loadingText}}
                                <spinner type="ripple" size="40px"></spinner>
                                </p>
                            </div>
                    </group>
            </BetterScroll>
                <!-- </div>
            </div> -->
        </div>
        <div v-else class="no-data">
            <NoData/>
        </div>    
    </div>
</template>

<script>
import faultlist from './fault-list'
export default faultlist
</script>

<style scoped lang="scss">

.wrapper {
    height: calc(100vh - 38px);
}
.weui-cell {
    font-size: 16px;
}
</style>
