export default{
	//地址参数 对象合成
	httprequestquery(list){
		let str = "?";
		
		let params = [];
	
		for(let i in list){
			params.push(i + "=" + encodeURIComponent(list[i]));
		}
	
		return params.length>0 ? str + params.join("&") : '';
	},
	
	// 电话号码截取替换
	stringReg(str){
		return str?str.slice(0,3) + "****" + str.slice(8):'';
	},
	
	//获取当前页面的路由地址
	getRouter(){
		let pages = getCurrentPages();
		let router = pages[ pages.length-1 ].route;
		
		return router;
	},
	
	//日期格式转换
	dateformat(date,fmt){
		let _date = date ? date : new Date();
		console.log("data",date);
		let cNumber=["日","一","二","三","四","五","六"];
		
		let o = {
			"M+": _date.getMonth() + 1, //月份 
			"d+": _date.getDate(), //日 
			"h+": _date.getHours(), //小时 
			"m+": _date.getMinutes(), //分 
			"s+": _date.getSeconds(), //秒
			'w+': cNumber[_date.getUTCDay()], //星期
			"q+": Math.floor((_date.getMonth() + 3) / 3), //季度 
			"S": _date.getMilliseconds() //毫秒 
		};
		
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (_date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (let k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	},
}