'use strict';

let uniID = require('uni-id');
const db = uniCloud.database();
exports.main = async (event, context) => {
  uniID = uniID.createInstance({
    context
  })
 /*
 1.event为客户端 uniCloud.callFunction填写的data的值，这里介绍一下其中的属性
   action：表示要执行的任务名称、比如：登陆login、退出登陆 logout等
   params：业务数据内容
   uniIdToken：系统自动传递的token，数据来源客户端的 uni.getStorageSync('uni_id_token')
 */
	/*
	2.在某些操作之前我们要对用户对身份进行校验（也就是要检查用户的token）再将得到的uid写入params.uid
	  校验用到的方法是uniID.checkToken 详情：https://uniapp.dcloud.io/uniCloud/uni-id?id=checktoken
	
	  讨论，我们假设一个这样的场景，代码如下。
	  如：
		uniCloud.callFunction({
			name:"xxx",
			data:{
				"params":{
					uid:"通过某种方式获取来的别人的uid"
				}
			}
		})
	  用户就这样轻易地伪造了他人的uid传递给服务端，有一句话叫：前端从来的数据是不可信任的
	  所以这里我们需要将uniID.checkToken返回的uid写入到params.uid
	*/
  let params = event.params || {}
	
  let payload = {}
	
	// 返回正确的code
	let code = {code:0}
	
	
	// 这些请求是不需要token的
  let noCheckAction = ['register', 'checkToken', 'encryptPwd', 'login', 'loginByWeixin', 'sendSmsCode',
    'setVerifyCode', 'loginBySms', 'code2SessionWeixin' 
  ]

  if (noCheckAction.indexOf(event.action) === -1) {
    if (!event.uniIdToken) {
      return {
        code: 403,
        msg: '缺少token'
      }
    }
		// 用于校验token是否失效
		payload = await uniID.checkToken(event.uniIdToken)
		
		console.log("payload",payload);
		
		if (payload.code && payload.code > 0) {
			return payload
		}
    
    params.uid = payload.uid
  }
	
	console.log("uid",params);
  let res = {}
	

  switch (event.action) {
		// 注冊
    case 'register': {
      const {
        username,
        password,
        needPermission
      } = params
      res = await uniID.register({
        username,
        password,
        needPermission,
				role:'user'
      });
      break;
    }
		// 登录
    case 'login': {
      const {
        username,
        password,
        needPermission
      } = params
      res = await uniID.login({
        username,
        password,
        needPermission,
				role:'user',
        // 不指定queryField的情况下只会查询username
        queryField: ['username', 'email', 'mobile','role']
      });
      break;
    }
		// 退出登录
    case 'logout':
      res = await uniID.logout(event.uniIdToken);
      break;
		// 获取用户信息
		case 'getUserInfo': {
		  const {uid} = params
		  res = await uniID.getUserInfo({
		    uid
		  });
		  break;
		}
		// 新增地址
		case "setAddress":{
			// 每次新增地址 把其他的默认地址设置非默认地址
			await db.collection('address').where({isDefault:true,uid:params.uid}).update({isDefault:false})
			await db.collection('address').add(params).then((json)=>{
				if(json.id){
					res = code
				}
			})
			break;
		}
		// 设置默认地址
		case "setDefalutAddress":{
			// 每次设置默认地址 把其他的默认地址设置非默认地址
			await db.collection('address').where({isDefault:true,uid:params.uid}).update({isDefault:false})
			await db.collection('address').doc(event._id).update({isDefault:true}).then(json=>{
				res = Object.assign(code,json)
			});
			break;
		}
		
		// 获取地址 根据条件不同 获取多个或者单个
		case "getAddress":{
			await db.collection('address').where(params).get().then(json=>{
				res = Object.assign(code,json)
			});
			break;
		}
		// 更新地址
		case "updateAddress":{
			if(params.isDefault){
				await db.collection('address').where({isDefault:true,uid:params.uid}).update({isDefault:false})
			}
			await db.collection('address').doc(event._id).update(params).then(json=>{
				res = Object.assign(code,json)
			});
			break;
		}
		// 删除地址
		case "removeAddress":{
			await db.collection('address').doc(event._id).remove().then(json=>{
				res = Object.assign(code,json)
			});
			break;
		}
		// 新增商品类别
		case "addCategory":{
			await db.collection('good').add(params).then((json)=>{
				if(json.id){
					res = code
				}
			})
			break;
		}
		// 获取商品类别
		case "getCategory":{
			console.log("action",event);
			await db.collection('good').get().then((json)=>{
				console.log("json",json);
				res = Object.assign(code,json)
			})
			break;
		}
		// 删除商品类别
		case "removeCategory":{
			
		}
		
		// 新增商品
		case "addGood":{
			await db.collection('good').doc(event._id).update({
				child:db.command.push([params])
			}).then((json)=>{
				console.log("json",json);
				res = Object.assign(code,json)
			})
			break;
		}
		
		//新增商品到购物车
		case "setCart":{
			let data = await db.collection('cart').where({id:params.id}).get();
			console.log("setCart",db.collection('good').doc(params.id),data);
			if(data.affectedDocs == 0){
				await db.collection('cart').add(params).then((json)=>{
					if(json.id){
						res = code
					}
				})
			}else{
				await db.collection('cart').where({id:params.id}).update({
					num:data.data[0].num+1
				}).then((json)=>{
					res = Object.assign(code,json)
				})
			}
			
			break;
		}
		
		//获取购物车商品信息
		case "getCart":{
			await db.collection('cart').get().then((json)=>{
				console.log("json",json);
				res = Object.assign(code,json)
			})
			break;
		}
		
		//从购物车中删除某商品
		case "reduceCart":{
			let data = await db.collection('cart').where({id:params.id}).get();
			console.log("setCart",db.collection('good').doc(params.id),data);
			if(data.data[0].num==1){
				await db.collection('cart').doc(data.data[0]._id).remove().then(json=>{
					res = Object.assign(code,json)
				});
			}else{
				await db.collection('cart').where({id:params.id}).update({
					num:data.data[0].num-1
				}).then((json)=>{
					res = Object.assign(code,json)
				})
			}
			break;
		}
		
		//清空购物车
		case "removeCart":{
			let data = await db.collection('cart').get();
			
			data.data.map(async(item) => {
				console.log('removeCart',item._id);
			  return await db.collection('cart').doc(item._id).remove();
			});
			
			res = await Object.assign(code)
			
			break;
		}
		
		// 创建订单
		case "setOrder":{
			// 每次设置默认地址 把其他的默认地址设置非默认地址
			await db.collection('order').add(params).then((json)=>{
				res = Object.assign(code,json)
			})
			break;
		}
		
		case "getOrderOne":{
			await db.collection('order').where({id:params.id}).get().then((json)=>{
				res = Object.assign(code,json)
			})
			break;
		}
		
		case "getOrder":{
			await db.collection('order').get().then((json)=>{
				res = Object.assign(code,json)
			})
			break;
		}
		
    default:
      res = {
        code: 404,
        msg: 'NOT_FOUND'
      }
      break;
  }

  //返回数据给客户端
  return res
};
