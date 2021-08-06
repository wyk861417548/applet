<template>
	<view class="container p-20 j-full-curbox" >
		<!-- 账号密码 -->
		<view class="title mb-15 font22">欢迎登录</view>
		
		<input type="number" maxlength="11" v-model="data.username" placeholder="输入手机号码"/>
		
		<input class="mt-20 mb-15" type="password" v-model="data.password" placeholder="密码"/>
		
		<button type="primary" @tap="login">登录</button>
		
		<view class="j-flex mt-10">
			<view class="" @tap="$skip" data-url="/pages/common/login/register">忘记密码</view>
			<view class="" @tap="$skip" data-url="/pages/common/login/register">注册账号</view>
		</view>
		
	</view>
</template>

<script>
	import mixin from './common/login-page.mixin.js';
	export default {
		mixins:[mixin],
		data() {
			return {
				url:{
					
				},
				
				data:{
					// 账号
					username:"888",
					// 密码
					password:'123456'
				}
			}
		},
		onLoad(param) {
			uni.hideTabBar();
		},
		methods: {
		
			// 手机号  验证码
			login(){
				var rules = {
					username:{datatype:"Require",msg:"请填写账号"},
					password:{datatype:"Require",msg:"请填写密码"}
				};
				// 表单验证
				if(!this.$validator.validate(this.data,rules)) return;
				
				let data = {
					action:"login",
					params: this.data
				}
				
				this.$cloud.cloudFn(data).then(res=>{
					this.loginSuccess(res)
				});
			},
		
		},
		
	}
</script>

<style scoped lang="scss">
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
