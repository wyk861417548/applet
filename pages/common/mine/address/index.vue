<template>
  <!-- j-full-curbox 当前元素占满全屏  j-flex-col flex垂直布局 -->
  <view>
    <view v-if="dataList.length > 0" class="container">
			<radio-group>
				<view v-for="(item,index) in dataList" :key="index" class="list">
					<view class="pb-10 content">
						<view style="font-weight: bold;">{{item.area}}</view>
						<view class="mt-10">
							<text class="mr-15 pb-10">{{item.realName}}</text>
							<text class="col999">{{item.phone}}</text>
						</view>
					</view>

					<view class="pt-10 font14 col5A5 j-flex">
						<label @tap="setDefault(item._id)"><radio  :checked="item.isDefault == true" /><text>设置默认地址</text></label>
						<view class="pr-20">
							<text class="mr-10 iconfont iconxiugai col108" @tap="$skip" :data-url="'/pages/common/mine/address/modify?id='+item._id">编辑</text>
							<text class="iconfont iconxiugai col108" @tap="handleConfim(item._id)">删除</text>
						</view>
					</view>
					
					<view class="mt-20" style="height: 4rpx;background:rgba(221,221,221,.5);"></view>
				</view>
				
			</radio-group>
 
    </view>
		
		<view class="footer j-flex font14 mt-20 mr-15" @tap="$skip" data-url="/pages/common/mine/address/modify">
			<view class="">新增地址</view>
			<view class="iconfont icon-youjiantou" style="font-size: 24rpx;"></view>
		</view>
		
		<view style="height: 20rpx;background:rgba(221,221,221,.5);"></view>


  
  </view>
  
</template>
<script>

export default {
  data () {
    return {
			
      dataList:[],
			
      data:{
				page: 1,
				limit: 20
			},
			
			select:""
    };
  },
	onShow() {
		this.getData();
	},

	
  methods:{
    //获取地址列表
    getData(){
      let data = {
      	action:"getAddress"
      }
      this.$cloud.cloudFn(data).then(res=>{
      	this.dataList = res.data;
      });
    },
		
    //设置默认地址
    setDefault(id){
		let data = {
			action:"setDefalutAddress",
			// 查询索引
			_id:id
		}
		this.$cloud.cloudFn(data).then(res=>{
			uni.showToast({title:"设置成功",icon:"none"})
		});
    },
		
		// 确认是否删除地址弹窗
		handleConfim(id){
			uni.showModal({
			  content: '是否删除地址',
				confirmColor: '#DBA871',
				success: res => {
					if (res.confirm) {
						this.show = false;
						this.handleDel(id);
					}
				}
			})
		},
		
		handleTip(){
			uni.showToast({title:"功能开发中，请等待",icon:"none"})
		},
		
		// 删除地址
		handleDel(id){
			let data = {
				action:"removeAddress",
				// 查询索引
				_id:id
			}
					
			this.$cloud.cloudFn(data).then(res=>{
				uni.showToast({title:"删除成功",icon:"none"})
				this.dataList.map((item,index)=>{
					if(item._id == id){
						this.dataList.splice(index,1)
						return;
					}
				})
				
			});
		}
  },
};
</script>

<style lang="scss" scoped>
  .container{
		padding-left:40rpx;
		.list{
			padding:20rpx 0;
			.content{
				border-bottom: 2rpx solid rgba(238,238,238,.5);
			}
		}
	}
	.footer{
		padding-left:40rpx;
		margin-bottom: 40rpx;
		color: #108EE9;
	}
</style>