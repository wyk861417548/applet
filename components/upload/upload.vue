<template>
	<!-- j-full-curbox 当前元素占满全屏  j-flex-col flex垂直布局 -->
	<view>
		<!-- 设置一些自定义 -->

		<view class="my-upload flex">
			<!-- 已上传图片展示区域 -->
			<view class="uploadList upBox" @click.stop="" v-for='(item,index) in uploadList' :key='index'>
				<slot name="container">
					<image :src="item" style="width:100%;height:100%;" alt="图片" @click="handleView(item)">
					<text class="_del" @click="handleRemove(index)"></text>
				</slot>
			</view>

			<!-- 选择图片区域 -->
			<view v-if="max > uploadList.length" class="upload upBox" @click="chooseImage">
				<text class="j-full-center">+</text>
			</view>

			<!-- 预览图片区域 -->
			<view v-show="preview" @click="closeView" class="preview j-full-curbox ban-child">
				<view class="j-full-center">
					<image :src="previewImg" alt="图片">
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	export default {

		props: {
			// 最大上传数
			max: {
				type: Number,
				default: 1
			},

			// 用于父组件接受已上传的图片名称
			name: {
				typeof: String,
				default: "upload"
			}
		},
		data() {
			return {

				// 预览图片
				preview: false,

				// 预览图片地址
				previewImg: '',

				// 已上传图片
				uploadList: [],
			};
		},

		created() {},

		methods: {
			// 上传图片
			change() {
				// this.chooseImage();
			},
			
			chooseImage(){
				uni.chooseImage({
					count: 1,
					success: res => {
						const path = res.tempFilePaths[0]
						
						uni.getImageInfo({
							src: path,
							success:(info)=>{
								const options = {
									filePath: path,
									cloudPath: Date.now() + '.' + info.type.toLowerCase()
								}
								this.upload(options);
							},
							fail(err) {
								uni.showToast({title:err.errMsg || '未能获取图片类型',icon:"none"})
							}
						})
						
					}
				})
			},
			
			upload(options){
				uni.showLoading({title: '文件上传中...'})
				
				uniCloud.uploadFile({
					...options,
					success:(res)=>{
						// console.log("res",res);
						uni.hideLoading()
						this.uploadList.push(res.fileID);
						uni.showToast({title:"图片上传成功",icon:"none"})
					},
					fail: (err) => {
						uni.hideLoading()
						if (err.message !== 'Fail_Cancel') {
							uni.showModal({
								content: `图片上传失败，错误信息为：${err.message}`,
								showCancel: false
							})
						}
					}
				})
			},

			// 预览大图
			handleView(item) {
				if (item) {
					this.previewImg = item;
					this.preview = true;
				}
			},

			// 关闭大图
			closeView() {
				this.preview = false;
			},

			// 移除图片
			handleRemove(index) {
				console.log("index",index);
				this.uploadList.splice(index, 1)
			}
		},

		watch: {
			uploadList(newVal) {
				var data = {
					name: this.name,
					value: newVal
				}
				console.log("watch",data);
				this.$emit("change", data)
			}
		}
	}
</script>
<style lang="scss" scoped>
	.my-upload {
		.upBox {
			position: relative;
			display: inline-block;
			width: 150rpx;
			height: 150rpx;
			margin: 0 20rpx;
			border: 2rpx dashed #ddd;
			border-radius: 10rpx;
		}

		.upload {
			i {
				color: #ddd;
			}

			&:hover {
				border-color: #108ee9;

				i {
					color: #108ee9;
				}
			}
		}

		.uploadList {
			position: relative;
			border: 2rpx solid rgba(0, 0, 0, 0.3);
			
			._del{
				position: absolute;
				right: 0;
				top: 0;
				width: 40rpx;
				height: 40rpx;
				background-color: rgba(0,0,0,.8);
				border-radius: 50%;
				transform: translate(50%,-50%);
				&::before{
					content: "\2716";
					position: absolute;
					left: 50%;
					top: 50%;
					transform: translate(-50%,-55%);
					color:#fff
				}
			}
		}

		.preview {
			position: fixed;
			z-index: 999;
			background: rgba(0, 0, 0, 0.3);
		}
	}
</style>
