<template>
    <!-- 拉索评估趋势图(7天) -->
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
import viewcard6 from './viewcard6.js'
export default viewcard6
</script>

<style scoped lang="scss">

</style>
