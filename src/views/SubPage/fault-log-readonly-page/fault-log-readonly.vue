<template>
    <div>
        <!-- 桥梁名称 -->
        <div class="bridge-name">
            <divider>{{bridgeInfo.fullname}}</divider>
        </div>
        <group v-if="faultLogInfo" :title="faultLogInfo.name">
            <cell-box>
                <div>
                    <div>故障发生时间：<span>{{faultLogInfo.time}}</span></div>
                    <div>故障说明：<span>{{faultLogInfo.content}}</span></div>
                    <div>故障恢复时间：<span>{{faultLogInfo.recover_time}}</span></div>
                    <div>故障处理人：<span>{{faultLogInfo.handleUser}}</span></div>
                    <div>故障处理时间：<span>{{faultLogInfo.handleTime}}</span></div>
                </div>
            </cell-box>
            <x-textarea 
                title="故障原因" 
                :show-counter="false" 
                :rows="6"
                :value="faultLogInfo.handleContent"
                :readonly="true"
            ></x-textarea>
        </group>
    </div>
</template>

<script>
import faultlogreadonly from './fault-log-readonly.js';
export default faultlogreadonly
</script>

<style scoped lang="scss">

</style>
