<template>
	<view class="j-flex-col j-full-curbox" style="overflow: hidden;">
		
		<!-- 内容区  占据除底部tabber组件外的区域 -->
		<view class="flex-adapt j-flex-col" style="position: relative;" v-if="goods">
			
			<!-- 主题内容区域 -->
			<view class="container" style="position: relative;">
				
				<view class="j-full-curbox flex">
					<!-- 左侧菜单栏 --> 
					<!-- :scroll-top="verticalNavTop" -->
					<scroll-view class="container-left" scroll-y :scroll-top="verticalNavTop" :scroll-with-animation='true'>
						<view class="menu" :id="`menu-${item.id}`" v-for="(item, index) in goods" :key="index" :class="{'current': item.id == currentIndex}"  @tap="handleMenuTap(item.id)">
							<text>{{ item.name }}</text>
						</view>
					</scroll-view>
					
					<view class="container-right j-flex-col">
						<!-- 右侧一直展示当前显示类别快 -->
						<view class="category-title">
							<text>{{category_title.title}}</text>
						</view>
						
						<!-- 右侧商品 -->
						<view style="position: relative;flex:1;">
							<scroll-view  class="j-full-curbox" style="top:-80rpx;" scroll-y @scroll="handleGoodsScroll" scroll-with-animation :scroll-top="cateScrollTop">
								
								<view class="category" v-for="(category, index) in goods" :key="index" :id="`cate-${category.id}`">
									<!-- 商品类别 -->
									<view class="title">
										<text v-if="index == 0"></text>
										<text v-if="index != 0">{{category.name }}{{category.list.length}}</text>
									</view>
									{{category.list}}
									<!-- 商品循环 -->
									<view class="good" v-for="(product, key) in category.list" :key="key">
										<view class="" style="height: 20rpx;"></view>
										<view class="flex">
											<view class="image" :style="{background:'url('+product.image+') no-repeat center / cover;'}" @tap='$skip' :data-url="'/pages/store/stock/goodDetail?id='+product.id"></view>
							
											<view class="right">
												<!-- 商品名称 -->
												<view>{{ product.storeName }}</view>
												<!-- 商品描述 -->
												<text class="tips text-overflowMut">{{ product.content }}</text>
												
												<view class="price_and_action j-flex" style="width: 100%;">
													<text class="price colfc4">￥{{ product.price }}</text>
													

												<!-- 	<Action v-if="product.productAttr.length < 2" :num="goodCartNum(product.id)" @reduce="handleReduceToCart(product)" @add="handleAddToCart(product,1)"></Action>
											
													<text class="norm" v-if="product.productAttr.length > 1" @tap="showGoodDetailModal(product)">选规格</text> -->
												</view>
												
											</view>
										</view>
									</view>					
								</view>
								
								<!-- 最后的空白区域  为了防止购物车把最后的商品挡住 -->
								<view style="height: 200rpx;"></view>
							</scroll-view>
						</view>
						
					</view>
				</view>
			</view>
			
			<!-- 购物车栏 begin -->
			<cart-bar 
				:cart="cart"
				@clear="clearCart"
				@add="handleAddToCart"
				@reduce="handleReduceToCart"
				@toPay="handleToPay"
			/>
			
			
			<!-- 商品规格选择展示弹窗 -->
			<Modal ref="modal">
				<template slot="container">
					<view class="dialog">
						<view class="dialog-close iconfont icon-shibai1" @tap="closeGoodDetailModal"></view>
						<view class="dialog-info flex-align">
							<view v-if="modal.product" class="image" :style="{background:'url('+modal.product.image+') no-repeat center / cover;'}"></view>
							
							<!-- 商品信息 -->
							<view class="info ml-15">
								<view class="font16">{{modal.product.storeName}}</view>
								
								<view class="font12 mt-10 mb-10 colc1c">已选:{{currentSelNorm.join(' / ')}}</view>
								
								<view class="col5A5 font16 colfc4">￥{{modal.product.price}}</view>
							</view>
						</view>
						
						<view class="j-flex mt-20">
							<view class="font14">数量</view>
							<Action :num="modal.number" @reduce="handlePropertyReduce" @add="handlePropertyAdd"></Action>
						</view>
						
						<!-- 规格  -->
						<view class="norm mt-20 font14" v-for="(item,index) in modal.product.productAttr" :key="index">
							<!-- 规格类型 -->
							<view class="col999">{{item.attrName}}</view>
							<!-- 规格大小 -->
							<view class="norm-list">
								<view :class="{'active':currentSelNorm[index] == value}" v-for="(value,key) in item.attrValues" :key="key" @click="changePropertyDefault(index,key)">{{value}}</view>
							</view>
						</view>
						
					</view>
					
					<button type="primary" style="border-radius:0;" @tap="handleAddToCartInModal(modal.product)">加入购物车</button>
				</template>
			</Modal>
		</view>
		
		
		<!-- 自定义tabBar组件 -->
		<view class="" style="height: 100rpx;">
			<um-tabs></um-tabs>
		</view>
	</view>
