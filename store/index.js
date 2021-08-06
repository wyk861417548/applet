import user from '@/store/modules/user.js'

import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	modules: {
		user
	},
	strict: true
})

export default store