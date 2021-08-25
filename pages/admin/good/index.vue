<template>
	<view class="j-full-curbox j-flex-col">
		
		<!-- 内容显示区域 -->
		<view class="flex container" style="flex:1;background-color: #108EE9;">
			<!-- :scroll-top="verticalNavTop" -->
			<scroll-view class="left" :scroll-with-animation='true'>
				<view class="menu" :id="`menu-${item.id}`" v-for="(item, index) in goods" :key="index" :class="{'current': item.id == currentIndex}"  @tap="handleMenuTap(item.id)">
					<text>{{ item.name }}</text>
				</view>
				
				<view  @click="showTip"> 新增商品类别</button>
			</scroll-view>
			
			<scroll-view class="right"   :scroll-with-animation='true'>
				<view  @click="$skip" data-url="/pages/admin/good/good"> 新增商品</button>
				
				<view class="menu" :id="`menu-${item.id}`" v-for="(item, index) in goods" :key="index" :class="{'current': item.id == currentIndex}"  @tap="handleMenuTap(item.id)">
					<text>{{ item.name }}</text>
				</view>
			</scroll-view>
			
		</view>
		

		<!-- <um-alert></um-alert> -->
		
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
				
				// 商品类别信息
				category:{
					name:"",
					
					child:[]
				}
			}
		},
		methods: {
			// 新增商品类别
			addCategory(){
				let data = {
					action:"addCategory"
				}
				
				this.$cloud.cloudFn(data).then(res=>{
					console.log("addCategory",res);
					this.list = res.data;
				});
			},
			
			// 新增商品类别弹窗
			showTip(){
				this.$ref.category = true;
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
		}
	}
</style>
