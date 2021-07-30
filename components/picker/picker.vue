<template>
	<view class="cart-popup">
		<view class="popup-layer mask"  :class="show?'mask-show':''" @tap="close"></view>
		<view class="popup-content" :style="{'transform':show?'translate(0)':''}">
			<view class="header">
				<view class="header-left" @tap="close">取消</view>
				<view>请选择</view>
				<view class="header-right" @tap="confirm">确定</view>
			</view>

			<slot>
				<picker-view :value="value" :indicator-style="indicatorStyle" @change="bindChange" class="picker-view">
					<picker-view-column>
						<view class="item" v-for="(item,index) in picker" :key="index">{{item.name}}</view>
					</picker-view-column>
					<picker-view-column v-show="picker[value[0]].child">
						<view class="item" v-for="(item,index) in picker[value[0]].child" :key="index">{{item.name}}</view>
					</picker-view-column>
					<picker-view-column v-show="picker[value[0]].child[value[1]].child">
						<view class="item" v-for="(item,index) in picker[value[0]].child[value[1]].child" :key="index">{{item.name}}</view>
					</picker-view-column>
				</picker-view>
			</slot>
		</view>
	</view>
</template>

<script>
	export default {
		props:["picker"],
		data() {
			return {
				// 设置选择器中间选中框的样式
				indicatorStyle:"height: 50px;",
				
				// 显示隐藏
				show:false,
				
				value:[0,0,0],
				
				// city:this.picker[value[0]].child,
				
				// area:this.picker[value[0]].child[value[1]].child
			}
		},
		onShow() {
		},
		computed:{
			goodCartNum() {	//计算单个饮品添加到购物车的数量
			},
		},
		methods: {
			
			// 确定选择
			confirm(){
				this.$emit("confirm",this.value)
				this.show = false;
			},
			
			// 关闭详情
			close(){
				this.show = false;
			},
			
			// 滚动获取
			bindChange(e) {
				const val = e.detail.value;
				
				this.value = [val[0],val[1],val[2]];
				console.log("val",val);
			},
		}
	}
</script>

<style lang="scss" scoped>
	// 弹窗样式
	.mask{
		opacity: 0;
		transition: all .3s ease-in-out;
		background: rgba(0, 0, 0, 0.3);
		visibility: hidden;
	}
	.mask-show{
		visibility: visible !important;
		opacity: 1 !important;
	}
	.cart-popup{
		.popup-layer{
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			margin: 0;
			z-index: 665;
		}
		.popup-content{
			position: absolute;
			background: #fff;
			bottom: 0;
			transition: all .3s linear;
			transform: translateY(150%);
			// padding-bottom:400rpx;
			height: 600rpx;
			width: 100%;
			z-index: 666;
			.cart-list{
				padding: 20rpx 0;
				max-height: 40vh;
				min-height: 0;
			}
			.header{
				display: flex;
				justify-content: space-between;
				background-color: #E8EACF;
				color: #ADB838;
				padding: 16rpx 20rpx;
				font-size: 28rpx;
				text-align: right;
			}
			.content{
				.left{
					margin:0 40rpx;
					image{
						width: 100rpx;
					}
				}
				.right{
					flex: 1;
					border-bottom:2rpx solid rgba(226,226,226,.4);
					padding:20rpx;
				}
			}
		}
	}
	
	// picker样式
	.picker-view {
		width: 750rpx;
		height: 600rpx;
		margin-top: 20rpx;
	}
	.item {
		height: 50px;
		align-items: center;
		justify-content: center;
		text-align: center;
	}
</style>
