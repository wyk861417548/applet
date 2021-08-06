import {mapMutations} from 'vuex';
import loginSuccess from './loginSuccess.js';
let mixin = {
	methods:{
		...mapMutations({
			setUserInfo: 'user/login'
		}),
		// 这个方法给外部成功登陆调用的
		loginSuccess(result){
			// 这个是loginSuccess的方法
			loginSuccess(result)
			delete result.userInfo.token
			// 登陆成功的状态存入vuex
			this.setUserInfo(result)
		}
	}
}
export default mixin