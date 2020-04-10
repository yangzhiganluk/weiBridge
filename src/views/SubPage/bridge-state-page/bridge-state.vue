<template>
    <div>
       <switch-tab :bridgeInfo="bridgeInfo"/>
       <div class="panel-content">
            <ul v-if="projectViewCard && projectViewCard.length > 0">
                <li class="viewcard" v-for="(item, index) in projectViewCard" :key="index">
                    <component :is="item.cardname" :bridgeInfo="bridgeInfo" :struc="item"/>
                </li>
            </ul>
       </div>
    </div>
</template>

<script>
import bridgestate from './bridge-state'
export default bridgestate
</script>

<style scoped lang="scss">

</style>
