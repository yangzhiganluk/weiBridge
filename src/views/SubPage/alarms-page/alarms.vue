<template>
    <div>
       <switch-tab :bridgeInfo="bridgeInfo"></switch-tab>
       
            
            <group gutter="0">
                <x-switch title="显示已处理" :value-map="[null, true]" v-model="handleFlag" @on-change="handleSwitch"></x-switch>
            </group> 
        <div v-if="loglist.length>0">   
            <BetterScroll :handlePullUp="handlePullUp" :handlePullDown="handlePullDown">
                <group>
                    <group-title slot="title">告警信息<span style="marginLeft: 10px; color: red;">{{totalcount}}</span></group-title>
                    <cell-box 
                        v-for="(item, index) in loglist" 
                        :key="index" 
                        is-link
                        :link="handleFlag ? {path:'/AlarmLogReadonly', query: {id: item.id}} : {path:'/AlarmLog', query: {id: item.id}}"
                    >
                        <div class="alarm-item">
                            <div>传感器名称：<span>{{item.name}}</span></div>
                            <div>数据项名称：<span>{{item.dataItemName}}</span></div>
                            <div>告警级别：<span>{{item.level}}</span></div>
                            <div>阈值范围：<span>{{item.thresholdRange}}</span></div>
                            <div>告警值：<span>{{item.value | number}}</span></div>
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
        </div>
        <div v-else class="no-data">
            <p>
                没有数据
            <spinner type="ripple" size="40px"></spinner>
            </p>
        </div>
    </div>
</template>

<script>
import alarms from './alarms'
export default alarms
</script>

<style scoped lang="scss">
.wrapper {
    height: calc(100vh - 163px);
}
.check-box {
    justify-content: space-between;
}
.weui-cell {
    font-size: 16px;
}
.alarm-item {
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;;
    span {
        font-size: 14px;
        font-weight: 500;
    }
}
</style>
