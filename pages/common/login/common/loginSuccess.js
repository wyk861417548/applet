export default function(res){
	uni.showToast({
		title: '登录成功',
		icon: 'none'
	});
	console.log('登录成功',res);
	
	/*
		为了处理登录不同角色显示不同的功能栏
			1.登录失效前往登录页 登录成功后 uni.reLaunch 到指定页面
			2.每次进入如果登录失效 uni.reLaunch 到登陆页
	*/
	uni.reLaunch({url:"/pages/common/mine/index"})
	return;
	
	
	
	// var delta = 0//判断需要返回几层
	// let pages = getCurrentPages();
	// pages.forEach((page,index)=>{
	// 	pages[pages.length-index-1].route.split('/')
	// 	if(pages[pages.length-index-1].route.split('/')[2] == 'login'){
	// 		delta ++
	// 	}
	// })
	// uni.navigateBack({delta})
}