<template>
	<view class="j-full-curbox bgf1f container">
			<view class="box">
				<view class="">总营业额度：<text class="colfc4">￥{{orderPrice}} </text></view>
			</view>
			
			<view class="container-content" style="overflow: auto;">
					<!-- 历史订单 begin -->
					<view  style="width: 100%;height: 100%;"   class="order-history">
							
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
							</view>
							
					</view>
					<!-- 历史订单 end -->
				</view>
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
		this.getHistoryOrder();
	
	},
	
	mounted() {
		
	},
	computed: {
		//计算购物车总价
		orderPrice() {
			return this.order.history.list.reduce((acc, cur) => acc + cur.totalPrice, 0)
		},
	},
	methods: {
		
		// 获取历史订单 评价等级|0=未支付,1=待发货,2=待收货,3=待评价,4=已完成,-3=售后/退款
		getHistoryOrder(){
			var history = this.order.history;
			let params = {
				action:"getOrder"
			}
			
			this.$cloud.cloudFn(params).then(res=>{
				// uni.showToast({title:"添加成功",icon:"none"})
				console.log("res",res.data);
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
			
			uni.navigateTo({
				url:"/pages/admin/order/orderDetail?orderId="+data.id
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
