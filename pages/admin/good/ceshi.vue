<template>
	<view class="j-full-curbox j-flex-col">
		
		<!-- 内容显示区域 -->
		<view class="flex container" style="flex:1;background-color: #108EE9;">
			<!-- :scroll-top="verticalNavTop" -->
			<scroll-view class="left" scroll-y :scroll-with-animation='true'>
				<view  @click="showTip"> 新增类别</view>
				
				<view class="menu" :id="`menu-${item.id}`" v-for="(item, index) in goods" :key="index" :class="{'current': item.id == currentIndex}"  @tap="handleMenuTap(item.id)">
					<text>{{ item.name }}</text>
				</view>
				
				
			</scroll-view>
			
			<scroll-view class="right" scroll-y  :scroll-with-animation='true'>
				<view  @click="$skip" data-url="/pages/admin/good/good"> 新增商品</view>
				
				<view class="category" v-for="(category, index) in goods" :key="index" :id="`cate-${category.id}`">
					<!-- 商品类别 -->
					<view class="title">
						<text v-if="index == 0"></text>
						<text v-if="index != 0">{{category.name }}</text>
					</view>
				
					<!-- 商品循环 -->
					<view class="good" v-for="(product, key) in category.child" :key="key">
						<view class="" style="height: 20rpx;"></view>
						<view class="flex">
							<view class="image" :style="{background:'url('+product.img[0]+') no-repeat center / cover;'}" @tap='$skip' :data-url="'/pages/store/stock/goodDetail?id='+product.id"></view>
											
							<view class="right">
								<!-- 商品名称 -->
								<view>{{ product.name }}</view>
								<!-- 商品描述 -->
								<text class="tips text-overflowMut">{{ product.introduct }}</text>
								
								<view class="price_and_action j-flex" style="width: 100%;">
									<text class="price colfc4">￥{{ product.price }}</text>
									
				
								<!-- 	<Action v-if="product.productAttr.length < 2" :num="goodCartNum(product.id)" @reduce="handleReduceToCart(product)" @add="handleAddToCart(product,1)"></Action>
							
									<text class="norm" v-if="product.productAttr.length > 1" @tap="showGoodDetailModal(product)">选规格</text> -->
								</view>
								
							</view>
						</view>
					</view>					
				</view>
			</scroll-view>
			
		</view>
		

		<um-alert ref="category">
			<template>
				<view class="box">
					<view class="box-title">新增商品类别</view>
					<view class="column">
						<text class="left" style="width: 200rpx;">类别名称</text>
						<input class="right" style="width: 300rpx;" type="text" v-model="category.name" placeholder="请输入商品类别名称"/>
					</view>
					
					<view class="mt-20" style="text-align: right;">
						<text class="mr-10" @click="close">取消</text>
						<text class="col167" @click="confirm">确定</text>
					</view>
				</view>
			</template>
		</um-alert>
		
		<!-- 自定义tabBar组件 -->
		<view class="" style="height: 100rpx;">
			<!-- 新增商品类别弹窗 -->
			
			<um-tabs></um-tabs>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				
				// 商品信息
				goods:[],
				
				// 商品类别信息
				category:{
					// 商品类别名称
					name:"",
					
					// 用处存放商品容器
					child:[]
				}
			}
		},
		
		onLoad() {
			this.getCategory();
		},
		
		methods: {
			// 获取商品类别以及商品信息
			getCategory(){
				let data = {
					action:"getCategory"
				}
				
				this.$cloud.cloudFn(data).then(res=>{
					console.log("getCategory",res);
					this.goods = res.data;
				});
			},
			
			// 新增商品类别
			addCategory(){
				let data = {
					action:"addCategory",
					params:this.category
				}
				
				this.$cloud.cloudFn(data).then(res=>{
					uni.showToast({title:"添加成功",icon:"none"})
					this.getCategory();
				});
			},
			
			// 新增商品类别弹窗
			showTip(){
				console.log("this",this.$refs);
				this.$refs.category.show = true;
			},
			
			// 确定弹窗事件
			confirm(){
				this.addCategory();
				this.$refs.category.show = false;
			},
			
			// 关闭弹窗事件
			close(){
				this.$refs.category.show = false;
			},
			
			// -----------------------------------------商品详情弹窗事件----------------------------------
			// 点击商品图片查看商品详情
			showGoodDetailModal(product){
				// 清空每次所选商品规格
				this.currentSelNorm = [];
				 
				this.modal.product = product;
				
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
		}
	}
</script>
<!-- 
<style lang="scss">
	.header{
		button{
			padding: 0 20rpx;
		}
	}
	.container{
		.left{
			width: 30%;
			background-color: #fff;
			border-right: 2rpx solid rgba(221,221,221,.3);
			& view{
				text-align: center;
			}
		}
		.right{
			.image{
				width:80rpx;
				height: 80rpx;
			}
			
		}
	}
</style> -->

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
		.left{
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
		.right{
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
