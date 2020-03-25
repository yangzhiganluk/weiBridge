<template>
   <div class="wrapper" ref="wrapper">
            <div class="content" ref="content">
               <slot></slot>
            </div>
        </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
    props: {
        handlePullUp: {
            type: Function,
            default: function() {},
        },
        handlePullDown: {
            type: Function,
            default: function() {}
        }
    },
    mounted() {
        this.initScroll()
    },
    methods: {
        initScroll() {
            const scope = this;
            scope.scroll = new BScroll(scope.$refs.wrapper, {
                tap: true,
                click: true,
                probeTybe: 1,
                bounceTime:700,      //回弹时间
                pullUpLoad: {
                    threshold: 50    
                },
                pullDownRefresh:{
                    stop: 20,
                    threshold: 50  
                },
                useTransition:false  // 防止iphone微信滑动卡顿
            });
            if (this.$refs.content) {
                if (this.$refs.wrapper instanceof window.SVGElement) {
                    let rect = this.$refs.wrapper.getBoundingClientRect();
                    this.$refs.content.style.minHeight = `${rect.height + 1}px`
                } else {
                    this.$refs.content.style.minHeight = `${this.$refs.wrapper.offsetHeight + 1}px`
                }
            }
            scope.scroll.on('pullingUp', (pos)=> {
                scope.handlePullUp();
                scope.$nextTick(() => {
                    scope.scroll.refresh() // DOM 结构发生变化后，重新初始化BScroll
                })
                scope.scroll.finishPullUp() // 下拉刷新动作完成后调用此方法告诉BScroll完成一次上拉动作
            })
            scope.scroll.on('pullingDown', (pos)=> {
                scope.handlePullDown();
                scope.$nextTick(() => {
                    scope.scroll.refresh() // DOM 结构发生变化后，重新初始化BScroll
                })
                scope.scroll.finishPullDown() // 上拉加载动作完成后调用此方法告诉BScroll完成一次下拉动作
            })
        },
    }
}
</script>

<style scoped>
 .wrapper {
    overflow: hidden;
  }
</style>