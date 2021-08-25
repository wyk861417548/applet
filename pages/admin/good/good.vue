<template>
	<view class="j-full-curbox page-bg">
		<view class="box">
			<view class="box-title">商品类别</view>
			<input type="text" value="" readonly placeholder="请选择" @click="show = true" />
			<u-select v-model="show" :list="list" @confirm="confirm"></u-select>
		</view>
		
		<view class="box">
			<view class="box-title">商品信息</view>
			
			<view class="column">
				<view class="left">名称</view>
				<input type="text" value="" placeholder="请输入商品名称"/>
			</view>
			
			<view class="column">
				<view class="left">价格</view>
				<input type="text" value="" placeholder="请输入商品价格"/>
			</view>
			
			<view class="column">
				<view class="left"></view>
				<input type="text" value="" placeholder="请输入商品名称"/>
			</view>
			
			<view class="column">
				<view class="left">简介</view>
				<input type="text" value="" placeholder="请输入商品简介"/>
			</view>
			
			
			
			<view class="column">
				<view class="left"></view>
				<input type="text" value="" placeholder="请输入商品名称"/>
			</view>
			
			
		</view>
		
		<view class="box">
			<view class="box-title">请上传商品图片</view>
			
			<view style="text-align: center;">
				<upload style="display: inline-block; margin: auto;"></upload>
			</view>
		</view>
		
	</view>
</template>

<script>
	import upload from "@/components/upload/upload.vue"
	export default {
		components:{
			upload
		},
		data() {
			return {
				show:false,
				// 商品类别
				list: [
				],
				
				data:{
					// 商品类别
					category:"",
					
					// 商品名称
					name:"",
					
					// 价格
					price:"",
					
					// 数量
					num:"",
					
					// 简介
					introduct:"",
					
					// 图片地址
					img:""
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
					this.list = res.data;
				});
			},
			
			// 选中商品类别
			confirm(e) {
				console.log(e);
			}
		}
	}
</script>

<style lang="scss">
	.box{
		.column{
			.left{
				width: 160rpx;
				margin-right: 20rpx;
			}
		}
	}
</style>
