<template>
    <div>
        <!-- 桥梁名称 -->
        <div class="bridge-name">
            <divider>{{bridgeInfo.fullname}}</divider>
        </div>
        <group :title="name">
            <cell-box>
                <div>
                    <div>故障时间：<span>{{time}}</span></div>
                    <div>故障说明：<span>{{content}}</span></div>
                </div>
            </cell-box>
            <x-textarea 
                title="故障原因" 
                placeholder="请填写故障原因" 
                :show-counter="false" 
                :rows="6"
                v-model="handleContent"
                ref="handleContentRef"
            ></x-textarea>
        </group>
        <box gap="10px 60px">
            <x-button :gradients="['#1D62F0', '#19D5FD']" style="border-radius:99px;" @click.native="checkHandleFault">提交</x-button>
        </box>
    </div>
</template>

<script>
import faultlog from './fault-log'
export default faultlog
</script>

<style scoped lang="scss">

</style>
