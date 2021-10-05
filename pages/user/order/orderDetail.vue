<template>
	<view class="bgf1f j-full-curbox">
		<!-- 支付状态  icon-->
		<view class="header m-20 box" v-if="dataList">
			<view class="iconfont icon-chenggong  mb-15" style="font-size: 150rpx;" :class="[dataList.pstatus.type==0?'colf33':'col108']"></view>
			<view class="col5A5 font18">交易成功</view>
		</view>
		
		<view class="container" v-if="dataList">
			<!-- 交易状态 -->
			<view class="box" v-if="dataList.pstatus">
				<view class="box-title font20">支付信息</view>
				
				<view class="menu j-flex">
					<view class="menu-title col5A5">支付状态</view>
					<view class="menu-content" style="color: #97af13;">{{dataList.pstatus.title}}</view>
				</view>
				<view class="menu j-flex">
					<view class="menu-title col5A5">截止时间</view>
					<view class="menu-content">{{dataList.pstatus.msg}}</view>
				</view>
			</view>
			
			<!-- 商品列表 -->
			<view class="box">
				<view class="box-title font20">商品列表</view>
				<view class="p-10 flex-align" v-if="dataList.good && dataList.good.length > 0" v-for="(item,index) in dataList.good" :key="index">
					<view style="width: 100rpx;height: 100rpx;border-radius: 10rpx;" :style="{background:'url('+item.img[0]+') no-repeat 0 0/100% 100%'}"></view>
					<view class="right flex-adapt ml-15 flex-align">
						<view class="flex-adapt mr-10">
							<!-- 商品名称 -->
							<view class="font18">{{ item.name }}</view>
							<!-- 商品描述 -->
							<text class="col5A5 tips font12">{{ item.introduct }}</text>
						</view>
						
						<view class="price" style="text-align: right;">
							<view class="col5A5">￥{{ item.price }}</view>
							<view class="font12 colccc">x {{ item.num }}</view>
						</view>
						
					</view>
				</view>
				
				<view class="mt-15" style="text-align: right;"><text>小计</text><text class="font18 colfc4" style="font-weight: bold;">￥{{dataList.totalPrice}}</text></view>
			</view>
			
			<!--  -->
		<!-- 	<view class="box">
				<view class="box-title font20">订单信息</view>
				<view class="menu j-flex">
					<view class="menu-title col5A5">订单号</view>
					<view class="menu-content">门店名称</view>
				</view>
				<view class="menu j-flex">
					<view class="menu-title col5A5">门店名称</view>
					<view class="menu-content">门店名称</view>
				</view>
				<view class="menu j-flex">
					<view class="menu-title col5A5">门店名称</view>
					<view class="menu-content">门店名称</view>
				</view>
			</view> -->
			
			<!-- 订单信息 -->
			<view class="box">
				<view class="box-title font20">订单信息</view>
				<view class="menu j-flex">
					<view class="menu-title col5A5">订单号</view>
					<view class="menu-content">{{dataList.id}}</view>
				</view>
				<view class="menu j-flex">
					<view class="menu-title col5A5">下单时间</view>
					<view class="menu-content">{{dataList.date}}</view>
				</view>
				<view class="menu j-flex">
					<view class="menu-title col5A5">支付方式</view>
					<view class="menu-content">{{dataList.payType == 'offline'?"线下":"其他"}}</view>
				</view>
				<view class="menu j-flex">
					<view class="menu-title col5A5">收货地址</view>
					<view class="menu-content">{{dataList.address.area}}{{dataList.address.detail}}</view>
				</view>
			</view>
		</view>
		
		<view class="footer j-flex" v-if="dataList && dataList.pstatus.type==0">
			<view class="flex-adapt">
				<text class="ml-20">合计:</text>
				<text class="colfc4" style="font-weight: bold;">￥{{dataList.payPrice}}</text>
			</view>
			<!-- <button class="font14" :class="{ban:isBan}" type="primary" @tap="pay">确定</button> -->
			<button class="font14 pl-10 pr-10" :class="{ban:isBan}" type="primary" @tap="pay">支 付</button>
		</view>
		
		<!-- 待收货 -->
		<view class="footer j-flex" style="text-align: right;" v-if="dataList && dataList.pstatus.type==2">
			<view class=""></view>
			<button type="warn" class="pl-15 pr-15"  @tap.stop="confirmOrder()">确认收货</button>
		</view>
		
		<uni-nodata ref="nodata"></uni-nodata>
	</view>
</template>

<script>
	
export default {
	data() {
		return {
			// 服务提供商
			provide:'',
			
			//订单详情
			dataList:null,
			
			status:{
				
			},
			
			// 当前订单id
			id:"",
			
			// 当前订单
			orderNo:""
		}
	},
	onLoad(params) {
		this.id = params.orderId;
		// this.getAddress();
		this.getOrderDetail();
	
		uni.setNavigationBarTitle({
		　title:"订单详情"
		})
	},

	computed: {
	},
	methods: {

	
		// 查看订单结果
		getOrderDetail(){
			let params = {
				action:"getOrderOne",
				params:{id:this.id}
			}
			this.$cloud.cloudFn(params).then(res=>{
				// uni.showToast({title:"添加成功",icon:"none"})
				this.dataList = res.data[0];
			});
			
		},
		
		
		
		
	},
	

};
</script>

<style lang="scss" scoped>
	.header{
		text-align: center;
	}
	.container{
		
	}
	.footer{
		height: 100rpx;
		width: 100%;
		background-color: #fff;
		box-shadow: 0 -4rpx 6rpx rgba(0,0,0,.1);
		button{
			height: 100%;
			line-height: 100rpx;
			border-radius: 0;
			padding:0 30rpx;
		}
	}

</style>
