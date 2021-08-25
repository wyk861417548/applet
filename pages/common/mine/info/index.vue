<template>
	<view class="j-full-curbox" style="background:linear-gradient(#f1b462 20%,#efb561 60%,#efb15c 80%,#f1c061);padding-top: 150rpx;">

		<view class="box header" style="position: relative;padding-bottom:0;">
			<view class="avatar">
				<view class="avatar-img" :style="{background:'url('+defaultaAvatar+') no-repeat 0 0/100% 100%'}"></view>
				{{defaultaAvatar}}
				<!-- <view class="avatar-img" :style="{background:'url('+`${userInfo.avatar?userInfo.avatar:defaultaAvatar}`+') no-repeat 0 0/100% 100%'}"></view> -->
			</view>
			
			<view class="header-name font22">
				<view class="" style="text-align: center;">
					<input style="text-align: center;" type="text" v-model="userInfo.nickname" />
				</view>
			</view>
			
			<view class="menu flex">
				<view class="menu-title col5A5">uid</view>
				<view class="col5A5"><text class="mr-10">{{userInfo._id}}</text></view>
			</view>
			
			<view class="menu flex">
				<view class="menu-title col5A5">名称</view>
				<view class="col5A5"><text class="mr-10">{{userInfo.username}}</text></view>
			</view>
			
			<view class="menu flex" >
				<view class="menu-title col5A5">手机号</view>
				<view class="col5A5"><text class="mr-10">{{userInfo.phone || '无'}}</text></view>
			</view>
			
			<view class="menu flex">
				<view class="menu-title col5A5">注册时间</view>
				<view class="col5A5"><text class="mr-10">{{$config.dateformat(new Date(userInfo.register_date),'yyyy/MM/dd') }}</text></view>
			</view>
			
			<view class="j-line mb-10"></view>
			
	
			
		<!-- 	<view class="menu flex">
				<view class="menu-title col5A5">门店简介</view>
				<view class="col5A5 font14" style="text-align: left;">
					<text class="mr-10" >{{store.introduction}}</text>
				</view>
			</view> -->
			
			<view class="menu flex" @tap="$skip" :data-url="'/pages/store/my/info/pswEdit?phone='+form.phone">
				<view class="menu-title col5A5">密码</view>
				<view class="col5A5"><text class="mr-10">点击修改密码</text><text class="iconfont icon-youjiantou colccc"></text></view>
			</view>
			
		</view>
		
		
		<view class="footer">
			<!-- <button class="mb-20" type="success" @tap="save">保存修改</button> -->
			<button type="warn" @tap="quit">退出登录</button>
		</view>
		
	</view>
</template>

<script>
	import defaultaAvatar from "@/static/images/avatar.webp"
	import {mapMutations,mapGetters} from 'vuex';
	export default {
		data() {
			return {
				loginUrl:"/pages/common/login/login",
				
				// 默认头像
				defaultaAvatar:"",
				
				// 修改表单
				form:{
					avatar:"",
					
					nickname:"",
					
					phone:""
				},
				
				// 门店信息
				store:{}
			};
		},
		onShow(){
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
			
			// 保存修改
			save(){
				this.$post(this.$api.user.edit,this.form).then(res=>{
					uni.showToast({title:"修改成功",icon:"none"});
					
					uni.setStorage({
						key: "userEdit",
						data: true,
						success: function () {
							uni.switchTab({url:'/pages/store/my/my'});
						}
					});
				})
			},
			
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
					uni.navigateBack()
				});
			}
			
		}
	}
</script>

<style lang="scss">
	.avatar{
		position: absolute;
		left: 50%;
		top: 0;
		transform: translate(-50%,-50%);
		width: 180rpx;
		height: 180rpx;
		background-color: #fff;
		border-radius: 50%;
		.avatar-img{
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%,-50%);
			border-radius: 50%;
			width: 165rpx;
			height: 165rpx;
		}
	}
	
	.header{
		margin:0 50rpx;
		.header-name{
			margin-top: 100rpx;
		}
		.menu{
			padding:10rpx 0 !important;
			align-items: center;
			
			padding-right: 20rpx;
			.menu-title{
				width: 140rpx;
				height: 100%;
				padding:20rpx 0;
				margin-left: 20rpx;
				& + view{
					text-align: right;
					flex: 1;
				}
			}
		}
	}
	.footer{
		margin:80rpx 50rpx 10rpx;
		background:none;
	}
</style>
