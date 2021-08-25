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
			await db.collection('good').get().then((json)=>{
				console.log("json",json);
				res = Object.assign(code,json)
			})
			break;
		}
		// 新增商品类别
		case "removeCategory":{
			
		}
		
		// 新增商品
		case "addGood":{
			await db.collection('good').doc(event._id).update(params).then((json)=>{
				if(json.id){
					res = code
				}
			})
			break;
		}
		
		case 'updatePwd': {
		  const {
		    uid,
		    oldPassword,
		    newPassword
		  } = params
		  res = await uniID.updatePwd({
		    uid,
		    oldPassword,
		    newPassword
		  });
		  break;
		}
		
    case 'setAvatar': {
      const {
        uid,
        avatar
      } = params
      res = await uniID.setAvatar({
        uid,
        avatar
      });
      break;
    }
		
    case 'bindMobile': {
      const {
        uid,
        mobile,
        code
      } = params
      res = await uniID.bindMobile({
        uid,
        mobile,
        code
      });
      break;
    }
		
    case 'unbindMobile': {
      const {
        uid,
        mobile,
        code
      } = params
      res = await uniID.unbindMobile({
        uid,
        mobile,
        code
      });
      break;
    }
		
    case 'code2SessionWeixin': {
      const {
        code
      } = params
      res = await uniID.code2SessionWeixin({
        code
      });
      break;
    }
    case 'loginByWeixin': {
      const {
        code
      } = params
      res = await uniID.loginByWeixin({
        code
      });
      break;
    }
    case 'bindWeixin': {
      const {
        uid,
        code
      } = params
      res = await uniID.bindWeixin({
        uid,
        code
      });
      break;
    }
    case 'unbindWeixin':
      res = await uniID.unbindWeixin(params.uid);
      break;
    case 'checkToken':
      // 注意3.0.0版本取消了checkToken接口返回的用户信息
      res = await uniID.checkToken(event.uniIdToken, {
        needPermission: true
      })
      break;
    case 'resetPwd':
      res = await uniID.resetPwd({
        uid: params.uid,
        password: '123456'
      });
      break;
    case 'encryptPwd':
      const password = await uniID.encryptPwd('123456');
      res = {
        code: 0,
        msg: '密码加密完成',
        password
      }
      break;
    case 'sendSmsCode': {
			/* -开始- 测试期间，为节约资源。统一虚拟短信验证码为： 123456；开启以下代码块即可  */
				return uniID.setVerifyCode({
					mobile: params.mobile,
					code: '123456',
					type: params.type
				})
			/* -结束- */
      const {
        mobile,
        code, // 实际项目中code应由云端生成，这里为了方便演示由客户端上传
        type
      } = params
      const templateId = '00000' + Math.floor(Math.random() * 1000000);
      if (templateId === '') {
        throw new Error('sendSmsCode接口需要传入templateId来指定所使用的短信模板')
      }
      res = await uniID.sendSmsCode({
        mobile,
        code, // sendSmsCode接口不传code时会自动生成code，推荐不传code
        type,
        templateId
      });
      break;
    }
    case 'setVerifyCode': {
      const {
        mobile,
        code,
        type
      } = params
      res = await uniID.setVerifyCode({
        mobile,
        code,
        type
      });
      break;
    }
    case 'loginBySms': {
      const {
        mobile,
        code
      } = params
      res = await uniID.loginBySms({
        mobile,
        code
      });
      break;
    }
		// 更新用户信息
    case 'updateUser': {
      const {
        uid,
        nickname
      } = params
      res = await uniID.updateUser({
        uid,
        nickname
      });
      break;
    }
    case 'setUserInviteCode': {
      const {
        uid,
        // myInviteCode 不指定myInviteCode，自动获取
      } = params
      res = await uniID.setUserInviteCode({
        uid
      });
      break;
    }
    case 'addRole': {
      const {
        roleID,
        roleName,
        comment,
        permission
      } = params
      res = await uniID.addRole({
        roleID,
        roleName,
        comment,
        permission
      });
      break;
    }
    case 'getRoleList': {
      const {
        offset,
        limit,
        needTotal
      } = params
      res = await uniID.getRoleList({
        offset,
        limit,
        needTotal
      });
      break;
    }
    case 'addPermission': {
      const {
        permissionID,
        permissionName,
        comment
      } = params
      res = await uniID.addPermission({
        permissionID,
        permissionName,
        comment
      });
      break;
    }
    case 'getPermissionList': {
      const {
        offset,
        limit,
        needTotal
      } = params
      res = await uniID.getPermissionList({
        offset,
        limit,
        needTotal
      });
      break;
    }
    case 'getRoleByUid': {
      const {
        uid
      } = params
      res = await uniID.getRoleByUid({
        uid
      });
      break;
    }
    case 'bindRole': {
      const {
        roleList,
        // 设置reset为true，整体覆盖。设置为false时增量更新role
        reset,
      } = params
      res = await uniID.bindRole({
        roleList,
        reset,
      });
      break;
    }
    case 'bindPermission': {
      const {
        roleID,
        permissionList,
        // 设置reset为true，整体覆盖。设置为false时增量更新role
        reset,
      } = params
      res = await uniID.bindPermission({
        roleID,
        permissionList,
        reset,
      });
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
