<template>
	<view class="container j-full-curbox" >
	
		<view class="j-full-center colfff content" style="top: 70%;" @tap="isSel" :style="{'z-index':(!isDefault?'9999':'')}">
			
			
			<view v-show="show">
				<view class="col5A5 font14 mb-15">请完成微信授权以继续使用</view>
				<button :class="{'active':!isDefault}" :disabled="!isDefault" type="primary"  @click="getUserInfo" >微信授权用户信息</button>
			</view>
			
		</view>
		
		<view class="agreement col5A5 font12 mb-15 flex-align">
			<checkbox-group  @change="checkboxChange" style="vertical-align: middle;">
				<label class="radio"><checkbox value="true" :checked="isDefault" />登录代表您已同意</label>
			</checkbox-group>
			<view class="font12" style="color:#4cd964;vertical-align: middle;" @tap="$skip" data-url='/pages/login/agreement'>兵站用户服务协议，隐私政策</view>
		</view>
		
		<uni-alert ref="alert">
			<template slot="container">
				<view class="mb-10" style="text-align: center;font-weight: bold;">提示</view>
				<view class="col5A5" style="text-align: center;">需要通过授权才能继续，请重新点击并授权!</view>
			</template>
		</uni-alert>
		
	
	</view>
</template>

<script>
	import Code from "@/components/code/code.vue"
	export default {
		data() {
			return {
				show:true,
				
				// 是否同意兵站用戶协议
				isDefault:false,
				
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
		onShow() {
			uni.login({
				provider: 'weixin',
				scopes:"auth_user",
				success:(res) =>{
					this.data.code = res.code;
				}
			});
		},
		onLoad(param) {
			uni.hideTabBar();
			
			// 如果地址栏带了edit=true 
			if(param.edit)return;
			
			// 每次进入兵站  查询本地store 看是否有记录
			if(this.$store.state.userstatus){
				this.skip(this.$store.state.userstatus);
			}
		},
		methods: {
			// 获取用户信息
			getUserInfo(){
				uni.getUserProfile({
					desc:'Wexin',     // 这个参数是必须的
					success:info=>{
						console.log("info",info);
						let user = info.userInfo;
						this.data.avatar=user.avatarUrl,
						this.data.nickName=user.nickName,
						this.data.sex=user.gender
						
						// this.login();
					},
					fail:()=>{
						console.log("nihao");
						this.$refs.alert.show = true;
					}
				})
			},
			
			
			// 选中底部用户协议
			isSel(){
				console.log("nihao");
				if(!this.isDefault){
					uni.showToast({title:"请阅读并勾选底部协议",icon:"none"})
				}
			},
			
			// 获取手机号
			getPhoneNumber(e){
				console.log(e);
				// 拒接获取手机号
				if(!e.detail.encryptedData  && !e.detail.encryptedData){
					this.$refs.alert.show = true;
					return;
				}
				
				this.data.iv = e.detail.iv,
				this.data.encryptedData = e.detail.encryptedData,
				this.show = false;
			},	
			
			// 用户是否同意兵站使用协议
			checkboxChange(e){
				var boolean = e.detail.value[0];
				if(boolean){
					this.isDefault = true;
				}else{
					this.isDefault = false;
				}
			},
			
			//弹窗确定按钮
			cancel(){
			  this.$refs.alert.show = false;
			},
			
			//微信授权登录
			login(){
				// 设置登录失败后，取login_来判断 是否跳转
				this.$post(this.$api.sign.login_wx+'?code='+this.data.code,this.data).then(res=>{
          
          console.log("logon",res.data);

					var data = res.data;
					// 设置token
					this.$store.commit("setToken",{token:data.token,expiresTime:data.expiresTime});
					
					// 设置账号信息
					this.$store.commit("userLogin",data.user);
					
					// 设置账号信息
					this.$store.commit("userStatus",{type:data.type,storeStatus:data.storeStatus});
					
					
					

					// 类型，0没填写，1门店 2代理商  去申请代理商或者门店信息   未注册
					if(data.type == 0){
						uni.navigateTo({url:this.url.register})
						return;
					}
					
					// 注册且申请通过 0等待，1门店 2代理商  去申请代理商或者门店信息   未注册
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
			
		},
		components:{
			Code
		}
	}
</script>

<style scoped lang="scss">
	.active{
		position: relative;
		z-index: -1;
	}
	.iconfont{
		font-size: 36rpx !important;
		color:#a8d458;
	}
	.uni-checkbox-input{
		border-radius: 50%;
	}
	.edition{
		margin-top: -370rpx;
		text-align: center;
		color: #FFFFFF;
	}
	.container{
		.content{
			width: 80%;
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
		.agreement{
			position: absolute;
			bottom: 18rpx;
			width: 90%;
			justify-content: center;
			left: 50%;
			transform: translateX(-50%);
		}
	}
</style>
