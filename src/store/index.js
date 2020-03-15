import Vue from  'vue'
import Vuex from 'vuex'
import getters from './getters'
import actions from './actions'
import getusername from "./modules/getusername"
import getmsgcount from "./modules/getmsgcount"
import changecode from "./modules/changecode"
import viewcard from "./modules/viewcard"
Vue.use(Vuex);

export default new Vuex.Store({
	getters,
	actions,
	modules:{
		getusername,
		getmsgcount,
		changecode,
		viewcard
	}
})