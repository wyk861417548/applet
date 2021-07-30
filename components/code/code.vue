<template>
	<view class="c-code">
		<button class="j-verifyCode" type="primary" :class="verifica.test(phone)?'':'j-button-sel'" v-show="show" @click="setCountdown" >验证码</button>
		<view class="j-verifyCode down" v-show="!show">{{count}}</view>
	</view>
</template>

<script>
	export default {
		props:['phone'],
		data() {
			return {
				// 手机正则验证
				verifica: /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[3-8]{1})|(18[0-9]{1})|(19[0-9]{1})|(14[5-7]{1}))+\d{8})$/,
				
				show:true,
				
				//倒计时
				count:0,
				
				//定时器
				timer:null
			};
		},
		onLoad() {
		},
		
		methods:{
			//设置倒计时   以及获取验证码
			setCountdown(){
				this.$emit("getCode");
				const TIME_COUNT = 60;  //倒计时的时间
				if(!this.timer){
					this.show = false;   //倒计时显示
					this.count = TIME_COUNT;
				 
					this.timer = setInterval(()=>{
						if(this.count > 1 && this.count <= TIME_COUNT){
							this.count--;
						}else{
							this.show = true;
							// 清除定时器  一定后面两句都要写
							clearInterval(this.timer);
							this.timer = null;
						}
					},1000)
				}
				
			}
		
		}
	}
</script>

<style scoped lang="scss">
	.c-code{
		height: 80rpx;
		width: 150rpx;
		.down{
			height: 100%;
			width: 100%;
			background:#ddd !important;
		}
		/* 验证码 */
		.j-verifyCode{line-height:80rpx;border-radius:4px;color:#fff;text-align:center;}
		.j-button-sel{background: #ddd !important;pointer-events: none;}
	}
	
	
</style>
