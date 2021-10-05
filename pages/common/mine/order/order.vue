<template>
	<view class="j-flex-col j-full-curbox">
		
		<!-- 内容区  占据除底部tabber组件外的区域 -->
		<view class="flex-adapt container j-flex-col" style="position: relative;">
			<view class="tabbar">
				<view class="item" :class="{active: !tabIndex}" @tap="switchTab(0)">当前订单</view>
				<view class="item" :class="{active: tabIndex}" @tap="switchTab(1)">所有订单</view>
			</view>
			
			<view class="flex-adapt bgf1f container-content" style="overflow: auto;">
				<view style="position: absolute;top: 0;left: 0;right: 0;bottom: 0;padding:0 26rpx;">
					<!-- 当前订单 begin -->
					<view style="width: 100%;height: 100%;"  v-show="tabIndex == 0" class="order-current">
						<scroll-view
							:scroll-top="0"
							scroll-y="true"
							style="width: 100%; height: 100%;"
							@scrolltolower="F_scrollLoad(1)">
							
							<view v-if="order.current.list.length > 0" class="list" v-for="(item,index) in order.current.list" :key="index" @tap="skip(item)">
								<view class="j-flex list-header">
									<view>订单编号：{{item.storeOrder.orderId}}</view>
									<view class="col97a font14">{{item.status.title}}</view>
								</view>
								<view class="list-footer">
									<view class="j-flex mb-15">
										<view class="col5A5 font18">{{item.status.payType}}</view>
										<view class="col5A5">￥{{item.storeOrder.payPrice}}</view>
									</view>
									<view class="col919 font14">下单时间：{{item.storeOrder.createTime}}</view>
									<view class="col919 font14">温馨提示：{{item.status.msg}}</view>
								</view>
							</view>
							
							<list-end v-if="order.current.end" />
						</scroll-view>
						
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
										<view class="col5A5 font18">{{item.status.payType}}</view>
										<view class="col5A5">￥{{item.totalPrice}} </view>
									</view>
									<view class="col919 font14">下单时间：{{item.date}}</view>
									<view class="col919 font14" v-if="item.status.msg">温馨提示：{{item.status.msg}}</view>
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
			<uni-tabs></uni-tabs>
		</view>
	</view>
</template>

<script>
	
export default {
	data() {
		return {
			// 当前所选
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
		
		// 获取当前订单 评价等级|0=未支付,1=待发货,2=待收货,3=待评价,4=已完成,-3=售后/退款
		getCurrentOrder(){
			var current = this.order.current;
			
			this.$get(this.$api.order.list,current.data).then(res=>{
				if(res.data && res.data.length > 0){
					current.data.page ++;
					res.data.map(item=>{
						current.list.push(item)
					})
					
					if(res.data.length < current.data.limit){
						current.end = true;
					}
					return;
				}
				if(current.list.length > 0){
					current.end = true;
					return;
				}
				current.show = true;
				
			})
		},
		
		// 确认收货
		confirmOrder(id) {
			console.log(typeof id,typeof Number(id));
			uni.showModal({
				title: '确认收货',
				content: '为保障权益，请收到货确认无误后，再确认收货',
				success: (res)=>{
					if (res.confirm) {
						this.$post(this.$api.order.confirm,{id:id},{type:true}).then(res => {
							uni.showToast({title:"收货成功",icon:"none"})
							this.order.history.list = [];
							this.order.history.page = 1;
							this.getHistoryOrder();
						})
					}
				}
			})
		},
		
		
		// 获取历史订单 评价等级|0=未支付,1=待发货,2=待收货,3=待评价,4=已完成,-3=售后/退款
		getHistoryOrder(){
			var history = this.order.history;
			let params = {
				action:"getOrderOne",
				params:{id:this.orderId}
			}
			this.$cloud.cloudFn(params).then(res=>{
				// uni.showToast({title:"添加成功",icon:"none"})
				if(res.data.length > 0){
					history.list = res.data;
					return;
				}
				this.$refs.nodata.show = true;
				
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
			
			if(data.storeOrder){
				uni.navigateTo({
					url:"/pages/store/order/orderDetail?orderId="+data.storeOrder.id
				})
			}
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
		width: 100%;
		height: 100%;
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
