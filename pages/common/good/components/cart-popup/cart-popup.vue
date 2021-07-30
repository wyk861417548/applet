<template>
	<!-- <view class="cart-popup" v-show="show && cart.length > 0"> -->
	<view class="cart-popup" >
		<view class="popup-layer mask"  :class="show && cart.length > 0?'mask-show':''" @tap="close"></view>
		<view class="popup-content" :class="(show && cart.length > 0)?'popup-content-show':''">
			<view class="clear" @tap="clear">清空</view>
			<scroll-view scroll-y="true" class="cart-list">
				<view class="content flex-between mb-10"  v-for="(product, key) in cart" :key="key">
					<view class="left">
						<view style="width: 100rpx;height: 100rpx;border-radius: 10rpx;" :style="{background:'url('+product.image+') no-repeat 0 0/100% 100%'}"></view>
					</view>	
					<view class="right j-flex">
						<view class="font14">{{product.name}}</view>
							<Action :num="goodCartNum(product.id)" @reduce="reduce(product)" @add="add(product)"></Action>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import Action from "../action/action.vue"
	export default {
		props:{
			cart: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				show:false
			}
		},
		onShow() {
		},
		computed:{
			goodCartNum() {	//计算单个饮品添加到购物车的数量
				return (id) => this.cart.reduce((acc, cur) => {
						if(cur.id === id) {
							return acc += cur.number
						}
						return acc
					}, 0)
			},
		},
		
		methods: {
			// 清空购物车
			clear(){
				uni.showModal({
				  content: '清空购物袋',
					confirmColor: '#DBA871',
					success: res => {
						if (res.confirm) {
							this.show = false;
							this.$emit('clear')
						}
					}
				})
			},
			
			// 关闭详情
			close(){
				this.show = false;
			},
			
			// 添加商品
			add(product){
				this.$emit('add',product)
			},
			
			// 減少商品
			reduce(product){
				this.$emit('reduce',product)
			}
			
		},
		components:{
			Action
		}
	}
</script>

<style lang="scss" scoped>
	.mask{
		opacity: 0;
		transition: all .3s ease-in-out;
		background: rgba(0, 0, 0, 0.3);
		visibility: hidden;
	}
	.mask-show{
		visibility: visible !important;
		opacity: 1 !important;
	}
	.popup-content-show{
		opacity: 1 !important;
		transform: translate(0) !important;
	}
	.cart-popup{
		.popup-layer{
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			margin: 0;
			z-index: 665;
		}
		.popup-content{
			position: absolute;
			background: #fff;
			bottom: 0;
			opacity: 0;
			transition: all .3s linear;
			transform: translateY(150%);
			padding-bottom:156rpx;
			width: 100%;
			z-index: 666;
			.cart-list{
				padding: 20rpx 0;
				max-height: 40vh;
				min-height: 0;
			}
			.clear{
				background-color: rgba(221,221,221,.3);
				color: #a8d458;
				padding: 16rpx 20rpx;
				font-size: 28rpx;
				text-align: right;
			}
			.content{
				.left{
					margin:0 40rpx;
				}
				.right{
					flex: 1;
					border-bottom:2rpx solid rgba(226,226,226,.4);
					padding:20rpx;
				}
			}
		}
	}
</style>
