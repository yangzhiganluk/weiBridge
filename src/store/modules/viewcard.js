
const state = {
    allAccessType: [],  //所有的评估类型
    viewcardDataFlag: false,    //没有匹配视图数据
}
//返回的数据
const getters = {
    allAccessType(state) {
        return state.allAccessType;
    },
    viewcardDataFlag(state) {
        return state.viewcardDataFlag
    }
}
// 接收components里面传过来的方法并提交给mutations执行
const actions = {
    getAllAccessType:({commit}, allAccessType)=>{
        commit('GET_ALL_ACCESS_TYPE', allAccessType)
    },
    setViewCardDataFlag:({commit}, viewcardDataFlag)=>{
        commit('SET_VIEW_CARD_DATA_FLAG', viewcardDataFlag)
    },
}
// 执行具体动作
const mutations = {
	GET_ALL_ACCESS_TYPE: (state, allAccessType)=> {
        state.allAccessType = allAccessType;
    },
    SET_VIEW_CARD_DATA_FLAG: (state, viewcardDataFlag)=> {
        state.viewcardDataFlag = viewcardDataFlag;
    }
}
export default {
	state,
	getters,
	actions,
	mutations
}
