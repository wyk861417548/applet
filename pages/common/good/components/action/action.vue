<template>
	<!-- 购物action 加减 -->
	<view class="j-flex">
		<view v-show="num" class="iconfont icon-jian" style="color:#dedede;font-size:48rpx;" @tap.stop="reduce"></view>
		<view v-show="num" style="width: 40rpx;text-align: center;">{{num}}</view>
		<view class="iconfont icon-jia1 " style="font-size:48rpx;color: #a8d458;" @tap.stop="add"></view>
	</view>
</template>

<script>
	export default {
		props:["num"],
		data() {
			return {
				
			}
		},
		methods: {
			// 添加商品
			add(){
				this.$emit("add")
			},
			// 減少商品
			reduce(){
				if(this.num == 1){
					uni.showToast({title:"不能再减少了~",icon:"none"});
					return;
				}
				this.$emit("reduce")
			}
		}
	}
</script>

<style scoped>

</style>
