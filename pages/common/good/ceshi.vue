<template>
	<view class="j-full-curbox j-flex-col">
		<!-- 内容显示区域 -->
		<view style="flex:1;">
		
			<view v-for="(item,index) in goods" :key="index">
				{{item.list}}
				<view v-for="(value,key) in item.list" :key="key">
					<view class="">{{value.name}}</view>
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
				// 商品数据
					goods:[{
						id:'1',
						name:"nihao",
						list:[{
							id:'1-1',
							name:"ceshi"
						}]
					}],
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
