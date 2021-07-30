<template>
	<view style="text-align: center; padding: 30rpx; font-size: 24rpx; color: #888;">
		{{ tips }}
	</view>
</template>

<script>
	export default {
		props:{
			//提示语
			tips:{
				default:"我是有底线的",
				type:String,
			}
		},
		data() {
			return {
				
			}
		},
		
		mounted(){
			
		},
		
		methods: {
	
		}
	}
</script>

<style>
</style>
