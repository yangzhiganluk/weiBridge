<template>
<!-- 桥梁总体评估(实时) -->
  <div>
      <card>
        <p slot="header">
          <divider>{{struc.vname}}</divider>
        </p>
        <div slot="content">
          <div v-if="viewcardDataFlag"  class="viewcard-content">
            <flexbox style="width: 100%; height: 100%;">
              <flexbox-item style="height: 100%;">
                <div class="circle-bg">
                  <img src="~assets/images/circle_10s.png" alt="">
                </div>
                <div class="circle-txt">
                  <h4 class="score">{{scoreInfo}}</h4>
                  <p class="name">桥梁主体</p>
                </div>
              </flexbox-item>
              <flexbox-item style="height: 100%;" v-if="weightInfo.length>0">
                <ul class="weight-list">
                  <li v-for="(item, index) in weightInfo" :key='index'>
                    <span class="name">{{item.name}}</span>
                    <span class="score">{{item.scoreBean}}</span>
                  </li>
                </ul>
              </flexbox-item>
            </flexbox>
          </div>
          <div v-else class="no-data">
            <NoData/>
          </div>
        </div>
        
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