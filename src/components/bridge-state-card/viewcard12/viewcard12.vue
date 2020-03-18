<template>
    <!-- 系统工作状态 -->
    <div>
        <card>
            <p slot="header"><divider>{{struc.vname}}</divider></p>
            <div slot="content">
                <div v-if="viewcardDataFlag">
                    <v-calendar 
                        class="view-calendar"
                        is-expanded
                        :attributes='attrs'
                        :max-date='new Date()'
                        @update:from-page="pageChanged"
                    />
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
import viewcard12 from './viewcard12.js'
export default viewcard12
</script>

<style scoped lang="scss">
.vc-border {
    border: none;
}
</style>
