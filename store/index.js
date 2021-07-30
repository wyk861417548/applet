import Vue from 'vue'
import Vuex from 'vuex'

// uni-app没有cookie  所以使用vuex和本地缓存的方式实现 保持cookie

Vue.use(Vuex)

//数据存储键值
const localKey = 'USER';

let state = {
	// 用户信息（登录之后获取）
	userinfo:false,
	
	// 用户状态
	userstatus:null,
	
	// 门店信息或者代理商信息
	store:null,
	
	// 购物车状态
	cartStatus:false,
	
	// 订单状态
	orderStatis:false,
	
	// token令牌
	token:'',
	
	// 跳转地址
	jumpUrl:"",

}

//存储状态数据
let saveState = function(state,boolen){
	uni.setStorage({
		key: localKey,
		data: JSON.stringify(state),
		success: function () {
			// 退出
			if(boolen){
				uni.reLaunch({
				   url:"/pages/login/loginwx?edit=true"
				});
			}
		}
	});
}


//初始化状态数据
let initState = function(){
	
	let localData = uni.getStorageSync(localKey);
		
	let tempData = localData ? JSON.parse(localData) : {};
	
	for(var i in tempData){
		state[i] = tempData[i];
	}
	
	
	return state;
}

const store = new Vuex.Store({
	state:initState(),
	
	mutations:{
		// 用户登录
		userLogin(state,userinfo){
			state.userinfo = userinfo;
			saveState(state);
		},
		
		// 用户账号状态
		userStatus(state,userstatus){
			state.userstatus = userstatus;
			saveState(state);
		},
		
		// 用户退出登录
		userRegister(state){
			state = {};
			saveState(state,true);
		},
		
		// 设置token
		setToken(state,token){
			state.token = token;
			saveState(state);
		},
		
		// 设置跳转地址
		setLoginJumpUrl(state,url){
			state.jumpUrl = url;
			saveState(state);
		},
		
		// 设置门店信息 或者代理商信息
		setStore(state,store){
			state.store = store;
			saveState(state);
		},
		
		// 修改购物车状态
		changeCartStatus(state,boolen){
			state.cartStatus = boolen;
			saveState(state);
		},
		
		// 修改订单状态
		changeOrderStatus(state,boolen){
			state.orderStatis = boolen;
			saveState(state);
		}
	},
	
	getters:{
		// 获取token
		token:(state)=>{
			return state.token;
		}
	}
})

export default store