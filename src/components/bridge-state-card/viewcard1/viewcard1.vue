<!--桥梁总体评估(实时)--环形图-->
<template>
  <div>
      V001
      <card>
        <div slot="content">
          <div v-if="viewcardDataFlag">
            {{scoreInfo}}
          </div>
          <div v-else></div>
        </div>
        <p slot="footer">
          {{struc.vname}}
        </p>
      </card>
  </div>
</template>

<script>
import viewcard1 from './viewcard1.js'
export default viewcard1
</script>

<style lang="scss" scoped>
@import 'viewcard1.scss'
</style>