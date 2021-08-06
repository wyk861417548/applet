<template>
	<view class="">
		<view class="content-input flex-align">
			<text class="colfff mr-15 iconfont icon-dilanxianxingiconyihuifu_huabanfuben"></text>
			<input type="number" maxlength="11" v-model="phone.mobile" placeholder="输入手机号码"/>
		</view>
		
		<view  class="content-input flex-align">
			<text class="colfff mr-15 iconfont icon-mima"></text>
			<input style="flex:1;" maxlength="6" type="number" v-model="phone.code" placeholder="验证码"/>
			<Code @getCode="getCode" :phone="phone.mobile"></Code>
		</view>
		
		<button type="primary" @tap="login_">登录</button>
	</view>
</template>

<script>
	import Code from "@/components/code/code.vue"
	export default {
		components:{
			Code
		},
		data() {
			return {
				url:{
					
				},
				
				
				phone:{
					// 手机号
					mobile:'18817075992',
					// 验证码
					code:''
				}
			}
		},
		
		methods:{
			login_(){
				let rules = {
					mobile:{datatype:"Phone",msg:"请填写手机号码"},
					code:{datatype:"Require",msg:"请填写验证码"}
				}
				
				// 表单验证
				if(!this.$validator.validate(this.phone,rules)) return;
				
				let data = {
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
					action:"sendSmsCode",
					params:this.phone
				}
				this.$cloud.cloudFn(data).then(res=>{
					uni.showToast({title:"发送成功,验证码默认为123456",icon:"none"})
				})
				
			},
		}
	}
</script>

<style>
</style>
