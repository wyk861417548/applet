<template>
	<!-- v-show="cartNum > 0" -->
	<view>
		<!-- 购物车 -->
		<view class="cart-box" v-if="cartNum > 0">
			<view class="mark">
				<image src="/static/images/menu/cart.png" class="cart-img" @tap="openCartPopup"></image>
				<view class="tag">{{ cartNum }}</view>
			</view>
			<view class="price" v-if="cartPrice">￥{{ cartPrice }}</view>
			<button type="primary" class="pay-btn" @tap="toPay" >确认</button>
		</view>
		
		<!-- 购物车详情 -->
		<cart-popup :cart="cart" ref="cartPopup" @add="add" @reduce="reduce"  @clear="clear"></cart-popup>
	</view>
	
</template>

<script>
	import cartPopup from '../cart-popup/cart-popup.vue'
	export default {
		props:{
			cart:{
				type:Array,
				default:()=>[]
			}
		},
		
		data() {
			return {
				
			}
		},
		onLoad() {
			
		},
		computed:{
			// 计算购物车总数
			cartNum() {
				return this.cart.reduce((acc, cur) => acc + cur.number, 0)
			},
			
			//计算购物车总价
			cartPrice() {
				return this.cart.reduce((acc, cur) => acc + cur.number * cur.price, 0)
			},
		},
		methods: {
			// 确认订单
			toPay(){
				this.$emit('toPay')
			},
			
			// 购物车详情
			openCartPopup(){
				this.$refs.cartPopup.show = !this.$refs.cartPopup.show;
			},
			
			// 清除购物车
			clear() {
				this.$emit('clear')
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
			cartPopup
		}
	}
</script>

<style lang="scss" scoped>
	.cart-box {
		position: absolute;
		bottom: 30rpx;
		left: 30rpx;
		right: 30rpx;
		height: 96rpx;
		border-radius: 48rpx;
		box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
		background-color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: space-between;
		z-index: 667;
		
		.cart-img {
			width: 96rpx;
			height: 96rpx;
			position: relative;
			margin-top: -48rpx;
		}
		
		.pay-btn {
			height: 100%;
			padding: 0 30rpx;
			color: #FFFFFF;
			border-radius: 0 50rpx 50rpx 0;
			display: flex;
			align-items: center;
			font-size: $font-size-base;
		}
		
		.mark {
			padding-left: 46rpx;
			margin-right: 30rpx;
			position: relative;
			
			.tag {
				background-color: $color-warning;
				color: $text-color-white;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: $font-size-sm;
				position: absolute;
				right: -10rpx;
				top: -50rpx;
				border-radius: 100%;
				padding: 4rpx;
				width: 40rpx;
				height: 40rpx;
				opacity: .9;
			}
		}
		
		.price {
			flex: 1;
			color: $text-color-base;
		}
	}
</style>
