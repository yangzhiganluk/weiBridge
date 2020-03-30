<template>
    <div>
        <!-- 桥梁名称 -->
        <div class="bridge-name">
            <divider>{{bridgeInfo.fullname}}</divider>
        </div>
        <divider>告警处理详情</divider>
        <div v-if="logInfo">
            <group gutter="0">
                <cell-box>
                    <div class="alarm-log">
                        <h4>{{logInfo.name}}--{{logInfo.dataItemName}}--{{logInfo.dataItemCode}}</h4>
                        <p>告警级别：<span>{{logInfo.level}}</span></p>
                        <p>阈值范围：<span>{{logInfo.thresholdRange}}</span></p>
                        <p>告警内容：<span>{{logInfo.content}}</span></p>
                        <p>告警值：<span>{{logInfo.value | number}}</span></p>
                        <p>故障发生时间：<span>{{logInfo.time}}</span></p>
                    </div>
                </cell-box>
                <x-textarea 
                    title="告警处理" 
                    :show-counter="false" 
                    :rows="6"
                    :value="logInfo.handleContent"
                    :readonly="true"
                ></x-textarea>
            </group>
            
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
import alarmlogreadonly from './alarm-log-readonly.js';
export default alarmlogreadonly
</script>

<style scoped lang="scss">
.alarm-log {
    line-height: 24px;
    h4 {
        margin-bottom: 10px;
    }
    p {
        font-size: 14px;
        font-weight: 600;
        span {
            font-weight: 500;
        }
    }
}
</style>
