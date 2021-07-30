<template>
	<view class="container j-full-curbox" >
		<image style="width: 100%;" src="../../static/images/lognBg.png" mode="widthFix"></image>
		<view class="j-full-center colfff content" style="top: 65%;">
			<button type="primary" open-type="getPhoneNumber" @click="getUserInfo" @getphonenumber="getPhoneNumber">登录</button>
		</view>
		
	
	</view>
</template>

<script>
	import Code from "@/components/code/code.vue"
	export default {
		data() {
			return {
				// 账号密码或者验证码登录   
				show:true,
				
				url:{
					homePage:"/pages/index",
					// 门店 首页页面
					store:"/pages/store/my/my",
					
					// 代理商 首页
					agent:"/pages/agent/my/my",
					
					// 申请页面
					register:"/pages/login/register",
					
					// 申请结果页面
					result:"/pages/login/result"
				},
				
				data:{
					// 微信头像
					avatar:"",
					
					// 微信名称
					nickName:"",
					
					// 临时登录凭证
					code:""
				}
			}
		},
		onLoad(param) {
			uni.hideTabBar();
			if(param.edit)return;
			console.log("this.$store.state.store",this.$store.state);
			if(this.$store.state.store){
				this.skip(this.$store.state.userstatus);
			}else{
				wx.getSetting({
				   success(res) {
						 console.log("res",res);
						 if(res.authSetting['scope.userInfo']){
							 console.log("登录中");
						 }else{
							 console.log("未登录");
						 }
				   }
				})
				this.getUserInfo();
			}
		},
		methods: {
			// 获取用户信息
			getUserInfo(){
				uni.getUserProfile({
					desc:'Wexin',     // 这个参数是必须的
					success:info=>{
						let user = info.userInfo;
						this.data ={
							avatar:user.avatarUrl,
							nickName:user.nickName,
							sex:user.gender
						}
						uni.login({
							provider: 'weixin',
							scopes:"auth_user",
							success:(res) =>{
								this.data.code = res.code;
								
								this.login(res.code);
							}
						});
					}
				})
			},
			
			// 获取手机号
			getPhoneNumber(e){
				console.log("E",e);
			},	
			
			//微信授权登录
			login(code){
				// 设置登录失败后，取login_来判断 是否跳转
			
				this.$post(this.$api.sign.login_wx+'?code='+code,this.data).then(res=>{
					var data = res.data;
					// 设置token
					this.$store.commit("setToken",{token:data.token,expiresTime:data.expiresTime});
					
					// 设置账号信息
					this.$store.commit("userLogin",data.user);
					
					// 设置账号信息
					this.$store.commit("userStatus",{type:data.type,storeStatus:data.storeStatus});
					
					uni.setStorage({
						key: "QUIT",
						data: false,
						success: function () {
							uni.navigateTo({
								url:"/pages/login/login"
							})
						}
					});
					
					// 类型，0没填写，1门店 2代理商  去申请代理商或者门店信息   未注册
					if(data.type == 0){
						uni.navigateTo({url:this.url.register})
						return;
					}
					
					// 注册且申请通过
					if(data.storeStatus == 2){
						this.$store.commit("setStore",data.store);
						// 门店信息
						if(data.type == 1){
							uni.switchTab({url:this.url.store})
							return;
						}
						
						// 代理商信息信息
						if(data.type == 2){
							uni.switchTab({url:this.url.agent})
							return;
						}
					}
					
					// 注册申请未通过
					this.cheackStatus();
					
					
				})
			},
			
			// 检查申请状态   1:待审核 2审核通过  3:审核不通过
			cheackStatus(){
				this.$get(this.$api.user.cheackStatis).then(res=>{
					if(res.data = 2) return;
					uni.navigateTo({url:this.url.result+'?id='+res.data});
				})
			},
			
			skip(data){
				console.log("data",data);
				// 类型，0没填写，1门店 2代理商  去申请代理商或者门店信息
				if(data.type == 0){
					uni.navigateTo({url:this.url.register})
					return;
				}
				
				if(data.storeStatus == 2){
					// 门店信息
					if(data.type == 1){
						uni.switchTab({url:this.url.store})
						return;
					}
					
					// 代理商信息信息
					if(data.type == 2){
						uni.switchTab({url:this.url.agent})
						return;
					}
				}
				// 注册申请未通过
				this.cheackStatus();
			},
			
			//获取验证码
			getCode(){
				this.$post(this.$api.sendCode,{phone:this.data.account},{type:true}).then((res)=>{
					uni.showToast({title:"发送成功",icon:"none"})
				})
			},
			
			// 微信授权登录
			F_login(){
				uni.login({
				  provider: 'weixin',
				  success: function (loginRes) {
				    console.log(loginRes.authResult);
				  }
				});
			}
		},
		components:{
			Code
		}
	}
</script>

<style scoped lang="scss">
	.logn{
		background: url(../../static/images/lognBg.png) no-repeat;
	}
	.iconfont{
		font-size: 36rpx !important;
		color:#a8d458;
	}
	.container{
		.content{
			width: 80%;
			padding:20rpx 30rpx;
			.content-input{
				height: 100rpx;
				border-bottom: 2rpx solid rgba(168,212,88,.5);
				input{
					color: #5A5B5C;
				}
			}
			.content-footer{
				text-align: center;
			}
		}
		button{
			margin-top: 30rpx;
		}
	}
</style>
