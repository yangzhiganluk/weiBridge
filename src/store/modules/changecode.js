
const state = {
	code:0

}
//返回的数据
const getters = {
   code(state){
        return state.code;
    }
}
// 接收components里面传过来的方法并提交给mutations执行
const actions = {
    changecode:({commit})=>{
        commit('CHANGE_CODE')
    },
    changecode1:({commit})=>{
        commit('CHANGE_CODE1')
	},
}
// 执行具体动作
const mutations = {
	CHANGE_CODE:(state)=>{
        state.code=1;
    },
    CHANGE_CODE1:(state)=>{
        state.code=2;
	},
}
export default {
	state,
	getters,
	actions,
	mutations
}
