
//云函数请求封装
/**
 * @param {Object} data
 * 		name: 云函数名称
 * 		action:使用依赖uni-id的， 自定义名称
 * 		params:请求参数
 * 		fail:错误消息
 */
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
				name: data.name,
				data: {
					action: data.action,
					params: data.params
				},
				
				success(res) {
					let data = res.result;
					if(data.code == 0){
						resolve(data);
					}
					uni.showToast({title:data.message?data.message:"请稍后再试",icon:"none"})
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