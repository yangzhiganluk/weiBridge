export default {
    data() {
        return  {

        }
    },
    methods: {
        /**
         * @description 懒加载
         */
        setIntersection(type, data) {
            const io = new IntersectionObserver((entries)=> {
                entries.forEach((item) => { // 遍历entries数组
                    if(item.isIntersecting){ // 当前元素可见
                        this.renderChart(type, data)
                        io.unobserve(item.target)  // 停止观察当前元素 避免不可见时候再次调用callback函数
                    }   
                })
            }, {
                threshold: [0]
            })
            const current = document.getElementById(`${this.uuid}`) 
            // 监听
            io.observe(current)
        },
    }
}