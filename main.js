import Vue from 'vue'
import App from './App'
import store from './store/index.js'
import config from './common/config.js';
import cloud from './common/cloud.js';
import validator from './common/validator.js';

// 引入全局uView
import uView from 'uview-ui';
Vue.use(uView);


Vue.config.productionTip = false

Vue.prototype.$config = config;
Vue.prototype.$cloud = cloud;
Vue.prototype.$validator = validator;

App.mpType = 'app'

/** 
 * 页面跳转  
 *    如果设置data-url 使用路由地址跳转 （onload(param)接受参数，地址栏上可见参数）
 * */
Vue.prototype.$skip = (e)=>{
	console.log("e",e);
	var url = e.currentTarget.dataset.url;
	if(!url)return;
	uni.navigateTo({url:url})
}

const app = new Vue({
	...App,
	store
})

app.$mount()
