<template>
    <!-- 传感器状态-类型(实时) -->
    <div>
        <card>
            <p slot="header"><divider>{{struc.vname}}</divider></p>
            <div slot="content">
                <div v-if="viewcardDataFlag">
                    <canvas :id="uuid" height="200"></canvas>
                </div>
                 <div v-else class="no-data">
                    <p>
                    暂无数据
                    <spinner type="ripple" size="40px"></spinner>
                    </p>
                </div>
            </div>
        </card>
    </div>
</template>

<script>
import viewcard4 from './viewcard4.js'
export default viewcard4
</script>

<style scoped lang="scss">

</style>
