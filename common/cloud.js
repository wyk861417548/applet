
//云函数请求封装
/**
 * @param {Object} data
 * 		name: 云函数名称
 * 		action:使用依赖uni-id的， 自定义名称
 * 		params:请求参数
 * 		fail:错误消息
 */

// 其他错误  以及token过期处理
function handle(res){
	// 未登录  或者token过期
	let code = [30203,30202,403];
	
	if(code.indexOf(res.code) !== -1 ){
		var content = '抱歉由于您未登录或者登录状态过期，请重新授权登录';
		uni.showModal({
		    title: '提示',
		    content: content,
				showCancel:false,
		    success: function (res) {
					if (res.confirm) {
						uni.navigateTo({url:"/pages/common/login/login"})
					}
		    }
		});
		return;
	}
	uni.showToast({title:res.message?res.message:"请稍后再试",icon:"none"})
  
}
// 用于记录同时发送请求次数，用于处理
let ajaxTimes = 0;

export default  {
	cloudFn(data){
		console.log("data",data);
		if(++ajaxTimes == 1 ){
			uni.showLoading({mask: true,title:"加载中..."});
		}
		
		return new Promise((resolve,reject)=>{
			uniCloud.callFunction({
				name: data.name?data.name:'uni-id-login',
				data: {
					action: data.action,
					params: data.params,
					uniIdToken:uni.getStorageSync('uni_id_token')
				},
				
				success(res) {
					let data = res.result;
					if(data.code == 0){
						resolve(data);
					}else{
						handle(data)
					}
				},
				
				fail(e) {
					console.error('error',e)
					uni.showModal({
						showCancel: false,
						content: data.fail
					})
				},
				
				complete(){
					if(--ajaxTimes == 0 ){
						uni.hideLoading();
					}
				}
				
			})
		})
	}
}