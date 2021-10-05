<template>
	<view class="j-full-curbox page-bg">
		<view class="box">
			<view class="box-title">商品类别</view>
			<input type="text" v-model="selCategory.name" readonly placeholder="请选择" @click="show = true" />
			<u-select v-model="show" :list="goods" @confirm="confirm"></u-select>
		</view>
		
		<view class="box">
			<view class="box-title">商品信息</view>
			
			<view class="column">
				<view class="left">名称</view>
				<input type="text" v-model="data.name" placeholder="请输入商品名称"/>
			</view>
			
			<view class="column">
				<view class="left">价格</view>
				<input type="text" v-model="data.price" placeholder="请输入商品价格"/>
			</view>
			
			
			<view class="column">
				<view class="left">简介</view>
				<input type="text" v-model="data.introduct"  placeholder="请输入商品简介"/>
			</view>
			
			
			<view class="column">
				<view class="left">规格</view>
				<input type="text" v-model="data.mode" readonly/>
			</view>
			
			
			
		</view>
		
		<view class="box">
			<view class="box-title">请上传商品图片</view>
			
			<view style="text-align: center;">
				<upload style="display: inline-block; margin: auto;" @change="changeImg"></upload>
			</view>
		</view>
		
		<button type="default" @click="addGood">新增</button>
		
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
				goods: [],
				
				// 当前所选商品类别信息
				selCategory:{
					_id:"",
					
					name:"",
				},
				
				data:{
					// 商品类别
					category:"",
					
					// 商品名称
					name:"",
					
					// 价格
					price:"",
					
					// 数量
					num:"",
					
					// 规格
					mode:"默认",
					
					// 简介
					introduct:"",
					
					// 图片地址
					img:"",
					
					id:Date.now()
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
					action:"getCategory",
				}
				
				this.$cloud.cloudFn(data).then(res=>{
					if(res.data && res.data.length > 0){
						res.data.map(item=>{
							console.log("item",item);
							this.goods.push({
								value: item._id,
								label: item.name
							})
						})
						
					}
					
				});
			},
			
			// 新增商品
			addGood(){
				let data = {
					action:"addGood",
					_id:this.selCategory._id,
					params:this.data
				}
				
				this.$cloud.cloudFn(data).then(res=>{
					uni.showToast({title:"添加成功",icon:"none"})
					uni.navigateBack();
				});
			},
			
			// 选中商品类别
			confirm(e) {
				console.log("e",e);
				this.selCategory = {
					name:e[0].label,
					_id:e[0].value
				} 
			},
			
			// 获取上传图片的地址
			changeImg(data){
				this.data.img = data.value;
				console.log("data",data);
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
