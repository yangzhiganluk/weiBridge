<template>
    <!-- 传感器状态-位置(实时) -->
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
import viewcard10 from './viewcard10.js'
export default viewcard10
</script>

<style scoped lang="scss">

</style>
