<template>
	<view class="j-full-curbox bgf1f p-10">
		<view class="header mb-10" style="text-align: center;">
			<view class="iconfont icon-chenggong mt-15" style="font-size: 100rpx;"></view>
			<view class="m-20">订单交易成功</view>
		</view>
		
		<view class="container">
			<view class="j-flex" style="padding:20rpx 0;">
				<view>订单编号</view>
				<view class="col5A5">{{orderId}}</view>
			</view>
			<view class="j-flex" style="padding:20rpx 0;">
				<view>下单时间</view>
				<view class="col5A5">{{orderInfo.date}}</view>
			</view>
			<view class="j-flex" style="padding:20rpx 0;">
				<view>支付方式</view>
				<view class="col5A5">{{payType[orderInfo.payType] || '其他'}}</view>
			</view>
			<view class="j-flex" style="padding:20rpx 0;">
				<view>支付金额</view>
				<view class="col5A5">￥{{orderInfo.totalPrice}}</view>
			</view>
		</view>
		<button type="primary" class="mt-30 mb-20" @tap="skip">查看订单</button>
		<!-- <button type="default" @tap="skip(2)">返回首页</button> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 订单号
				orderId:"",
				
				// 订单结果信息
				orderInfo:{
					_status:{}
				},
				
				// 支付方式
				payType:{
					offline:'线下',
					
					weixin:'微信'
				}
			}
		},
		onLoad(params) {
			this.orderId = params.orderId
			this.getOrderDetail();
		},
		methods: {
			// 查看订单结果
			getOrderDetail(){
				let params = {
					action:"getOrderOne",
					params:{id:this.orderId}
				}
				this.$cloud.cloudFn(params).then(res=>{
					// uni.showToast({title:"添加成功",icon:"none"})
					this.orderInfo = res.data[0];
				});
				
			},
			
			skip(){
				uni.switchTab({url:"/pages/common/mine/index"})
				// uni.switchTab({url:"/pages//order/order"})
			}
		}
	}
</script>

<style scoped lang="scss">
	.iconfont{
		font-size: 140rpx !important;
		color: #108EE9;
	}
	.header,.container{
		padding:20rpx;
		background-color: #fff;
		border-radius: 10rpx;
	}
	
</style>
