<template>
    <!-- 系统工作状态 -->
    <div>
        <card>
            <p slot="header"><divider>{{struc.vname}}</divider></p>
            <div slot="content" :id="uuid">
                <div v-if="viewcardDataFlag">
                    <v-calendar 
                        is-expanded
                        :attributes='attrs'
                        :max-date='new Date()'
                        @update:from-page="pageChanged"
                    />
                </div>
                 <div v-else class="no-data">
                    <NoData/>
                </div>
            </div>
        </card>
    </div>
</template>

<script>
import viewcard12 from './viewcard12.js'
export default viewcard12
</script>

<style scoped lang="scss">
.weui-panel {
    overflow: visible;
}
.vc-border {
    border: none;
}
</style>
