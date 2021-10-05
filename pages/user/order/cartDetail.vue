<template>
	<view class="j-full-curbox j-flex-col bgf1f" style="padding-bottom: 0;">
		<view class="header box j-flex" @click="skip">
			<view v-if="address">
				<view class="mt-10">
					<text>{{address.name}}</text>
					<text class="ml-15">{{address.phone}}</text>
				</view>
				<view class="mt-10 flex">
					<text class="col97a mr-10">[默认]</text> 
					<text style="flex: 1;">{{address.area}}{{address.detail}}</text>
				</view>
			</view>
			
			<view v-if="!address"><text class="col97a mr-10">新增收货地址</text></view>
			
			<view class="mr-10" style="width: 80rpx;text-align: right;">
				<text class="iconfont icon-youjiantou"></text>
			</view>
		</view>
		
		<view class="container box flex-adapt j-full-curbox p-10">
			<view class="list flex p-10" v-show="order.list.length > 0" v-for="(item,index) in order.list" :key="index">
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
		
		<!-- <view class="box">
			<radio-group>
				<view class="box-title font20">支付方式</view>
				<view class="menu j-flex">
					<view class="menu-title col5A5">微信支付</view>
					<label  @tap="setPayType(2)"><radio disabled="true" :checked="payType == 2" /></label>
				</view>
				<view class="menu j-flex">
					<view class="menu-title col5A5">货到付款支付</view>
					<label @tap="setPayType(1)"><radio :checked="payType == 1" /></label>
				</view>
			</radio-group>
			<view class="font14 colf33 mr-10 ml-10">温馨提示：暂时只支持货到付款的方式</view>
		</view> -->
		
		<view class="footer j-flex">
			<view class="flex-adapt">
				<text class="ml-20">合计:</text>
				<text class="colfc4" style="font-weight: bold;">￥{{totalPrice}}</text>
			</view>
			<!-- <button class="font14" :class="{ban:isBan}" type="primary" @tap="pay">确定</button> -->
			<button class="font14" :class="{ban:isBan}" type="primary" @tap="handleSubmit">提交订单</button>
		</view>
		
	</view>
</template>

<script>
	
export default {
	data() {
		return {
			// 服务提供商
			provide:'',
			
			// 按钮点击后禁止
			isBan:false,
			
			// 选择支付方式 1 货到付款  2 微信  
			payType:1,
			
			// 默认地址
			address:null,
			
			order:{
				// 当前订单数据
				list:[],
				
				// 商品总价格
				totalPrice:"",
				
				//商品订单
				orderKey:"",
				
				// 提交订单数据
				data:{}
			},
			
			// 获取当前订单
			data:{
				cartIds:"",
				addAgain: false,
				bargain: false,
				combination: false,
				isNew: "false",
				secKill: false
			}
		}
	},
	onLoad(params) {
		this.data.cartIds = params.cartId;

		this.getCurrentOrder();
		
		uni.setNavigationBarTitle({
		　title:"提交订单"
		})
	},
	onShow() {
		this.getProvide();
		this.getAddress();
	},
	mounted() {
		
	},
	computed: {
		totalPrice(){
			return this.order.list.reduce((acc, cur) => acc + cur.num * cur.price, 0)
		}
	},
	methods: {
		// 获取服务提供商
		getProvide(){
			uni.getProvider({
				service: 'oauth',
				success: (res) =>{
					this.provide = res.provider[0];
				}
			});
		},
		
		// 获取地址
		getAddress(){
			let data = {
				action:"getAddress",
				params:{isDefault:true}
			}
			this.$cloud.cloudFn(data).then(res=>{
				console.log('获取购物车商品信息',res);
				if(res.data){
					this.address = res.data[0];
				}
				
			});
		},
		
		// 获取当前购物车商品
		getCurrentOrder(){
			let data = {
				action:"getCart"
			}
			this.$cloud.cloudFn(data).then(res=>{
				console.log('获取购物车商品信息',res);
				this.order.list = res.data;
			});
		},
		// 创建订单
		handleSubmit(){
			if(!this.address) {
				uni.showToast({title:"请选择收货地址",icon:"none"})
				return;
			}
			
			let id = Number(Math.random().toString().substr(3, 5) + Date.now()).toString(36)
			
			let data = {
				action:"setOrder",
				params:{
					address:{...this.address},
					good:[...this.order.list],
					date:this.$config.dateformat(new Date(),'yyyy-MM-dd hh:mm:ss'),
					id:id,
					totalPrice:this.totalPrice
				}
				
			}
			this.$cloud.cloudFn(data).then(res=>{
				this.clearCart(id);
			});
			
		},
		//清除购物车
		clearCart(id) {
			
			let params = {
				action:"removeCart",
			}
			this.$cloud.cloudFn(params).then(res=>{
				// uni.showToast({title:"添加成功",icon:"none"})
				this.isBan = true;
				uni.navigateTo({
					url:"/pages/user/order/success?orderId="+id
				})
			});
			
		},
		
	
	
			
		
		// 选择地址
		skip(){
			uni.navigateTo({
				url:"/pages/common/mine/address/index"
			})
		}
	
	},
	

};
</script>

<style lang="scss" scoped>
	.header{
		color: #919293;
		margin-top: 18rpx;
		border-bottom: 2rpx solid #eee;
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