</template>

<script>
	import Modal from '@/components/modal/modal.vue'
	import Action from './components/action/action.vue'
	import CartBar from './components/cartbar/cartbar.vue'
	
	const db = uniCloud.database();
	
	export default {
		data() {
			return {
				// 头部展示栏内容
				category_title:{
					title:""
				},
				
				// 当前选中的规格
				currentSelNorm:[],
				
				// 是否是点击了左侧
				handleMenu:false,
				
				//当先左侧菜单索引
				currentIndex: '',
				
				// 商品数据
				goods:[{
					id:'1',
					name:"nihao",
					list:[{
						id:'1-1',
						name:"ceshi"
					}]
				}],
				
				
				// 商品单个详情
				modal:{
					// 单个商品
					product:{},
					
					number:1
				},
				
				// 商品dom是否设置了top值
				sizeCalcState:false,
				
				// 点击左侧菜单，右边商品对应滚动距离
				cateScrollTop:0,
				
				// 左侧菜单栏跟随右侧滚动而滚动
				verticalNavTop:0,
				
				// 左侧每个菜单选项的高度
				menuHeight:[],
				
				// 购物车商品
				cart:[],
				
				// 给提交订单页面的值
				cartId:[],
				
				// 当前购物车订单
				cartOrder:[]
			}
		},
		onLoad() {
			
			return;
			this.getData();
			if(this.$store.state.cartStatus == false){
				this.getCartList(true);
			}
			
		},
		onShow() {
			// this.init('good');
			// this.currentIndex = this.goods[0].id;
			// this.category_title.title = this.goods[0].name;
			return;
			// cartStatus 购物车状态  默认false首次进入会请求一次，当确定提交订单之后该状态才会改变
			if(this.$store.state.cartStatus){
				this.cart = [];
				this.$store.commit("changeCartStatus",false);
				this.getCartList(true);
			}
		},
		computed:{
			//计算单个饮品添加到购物车的数量
			goodCartNum() {	
				return (id) => this.cart.reduce((acc, cur) => {
					if(cur.id === id) {
						return acc += cur.number
					}
					return acc
				}, 0)
			},
	
		},
		
		methods: {
			async	init(tableName){
				console.log(tableName);
				uni.showLoading({
					mask: true
				});
				// 客户端联表查询
				return await db.collection(tableName)
					.get()
					.then(res => {
						this.goods = res.result.data;
						this.currentIndex = this.goods[0].id;
						this.category_title.title = this.goods[0].name;
							
						this.goods.map(item=>{
							console.log("goods",JSON.stringify(item.goods_list));
						})
						
						console.log(res.result.data,"111");
						return res.result.data
					}).catch(err => {
						console.error(err)
						return err
					})
					.finally((e) => {
						console.log(e,9527);
						uni.hideLoading()
					})
			},
			// 请求商品列表数据 模拟
			// for (let i = 0; i < 10; i++) {
			// 	this.goods.push(...res.data);
			// 	this.category_title.title = this.goods[0].cateName;
			// }
			// var boj = JSON.stringify(this.goods);
			// var arr = JSON.parse(boj)
			// for (var i = 0; i < arr.length; i++) {
			// 	arr[i].id = i;
				
			// }
			// this.goods = arr;
			// this.currentIndex = this.goods[0].id;
			// return;
			
			// 获取商品数据
			getData(){
				this.$get(this.$api.stock.products).then((res)=>{
					this.goods = res.data;
					this.currentIndex = this.goods[0].id;
					this.category_title.title = this.goods[0].cateName;
				})
			},
			
			// 获取购物车商品数据
			getCartList(boolen){
				this.cartOrder = [];
				this.cartId = [];
				var data = {
					page: 1,
					limit: 20,
					isValid: true
				}
				// good_id 商品添加后  后台给商品定义的id  id：获取商品列表时商品的id
				this.$get(this.$api.stock.cart.list,data).then(res=>{
					res.data.list.map(item=>{
						console.log("item.productInfo.storeName",item.productInfo.storeName);
						this.cartOrder.push({
							// 购物车表ID
							good_id:item.id,
							// 商品规格
							productAttrUnique:item.productAttrUnique,
							// 商品id
							id: item.productId,
							name: item.productInfo.storeName,
							price:item.productInfo.price,
							number: item.cartNum,
							image:item.productInfo.image,
						})
						
						this.cartId.push(item.id);
					})
					if(boolen){
						this.cart = this.cartOrder;
					}
					
					// 改变购物车状态 vuex
					this.$store.commit("changeCartStatus",false)
				
				})
			},
			
			// -----------------------------------------商品详情弹窗事件----------------------------------
			// 点击商品图片查看商品详情
			showGoodDetailModal(product){
				// 清空每次所选商品规格
				this.currentSelNorm = [];
				 
				this.modal.product = product;
				
				// this.modal.product.productAttr = [{"productId":29,"attrValue":[{"attr":"330ml"}],"type":0,"attrValues":["330ml",'400ml','500ml','600没了'],"attrName":"容量"},{"productId":29,"attrValue":[{"attr":"24"}],"type":0,"attrValues":["24",'14','8'],"attrName":"箱"}]
				
				// 点击选择规格  默认选中所有规格中第一条
				this.modal.product.productAttr.map((item,index)=>{
					this.currentSelNorm[index] = item.attrValues[0];
				})
				
				this.$refs.modal.show = true;
				
			},
			
			// 选择规格
			changePropertyDefault(index,key){
				
				let val = this.modal.product.productAttr[index].attrValues[key];
				
				// vue数组页面监听不到数组变化  写法如下
				this.$set(this.currentSelNorm,index,val);
			},
			
			// 减少商品数量
			handlePropertyReduce(){
				if(this.modal.number < 2){
					return;
				}
				this.modal.number -= 1;
			},
			
			// 添加商品数量
			handlePropertyAdd(){
				this.modal.number += 1;
			},
			
			// 将商品加入购物车
			handleAddToCartInModal(product){
				this.handleAddToCart(product,this.modal.number)
				this.closeGoodDetailModal();
			},
			
			// 关闭选择规格弹窗
			closeGoodDetailModal(){
				this.$refs.modal.show = false;
				this.currentSelNorm = [];
				this.modal.number = 1;
			},
			
			// ---------------------------------购物车事件---------------------------------
			
			// 确认订单
			handleToPay(){
				// 如果还没有登录
				if(!this.$store.state.token) {
					uni.reLaunch({url:"/pages/login/loginwx?edit=true"})
					return
				}
	
				uni.navigateTo({
				  url: '/pages/store/stock/stockDetail?cartId='+this.cartId.toString()
				});
				
			},
			
			
			//添加到购物车 product 商品信息,num 数量, currentSelNorm 商品规格
			handleAddToCart(product,num,currentSelNorm) {	
				const index = this.cart.findIndex(item => {
					return item.id === product.id
				})
				
				var data = {
					cartNum: num?num:1,
					productId: product.id,
					isNew:false,
				}
				
				// 如果是需要选择规格的商品
				if(this.currentSelNorm.length > 0 ){
					let type = this.currentSelNorm.join(',');
					data.productAttrUnique = product.productValue[type].id
				}else{
					data.productAttrUnique = product.productAttrUnique || product.productValue['默认'].id
				}
				
			
				
				this.$post(this.$api.stock.cart.add,data).then(res=>{
					if(index > -1) {
						this.cart[index].number += (num || 1)
					} else {
						this.cart.push({
							id: product.id,
							name: product.store_name,
							price: product.price,
							number: num || 1,
							image: product.image,
						})
						this.getCartList(true);
					}
					
				})
				
			},
			
			// 減少當前商品數量
			handleReduceToCart(product){
				const index = this.cart.findIndex(item => item.id == product.id);
				
				// const index = this.cart.findIndex(item => {
				// 	console.log("item",item,item.id,product.id);
				// 	item.id == product.id
				// })
				//减少当前商品接口 
				this.$post(this.$api.stock.cart.reduce,{id:this.cart[index].good_id,number:this.cart[index].number-1},{type:true}).then(res=>{
					this.cart[index].number -= 1
					if(this.cart[index].number <= 0) {
						this.cart.splice(index, 1)
					}
					
				})
				
			},
			
			//清除购物车 
			clearCart() {
				var clearCartArr = [];
				this.cartOrder.forEach(item=>{
					clearCartArr.push(item.good_id);
				})
				
				var ids = clearCartArr.join(",");
				
				this.$post(this.$api.stock.cart.del,{ids:ids},{type:true}).then(res=>{
					this.cart = [];
				})
				
			},
			
			
			
			
			// --------------------------------------------------------------------菜单以及滚动事件--------------------------------
			//点击左侧菜单项事件
			handleMenuTap(id) {	
				if(!this.sizeCalcState) {
					this.calcSize()
				}
				
				this.currentIndex = id;
				this.handleMenu = true;
				
				// this.cateScrollTop = this.goods.find(item => item.id == id).top;
				this.$nextTick(() => this.cateScrollTop = this.goods.find(item => item.id == id).top);
		
			},
			
			// 商品滚动触发  滚动时触发，event.detail = {scrollLeft, scrollTop, scrollHeight, scrollWidth, deltaX, deltaY}
			handleGoodsScroll({detail}){
				const {scrollTop} = detail
				
				// console.log("detail",detail);
				
				if(!this.sizeCalcState){
					this.calcSize();
				}
				// 当有商品类别距离小于滚动距离时添加，取反第一个就是当前商品
				let tabs = this.goods.filter(item=> item.top <= scrollTop).reverse();
				
				tabs.length > 0?this.category_title.title = tabs[0].cateName:'';
				// 点击左侧 右侧滚动不会因为 最后一个类别不满足条件 再次导致左侧滚动
				if(this.handleMenu){
					this.handleMenu = false;
					return;
				}
				
				if(tabs.length > 0){
					let top  = 0;
					this.currentIndex = tabs[0].id;
					
					//设置左侧菜单栏的滚动高度
					for(let i=1;i<tabs.length;i++){
						top+=this.menuHeight[i]
					}
					
					
					if(top > 300){
						this.verticalNavTop = top - 220;
						return;
					}
					this.verticalNavTop = 0;
				}
			
			},
			
			// 用来设置每个商品类别top值
			calcSize() {
				// 设置距离头部默认距离
				let h = 0;
				
				this.goods.forEach(item => {
					let view = uni.createSelectorQuery().select(`#menu-${item.id}`);
					let category = uni.createSelectorQuery().select(`#cate-${item.id}`);
					// 用于获取节点信息的对象 是否返回节点尺寸（width height）
					
					// 动态获取左侧菜单栏的高度并设置
					view.fields({
						size: true
					}, data => {
						item.menutop = data.height;
						this.menuHeight.push(data.height)
					}).exec();
					
					
					
					// 动态获取右侧分类的高度并设置
					category.fields({
						size: true
					}, data => {
						item.top = h
						h += data.height
						item.bottom = h
					}).exec()
				})
				
				this.sizeCalcState = true
			}
		},
	
		
		components:{
			Action,
			CartBar,
			Modal
		}
	}
