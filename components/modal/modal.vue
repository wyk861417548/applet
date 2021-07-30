<template>
	<view class="modal">
		<view class="j-full-curbox mask" style="position: fixed;" :class="show?'mask-show':''"></view>
		<view class="j-full-center content" :style="styles" :class="[show?'content-normal mask-show ':'content-scale']">
			<slot name="container">
				<button class="primary" @click="close">关闭</button>
			</slot>
		</view>
	</view>
</template>

<script>
	export default {
		props:["css"],
		data() {
			return {
				// 遮罩是否显示
				show:false,
				
				// 宽度
				styles:this.css?this.css:{width:'80%','border-radius':'10rpx'}
			};
		},
		
		methods:{
			close(){
				this.show = false;
			}
		}
	}
</script>

<style scoped lang="scss">
	.modal{
		min-width: 60vw;
		.mask{
			opacity: 0;
			transition: all .3s ease-in-out;
			background: rgba(0, 0, 0, 0.3);
			visibility: hidden;
			z-index: 680;
		}
		.mask-show{
			visibility: visible !important;
			opacity: 1 !important;
		}
		.content{
			opacity: 0;
			visibility: hidden;
			transition: all .3s ease-in-out;
			background-color: #fff;
			overflow: hidden;
			width:80%;
			border-radius:10rpx;
			z-index: 680;
		}
		.content-scale{
			transform:translate(-50%,-50%) scale(0);
		}
		.content-normal{
			transform:translate(-50%,-50%) scale(1);
		}
		
	}
	
</style>
