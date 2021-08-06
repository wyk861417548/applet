export default function(result){
	uni.showToast({
		title: '登录成功',
		icon: 'none'
	});
	console.log('登录成功',result);
	
	var delta = 0//判断需要返回几层
	
	let pages = getCurrentPages();

	pages.forEach((page,index)=>{
		pages[pages.length-index-1].route.split('/')
		if(pages[pages.length-index-1].route.split('/')[2] == 'login'){
			delta ++
		}
	})

	uni.navigateBack({delta})
}