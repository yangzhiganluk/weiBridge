<template>
    <div>
        <!-- 桥梁名称 -->
        <div class="bridge-name">
            <divider>{{bridgeInfo.fullname}}</divider>
        </div>
        <group :title="name">
            <cell-box>
                <div>
                    <div class="">故障时间：<span>{{time}}</span></div>
                    <div>故障说明：<span>{{content}}</span></div>
                </div>
            </cell-box>
            <x-textarea 
                title="故障原因" 
                :show-counter="false" 
                :rows="6"
                :value="handleContent"
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
