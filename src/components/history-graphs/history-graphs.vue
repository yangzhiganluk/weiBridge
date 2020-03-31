<template>
    <div>
        <group title="选择时间粒度">
            <popup-radio title="历史数据曲线" 
                :options="options" 
                v-model="timeType"
                @on-change="selectTimeType"
            >
                <p slot="popup-header" class="radio-header">请选择时间粒度</p>
            </popup-radio>
        </group>
        <div>
            <canvas :id="uuid" height="300"></canvas>
        </div>
    </div>
</template>

<script>
import HistoryGraphs from './history-graphs.js';
export default HistoryGraphs
</script>

<style scoped lang="scss">
    .radio-header {
        text-align: center;
        padding: 8px 0;
        color: #888;
    }
</style>
