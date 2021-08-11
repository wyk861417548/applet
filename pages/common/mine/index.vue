<template>
	<view class="j-full-curbox j-flex-col">
		<view style="flex:1;">
			<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30" @tap="$skip" :data-url="hasLogin?infoUrl:loginUrl">
				<view class="u-m-r-10">
					<u-avatar :src="userInfo.avatar" size="140"></u-avatar>
				</view>
				<view class="u-flex-1">
					<view class="u-font-18 u-p-b-20">{{userInfo.username}}</view>
					<view class="u-font-14 u-tips-color">微信号:helang_uView()</view>
				</view>
				<view class="u-m-l-10 u-p-10">
					<u-icon name="scan" color="#969799" size="28"></u-icon>
				</view>
				<view class="u-m-l-10 u-p-10">
					<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
				</view>
			</view>
			
			<view class="u-m-t-20">
				<u-cell-group >
					<u-cell-item  :icon="item.icon" :title="item.name" @tap="skip(item.url)"  v-for="(item,index) in menuList" :key="index"></u-cell-item>
				</u-cell-group>
			</view>
			
			<button type="default" class="mt-20" @click="quit">退出登录</button>
			
		</view>
		
		<!-- 自定义tabBar组件 -->
		<view  style="height: 100rpx;">
			<um-tabs></um-tabs>
		</view>
	</view>
</template>

<script>
	import {mapMutations,mapGetters} from 'vuex';
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
					{name:"设置",icon:"setting",url:"/pages/common/mine/setting/index"},
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
			...mapMutations({
				logout: 'user/logout'
			}),
			
			// 功能列表跳转
			skip(url){
				uni.navigateTo({url})
			},
			
		
			// 退出登录弹窗
			quit(){
				console.log("this.hasLogin",this.hasLogin);
				if(this.hasLogin){
					uni.showModal({
					  content: '退出登录后不能查看订单信息',
						confirmColor: '#DBA871',
						success: res => {
							if (res.confirm) {
								this.handleQuit();
							}
						}
					})
				}else{
					this.skip(this.loginUrl)
				}
				
			},
			
			// 退出登录
			handleQuit(){
				let data = {
					action:"logout"
				}
				this.$cloud.cloudFn(data).then(res=>{
					// 清除vuex保存的登录信息
					this.logout();
				});
			}
		}
	}
</script>

<style lang="scss">
	.camera{
		width: 54px;
		height: 44px;
		
		&:active{
			background-color: #ededed;
		}
	}
	.user-box{
		background-color: #fff;
	}
</style>
