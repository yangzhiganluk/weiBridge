import axios from 'axios'
//相当于 .Vue里面的data
const state = {
  count: 0,
  beseUrl: 'http://localhost:8080',
  analyseSystemUrl: 'http://www.qiaohaoba.net/experts/#/',    //服务器上
  acquisitionSystemUrl: 'http://www.qiaohaoba.net/acquisition/#/',  //服务器上
  healthSystemUrl: 'http://www.qiaohaoba.net/health/#/homePage',     // 服务器上   http://www.qiaohaoba.net/experts
  moreBridgePageUrl: 'http://www.qiaohaoba.net/health/#/moreBridgePage',  //多桥页面的路由
  imgUrl: 'http://www.qiaohaoba.net/data_acquisition/file/get/',
  // analyseSystemUrl:'http://localhost:8091/#/',
  // healthSystemUrl:'http://localhost:8082/#/',     //本地测试
  // acquisitionSystemUrl:'http://localhost:8090/#/' ,     //本地测试
  appid: 'wx91de8a67927860de',
  secret: '1d14968a56e8af26585c9514ed2da1cd',
}
//返回的数据
const getters = {
  count(state) {
    return state.count;
  },
  beseUrl(state) {
    return state.beseUrl;
  },
  analyseSystemUrl(state) {
    return state.analyseSystemUrl;
  },
  acquisitionSystemUrl(state) {
    return state.acquisitionSystemUrl;
  },
  healthSystemUrl(state) {
    return state.healthSystemUrl;
  },
  moreBridgePageUrl(state) {
    return state.moreBridgePageUrl;
  },
  imgUrl(state) {
    return state.imgUrl;
  },
  Appid(state) {
    return state.appid;
  },
  Secret(state) {
    return state.secret;
  }

}
// 接收components里面传过来的方法并提交给mutations执行
const actions = {
  sendcount: ({commit}) => {
    commit('SEND_COUNT')
  },
  initcount: ({commit}) => {
    commit('INIT_COUNT')
  },
  reducecount: ({commit}) => {
    commit('REDUCE_COUNT')
  },
  imgUrl: ({commit}, imgUrl) => {
    commit('IMGURL', imgUrl)

  },
  Appid: ({commit}, Appid) => {
    commit('APPID', Appid)
  },
  Secret: ({commit}, Secret) => {
    commit('SECRET', Secret)
  }

}
// 执行具体动作
const mutations = {
  SEND_COUNT: (state) => {
    state.count++;
  },
  INIT_COUNT: (state) => {
    state.count = 0;
  },
  REDUCE_COUNT: (state) => {
    state.count--;
  },
  IMGURL: (state, imgUrl) => {
    state.imgUrl = imgUrl;
  },
  APPID: (state, Appid) => {
    state.Appid = Appid;
  },
  SECRET: (state, Secret) => {
    state.Secret = Secret;
  },

}
export default {
  state,
  getters,
  actions,
  mutations
}
