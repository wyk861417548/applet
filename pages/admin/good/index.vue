<template>
	<view class="j-full-curbox j-flex-col">
		
		<!-- 内容显示区域 -->
		<view class="flex container" style="flex:1;background-color: #108EE9;">
			<!-- :scroll-top="verticalNavTop" -->
			<scroll-view class="left" :scroll-with-animation='true'>
				<view  @click="showTip"> 新增类别</view>
				
				<view class="menu" :id="`menu-${item.id}`" v-for="(item, index) in goods" :key="index" :class="{'current': item.id == currentIndex}"  @tap="handleMenuTap(item.id)">
					<text>{{ item.name }}</text>
				</view>
				
				
			</scroll-view>
			
			<scroll-view class="right"   :scroll-with-animation='true'>
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
			// 获取商品类别
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
			}
		}
	}
</script>

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
</style>
