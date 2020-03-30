<template>
<!-- 桥梁总体评估趋势图(7天) -->
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
import viewcard2 from './viewcard2.js'
export default viewcard2
</script>

<style lang="scss" scoped>
.chart-wrapper {
    position: relative;
  }
  .f2-tooltip {
    -moz-box-shadow: 1px 1px 0.5px 0.5px rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: 1px 1px 0.5px 0.5px rgba(0, 0, 0, 0.3);
    box-shadow: 1px 1px 0.5px 0.5px rgba(0, 0, 0, 0.3);
    position: absolute;
    z-index: 99;
    background-color: #1890ff;
    padding: 5px;
    border-radius: 3px;
    text-align: center;
    width: 120px;
    opacity: 0;
  }
  .f2-tooltip:after {
    content: " ";
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 8px solid #1890ff;
    position: absolute;
    left: 50%;
    margin-left: -6px;
    bottom: -8px;
  }
  .f2-tooltip span {
    display: block;
    color: #fff;
  }
  .f2-tooltip span:nth-child(1) {
    font-size: 11px !important;
  }
  .f2-tooltip span:nth-child(2) {
    font-size: 13px !important;
  }
</style>
