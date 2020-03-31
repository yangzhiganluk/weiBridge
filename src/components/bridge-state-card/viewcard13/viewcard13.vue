<template>
    <!-- 查询传感器状态 -->
    <div>
        <card>
            <p slot="header"><divider>{{struc.vname}}</divider></p>
            <div slot="content">
                <div v-if="viewcardDataFlag">
                    <canvas :id="uuid" height="200"></canvas>
                </div>
                 <div v-else class="no-data">
                    <NoData/>
                </div>
            </div>
        </card>
    </div>
</template>

<script>
import viewcard13 from './viewcard13.js'
export default viewcard13
</script>

<style scoped lang="scss">

</style>