</script>

<style lang="scss" scoped>
	.dialog{
		padding:20rpx 30rpx;
		.dialog-close{
			text-align: right;
			font-size: 50rpx;
			color: #a8d458;
		}
		.dialog-info{
			.image{
				width: 200rpx;
				height: 200rpx;
			}
			.info{
				flex: 1;
			}
		}
		.tips {
			width: 100%;
			height: 40rpx;
			line-height: 40rpx;
			font-size: $font-size-sm;
			color: $text-color-assist;
			margin-bottom: 10rpx;
		}
		.norm{
			.norm-list{
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				view{
					width: 30%;
					line-height: 50rpx;
					margin: 10rpx 0;
					color: #6d6d6d;
					border-radius: 10rpx;
					text-align: center;
					background-color: #f8f7fc;
				}
				.active{
					background-color: #e7f5cf;
					color: #a8d458;
					border: 2rpx solid #a8d458;
				}
			}
			
		}
		
	}
	image{
		width: 100%;
	}
	.header{
		width: 100%;
		background: #fff;
		.header-coupon {
			width: 100%;
			background-color: $bg-color-primary;
			font-size: $font-size-base;
			color: $color-primary;
			padding: 20rpx;
		}
	}
	.container{
		flex: 1;
		overflow: hidden;
		.container-left{
			width: 200rpx;
			height: 100%;
			background-color: #f2f2f2;
			.menu{
				display: flex;
				align-items: center;
				justify-content: flex-start;
				padding: 30rpx 20rpx;
				font-size: 26rpx;
				color: $text-color-assist;
				background-color: #f2f2f2;
				&.current {
					background-color: #fff;
					color: #5A5B5C;
					font-weight: 900;
				}
			}
			.menu.current + .menu{
				border-radius: 0 10rpx 0 0;
			}
		}
		.container-right{
			flex:1;
			position: relative;
			.category-title{
				height: 80rpx;
				line-height: 80rpx;
				background-color: #fff;
				color: $text-color-base;
				z-index: 100;
				padding-left: 20rpx;
			}
			.category {
				padding-left: 20rpx;
				box-sizing: border-box;
				width: 100%;
				.title {
					// padding: 20rpx 0;
					// display: flex;
					// align-items: center;
					height: 80rpx;
					line-height: 80rpx;
					background-color: #fff;
					color: $text-color-base;
					&.active{
						position: fixed;
						left: 0;
						top: 0;
						width: 100%;
					}
				}
			}
			.good{
				.image {
					width: 160rpx;
					height: 160rpx;
					margin-right: 20rpx;
					border-radius: 8rpx;
				}
				.right{
					flex: 1;
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					justify-content: space-between;
					padding-right: 14rpx;
					.tips {
						width: 100%;
						height: 40rpx;
						line-height: 40rpx;
						font-size: $font-size-sm;
						color: $text-color-assist;
						margin-bottom: 10rpx;
					}
					.price_and_action{
						.norm{
							width: 100rpx;
							line-height: 40rpx;
							background-color: #a8d458;
							font-size: 24rpx;
							border-radius: 20rpx;
							color: #fff;
							text-align: center;
						}
					}
				}
			}
			
		}
	}
</style>
