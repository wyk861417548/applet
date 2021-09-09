<template>
	<view class="j-full-curbox j-flex-col">
		<view style="flex:1;">
			<view class="header flex mb-10" style="background-color: #f1b462;">
			
				<!-- 登录后显示  -->
				<view class="flex-adapt flex-align"  @tap="$skip" :data-url="hasLogin?infoUrl:loginUrl">
					
					<view class="avatar" v-if="userInfo.avatar" :style="{background:'url('+userInfo.avatar+') no-repeat 0 0/100% 100%'}"></view>
					<view class="avatar" v-if="!userInfo.avatar"></view>
					
					<view class="flex-adapt">
						<view class="font20">{{userInfo.username}}</view>
						<view class="mt-10">{{$config.stringReg(userInfo.phone)}}</view>
					</view>
					
					<view class="u-m-l-10 u-p-10">
						<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
					</view>
				</view>
				
			</view>
			
			<view class="u-m-t-20">
				<u-cell-group >
					<u-cell-item  :icon="item.icon" :title="item.name" @tap="skip(item.url)"  v-for="(item,index) in menuList" :key="index"></u-cell-item>
				</u-cell-group>
			</view>
			
		</view>
		
		<!-- 自定义tabBar组件 -->
		<view  style="height: 100rpx;">
			<um-tabs></um-tabs>
		</view>
	</view>
</template>

<script>
	import {mapGetters} from 'vuex';
	export default {
		data() {
			return {
				// 登录地址
				loginUrl:"/pages/common/login/login",
				
				// 个人信息界面地址
				infoUrl:"/pages/common/mine/info/index",
				
				// 菜单列表
				menuList:[
					{name:"地址",icon:"car-fill",url:"/pages/common/mine/address/index"},
				]
			}
		},
		
		onShow() {
			
		},
		
		computed: {
			...mapGetters({
				'userInfo': 'user/info',
				'hasLogin': 'user/hasLogin',
			})
		},
		methods: {
			// 功能列表跳转
			skip(url){
				uni.navigateTo({url})
			},
		}
	}
</script>

<style lang="scss">
	.header{
		background-color: #fff;
		border-radius:0 0 20rpx 20rpx;
		padding:40rpx 30rpx;
		image{
			width: 120rpx;
			margin-right: 20rpx;
		}
		.avatar{
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
			margin-right: 20rpx;
			background: url('~@/static/images/avatar.webp') no-repeat 0 0/100% 100%;
			overflow: hidden;
		}
	}
	.user-box{
		background-color: #fff;
	}
</style>
