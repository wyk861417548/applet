<template>
	<view class="tabbar j-flex">
		<view  :class="{active:item.url == '/'+current}" class="flex-adapt" v-for="(item,index) in list" :key="index">
			<navigator hover-class="none" :url="item.url" open-type="switchTab">
				<view class="iconfont" :class="item.icon" style="font-size: 50rpx;"></view>
				<view class="font12">{{item.name}}</view>
			</navigator>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				current:'',
				
				list:[],
				
				// 身份
				type:"user",
				// type:"user",
				
				tabBar: {
					//门店身份 tab组件
					user:[
						{name:"商品",icon:"icon-shouye",url:"/pages/common/good/index"},
						{name:"订单",icon:"icon-shujutongji",url:"/pages/user/order/order"},
						{name:"我的",icon:"icon-dilanxianxingiconyihuifu_huabanfuben",url:"/pages/common/mine/index"}
					],
					
					// 代理商身份
					admins:[
						{name:"商品管理",icon:"icon-shouye",url:"/pages/admin/good/index"},
						{name:"我的",icon:"icon-dilanxianxingiconyihuifu_huabanfuben",url:"/pages/common/mine/index"}
					]
				}
			};
		},
		
		computed: {
			...mapGetters({
				'userInfo': 'user/info'
			})
		},
		
		beforeCreate() {
			uni.hideTabBar();
		},
		
		created() {
			this.setTab();
			// 获取当前url地址
			this.current = this.$config.getRouter();
			
		},
		activated() {
			// 获取当前url地址
			this.current = this.$config.getRouter();
		},
		methods:{
			changeTab(index){
				this.$emit("change",index)
			},
			
			setTab(){
				var role =  this.userInfo.role;
				
				console.log("setTab",role);

				if(role == 'admins'){
					this.list = this.tabBar[role];
				}else{
					this.list = this.tabBar[this.type];
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.active{
		color:#262d39;
	}
	.tabbar{
		position: fixed;
		bottom:0;
		left: 0;
		width: 100%;
		height: 100rpx;
		text-align: center;
		color: #8e9397;
		z-index: 668;
		// border-radius: 20rpx 20rpx 0 0;
		box-shadow: 0 -5rpx 10rpx rgba(221,221,221,.8);
		background-color: #fff;
	}
</style>
