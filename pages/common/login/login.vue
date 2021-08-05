<template>
	<view class="container j-full-curbox" >
		<view class="j-full-center colfff content" style="top: 65%;">
			
			<!-- 账号密码 -->
			<view v-show="show">
				<view class="content-input flex-align">
					<text class="colfff mr-15 iconfont icon-dilanxianxingiconyihuifu_huabanfuben"></text>
					<input type="number" maxlength="11" v-model="data.username" placeholder="输入手机号码"/>
				</view>
				
				<view  class="content-input flex-align">
					<text class="colfff mr-15 iconfont icon-mima"></text>
					<input type="password" v-model="data.password" placeholder="密码"/>
				</view>
				
				<button type="primary" @tap="login">登录</button>
			</view>
			
			<!-- 手机号和验证码 -->
<!-- 			<view v-show="!show">
				<view class="content-input flex-align">
					<text class="colfff mr-15 iconfont icon-dilanxianxingiconyihuifu_huabanfuben"></text>
					<input type="number" maxlength="11" v-model="phone.mobile" placeholder="输入手机号码"/>
				</view>
				
				<view  class="content-input flex-align">
					<text class="colfff mr-15 iconfont icon-mima"></text>
					<input style="flex:1;" maxlength="6" type="number" v-model="phone.code" placeholder="验证码"/>
					<Code @getCode="getCode" :phone="phone.mobile"></Code>
				</view>
				
				<button type="primary" @tap="login_">注册并登录</button>
			</view> -->
			
			<!-- 注册 -->
			<view v-show="!show">
				<view class="content-input flex-align">
					<text class="colfff mr-15 iconfont icon-dilanxianxingiconyihuifu_huabanfuben"></text>
					<input type="number" maxlength="11" v-model="phone.mobile" placeholder="输入手机号码"/>
				</view>
				
				<view  class="content-input flex-align">
					<text class="colfff mr-15 iconfont icon-mima"></text>
					<input style="flex:1;" maxlength="6" type="number" v-model="phone.code" placeholder="验证码"/>
					<Code @getCode="getCode" :phone="phone.mobile"></Code>
				</view>
				
				<button type="primary" @tap="login_">注册并登录</button>
			</view>
			
			<view class="content-footer font14 mt-10 col5A5" @tap="change">
				<text v-show="show">还没有账号，前往注册</text>
				<text v-show="!show">已有账号，去登陆</text>
			</view>
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
					
				},
				
				data:{
					// 账号
					username:"18817075992",
					// 密码
					password:'wyk123'
				},
				
				
				phone:{
					// 手机号
					mobile:'18817075992',
					// 验证码
					code:''
				}
			}
		},
		onLoad(param) {
			uni.hideTabBar();
		},
		methods: {
			// 控制密码或者验证码的显示隐藏
			change(){
				this.show = !this.show;
			},
		
			// 手机号  验证码
			login(){
				var rules = {
					username:{datatype:"Phone",msg:"请填写手机号码"},
					password:{datatype:"Require",msg:"请填写密码"}
				};
				
				// 表单验证
				if(!this.$validator.validate(this.data,rules)) return;
				
				
				let data = {
					name:"uni-id-login",
					action:"login",
					params: this.data
				}
				
				this.$cloud.cloudFn(data).then(res=>{
					console.log("res",res);
					uni.switchTab({url:this.url.store})
				});
			},
			
			login_(){
				let rules = {
					mobile:{datatype:"Phone",msg:"请填写手机号码"},
					code:{datatype:"Require",msg:"请填写验证码"}
				}
				
				// 表单验证
				if(!this.$validator.validate(this.phone,rules)) return;
				
				let data = {
					name:'uni-id-login',
					action:'loginBySms',
					params:this.phone
				}
				
				this.$cloud.cloudFn(data).then(res=>{
					console.log("login_",res);
				})
			},
			
			
			//获取验证码
			getCode(){
				let data = {
					name:"uni-id-login",
					action:"sendSmsCode",
					params:this.phone
				}
				this.$cloud.cloudFn(data).then(res=>{
					uni.showToast({title:"发送成功,验证码默认为123456",icon:"none"})
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
		// background: url(../../static/images/lognBg.png) no-repeat;
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
