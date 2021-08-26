<template>
	<view class="modal" v-show="show">
		<view class="j-full-curbox mask" @click="show = false"></view>
		<view class="j-full-center content">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 遮罩是否显示
				show:false,

			};
		},
		
		methods:{
			close(){
        this.show = false;
      }
		},
	}
</script>

<style scoped lang="scss">
	.modal{
		.mask{
      position: fixed;
			transition: all .3s ease-in-out;
			background: rgba(0, 0, 0, 0.3);
      // background: rgba(150, 150, 150, .99);
			z-index: 680;
		}
		.content{
      position: fixed;
			transition: all .3s ease-in-out;
			overflow: hidden;
			border-radius:10rpx;
			z-index: 680;
		}
		
	}
	
</style>
