<template>
    <div>
        <!-- 桥梁名称 -->
        <div class="bridge-name">
            <divider>{{bridgeInfo.fullname}}</divider>
        </div>
        <div class="wrapper" ref="wrapper">
            <div class="content" ref="content">
                <group title="故障列表">
                        <cell-box 
                            v-for="(item, index) in loglist" 
                            :key="index" 
                            is-link
                            @click.native="toFaultLog(item.id)"
                            :link="{path:'/FaultLog', query: {id: item.id}}"
                        >
                            <div>
                                <div class="">故障时间：<span>{{item.time}}</span></div>
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
            </div>
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
