<template>
	<view class="j-flex-col j-full-curbox">
		
		<!-- 内容区  占据除底部tabber组件外的区域 -->
		<view class="flex-adapt container j-flex-col" style="position: relative;">
			<view class="tabbar">
				<view class="item" :class="{active: !tabIndex}" @tap="switchTab(0)">购物车</view>
				<view class="item" :class="{active: tabIndex}" @tap="switchTab(1)">所有订单</view>
			</view>
			
			<view class="flex-adapt bgf1f container-content" style="overflow: auto;">
				<view style="position: absolute;top: 0;left: 0;right: 0;bottom: 0;padding:0 26rpx;">
					<!-- 当前订单 begin -->
					
					<view  style="width: 100%;height: 100%;"  v-show="tabIndex == 0" class="order-current">
						<view class="container box flex-adapt j-full-curbox p-10" v-if="!order.current.show">
							<view class="list flex p-10"  v-for="(item,index) in order.current.list" :key="index">
								<view class="flex" style="align-items: flex-end;">
									<view class="avatar" :style="{background:'url('+item.img[0]+') no-repeat 0 0/100% 100%'}"></view>
									<view class="col5A5 font12 ml-10">x {{item.num}}</view>
								</view>
								<view class="flex-adapt j-flex-col ml-10" style="justify-content: space-between;">
									<view class="col5A5 mr-10">{{item.name}}</view>
									<view class="col5A5 colfc4" style="text-align: right;">￥{{item.price}}</view>
								</view>
								
							</view>
						</view>
						
						<view v-if="order.current.show" class="no-order-content j-full-center">
							<view class="title col999" style="margin:20rpx auto;">您今天还没有下单</view>
							<button type="primary" class="font-size-lg" hover-class="none" @tap="handlesetOrder">去下单</button>
						</view>
					</view>
				
					<!-- 当前订单 end -->
						
					<!-- 历史订单 begin -->
					<view  style="width: 100%;height: 100%;" v-show="tabIndex == 1"  class="order-history">
						<uni-nodata ref="nodata"></uni-nodata>
						<scroll-view
							:scroll-top="0"
							scroll-y="true"
							style="width: 100%; height: 100%;"
							@scrolltolower="F_scrollLoad(4)">
							
							<view v-if="order.history.list.length > 0" class="list" v-for="(item,index) in order.history.list" :key="index" @tap="skip(item)">
								<view class="j-flex list-header">
									<view>订单编号：{{item.id}}</view>
									<view class="col97a font14">{{item.status.title}}</view>
								</view>
									
								<view class="list-footer">
									<view class="j-flex mb-15">
										<view class="col919 font14">下单时间：{{item.date}}</view>
										<view class="colfc4">￥{{item.totalPrice}} </view>
									</view>
									
								</view>
								<view class="" style="text-align: right;" v-if="item.status.type == 2">
									<button type="warn" style="display: inline-block;width: 30%;line-height:1.5em;padding: 10rpx 10rpx;" @tap.stop="confirmOrder(item.storeOrder.id)">确认收货</button>
								</view>
							</view>
							
							<list-end v-if="order.history.end" />
						</scroll-view>
					</view>
					<!-- 历史订单 end -->
				</view>
			</view>
		</view>
		
		<!-- 自定义tabBar组件 -->
		<view class="" style="height: 100rpx;">
			<um-tabs></um-tabs>
		</view>
	</view>
</template>

<script>
	
export default {
	data() {
		return {
			// 当前所选 所有订单
			tabIndex: 0,
			
			//订单
			order: {
				// 当前订单
				current:{
					// 无数据
					show:false,
					
					// 数据加载结束
					end:false,
					
					list:[],
					
					data:{
						type: 0,
						page: 1,
						limit: 10
					}
				},
				
				// 历史订单
				history:{
					// 无数据
					show:false,
					
					// 数据加载结束
					end:false,
					
					list:[],
					
					data:{
						type:99,
						page: 1,
						limit: 10
					}
				}
			},
		}
	},
	
	onShow() {
		// 状态默认false 如果购物车状态没有改变不会再次请求
		this.getCurrentOrder();
	
	},
	
	mounted() {
		
	},
	computed: {
	},
	methods: {
		// 当前订单
		getCurrentOrder(){
			var current = this.order.current;
					
			let data = {
				action:"getCart"
			}
			this.$cloud.cloudFn(data).then(res=>{
				if(res.data.length > 0){
					this.order.current.show = false;
					current.list = res.data;
					return;
				}
				current.list = [];
				this.order.current.show = true;
			});
			
		},
		
		// 历史订单
		getHistoryOrder(){
			var history = this.order.history;
			history.list = [];
			let params = {
				action:"getOrder"
			}
			this.$cloud.cloudFn(params).then(res=>{
				// uni.showToast({title:"添加成功",icon:"none"})
				if(res.data.length > 0){
					history.list = res.data.reverse();
					return;
				}
				
				
			});
			
		},
		
		// 滚动加载当前订单
		F_scrollLoad(type){
			// console.log("type",type);
			// if(type==1&&this.order.current.end || type==4&&this.order.history.end) return;
			
			// type==1?this.getCurrentOrder():this.getHistoryOrder();
		},
		
		
		
		// 如果没有当前订单，前往采购
		handlesetOrder(){
			uni.switchTab({
				url:"/pages/common/good/index"
			})
		},
		
		// 查看详情
		skip(data,type){
			
			uni.navigateTo({
				url:"/pages/user/order/orderDetail?orderId="+data.id
			})
		},
		
		async switchTab(index) {
			if(this.tabIndex === index) return
			this.tabIndex = index;
			
			index==0?this.getCurrentOrder():this.getHistoryOrder();
			
		},
		
		handleSwiperItemChange() {	//禁止手动滑动
			return true
		},
	
	},
	

};
</script>

<style lang="scss" scoped>
	.active{
		color: #000 !important;
		border-bottom: 4rpx solid  #ADB838;
	}
	.container{
		position: relative;
		.list{
			border-bottom: 2rpx solid rgba(221,221,221,.5);
			image{
				width: 140rpx;
			}
			.avatar{
				width: 150rpx;
				height: 150rpx;
				border-radius: 8rpx;
			}
		}
		.tabbar{
			display: flex;
			align-items: center;
			justify-content: space-around;
			.item{
				color: #999;
				font-weight: 400;
				height: 100rpx;
				line-height: 100rpx;
			}
		}
		.container-content{
			position: relative;
			flex: 1;
			.order-current,.order-history{
				image{
					margin:10rpx 20rpx;
					width: 140rpx;
				}
				.list{
					padding:20rpx;
					border-radius: 10rpx;
					margin:20rpx 0;
					background-color: #fff;
					.list-header{
						color: #919293;
						font-size: 28rpx;
						padding:20rpx 0;
						border-bottom: 2rpx solid #eee;
					}
					.list-footer{
						padding:20rpx 0;
					}
				}
			}
		}
	}
</style>
