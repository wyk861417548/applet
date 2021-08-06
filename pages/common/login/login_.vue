<template>
	<view class="container j-full-curbox" >
			<!-- 账号密码 -->
			<view>
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
			
			<view class="j-flex">
				<view class="" @tap="$skip" data-url="/pages/common/login/register">去注册</view>
			</view>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				url:{
					
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
		
			// 手机号  验证码
			login(){
				var rules = {
					username:{datatype:"Phone",msg:"请填写账号"},
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
