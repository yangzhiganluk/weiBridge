import axios from 'axios'
//相当于 .Vue里面的data
const state = {
    rolename:'',
    qxcode:''

}
//返回的数据
const getters = {
    rolename(state){
        return state.rolename;
    },
    qxcode(state){
        return state.qxcode;
    }
}
// 接收components里面传过来的方法并提交给mutations执行
const actions = {
	sendrolename:({commit},name)=>{
        commit('SEND_ROLENAME',name)
    },
    sendqx:({commit},code)=>{
        commit('SEND_QX',code)
        // console.log(code)
    }

}
// 执行具体动作
const mutations = {
	SEND_ROLENAME:(state,name)=>{
        state.rolename=name;
    },
    SEND_QX:(state,code)=>{
        state.qxcode=code;
    }
}
export default {
	state,
	getters,
	actions,
	mutations
}
