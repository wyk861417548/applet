<template>
	<view class="j-full-curbox" style="overflow: hidden;">
		<view class="menu flex">
			<view class="menu-title">姓名</view>
			<input type="text" v-model="form.realName" placeholder="请输入姓名"/>
		</view>
		
		<view class="menu flex">
			<view class="menu-title">联系电话</view>
			<input type="phone"  v-model="form.phone" maxlength="11" placeholder="请输入联系电话"/>
		</view>
		
		<view class="menu flex">
			<view class="menu-title">地址</view>
			<input  @click="showPicker" type="text" v-model="form.area" disabled="true"  placeholder="请选择区域"/>
		</view>
		
		<view class="menu flex">
			<view class="menu-title">详细地址</view>
			<input type="text" v-model="form.detail" placeholder="请输入详细地址" />
		</view>
		
		<view class="mt-30 pl-30">
			<checkbox-group  @change="checkboxChange">
				<label class="radio"><checkbox value="true" :checked="form.isDefault" />设置为默认地址</label>
			</checkbox-group>
		</view>
		
		<button v-if="show" type="primary" style="width: 80%;margin: 60rpx auto;" @tap="addStore">保存</button>
		
		<button v-if="!show" type="warn" style="width: 80%;margin: 60rpx auto;" @tap="editStore">修改</button>
	
		<!-- 多级联动组件 -->
		<um-pickers @confirm="confirmPicker" v-if="picker.length > 0" ref="picker" :picker="picker"></um-pickers>
	</view>
</template>

<script>
	import {mapGetters} from 'vuex';
	import city_code from '@/static/json/city_code.json'
	export default {
		data() {
			return {
				show:true,
				
				// picker 组件数据
				picker:[],
				
				// 提交表单
				form:{
					// 地址信息
					address:{},
					
					// 联动选择 地址
					area:"",
					
					//详细地址
					detail:"",
					
					//设置为默认地址
					isDefault: true,
					
					phone:"",
					
					realName:""
				},
				
				// 表单验证规则
				rules:{
					realName:{datatype:"Require",msg:"请填写姓名"},
					
					phone:{datatype:"Phone",msg:"请填写手机号码"},
					
					area:{datatype:"Require",msg:"请选择地址"},
					
					detail:{datatype:"Require",msg:"请填写详细地址"}
				}
				
			};
		},
		onShow(){
			
		},
		onLoad(param) {
			this.picker = city_code;
			
			return;
			if(param.id){
				this.show = false;
				this.getAddressDetail(param.id);
			}
			
		},
		
		computed: {
			...mapGetters({
				'userInfo': 'user/info'
			})
		},
		
		methods:{
			// 新增地址
			addStore(){
				//表单验证
				if(!this.$validator.validate(this.form,this.rules)) return;
				
				this.$post(this.$api.my.address.edit,this.form).then(res=>{
					uni.showToast({title:"新增成功",icon:"none"})
					uni.navigateBack()
				})
			},
			
			// 选择框状态改变
			checkboxChange(e){
				var boolean = e.detail.value[0];
				if(boolean){
					this.form.isDefault = true;
				}else{
					this.form.isDefault = false;
				}
			},
			
			// 修改地址
			editStore(){
				this.$post(this.$api.my.address.edit,this.form).then(res=>{
					uni.showToast({title:"修改成功",icon:"none"})
					uni.navigateBack()
				})
			},
			
			// 获取地址详情
			getAddressDetail(id){
				this.$get(this.$api.my.address.detail+id).then(res=>{
					var data = res.data;
					console.log("this.form.area",this.form.area);
					this.form = {
						address:{
							province:data.province,
							city:data.city,
							district:data.district,
							cityId:data.cityId
						},
						area:[data.province,data.city,data.district].join('/'),
						id:data.id,
						detail:data.detail,
						isDefault: data.isDefault,
						phone:data.phone,
						realName:data.realName
					}
				})
			},
			
			// 获取地址栏三级联动信息
			getArea(){
				this.$get('../').then(res=>{
					if(res.data && res.data.length > 0){
						this.picker = res.data;
					}
				})
			},
		
			// 显示picker组件
			showPicker(){
				this.$refs.picker.show =true;
			},
			
			// picker 组件选中
			confirmPicker(value){
				let cityArr = [];
				
				var obj = {};
				
				var _data = this.picker[value[0]];
				
				let city_ ;
				
				
				// 省
				obj.province = _data.value;
				
				// 市
				if(_data.childs){
					obj.city = _data.childs[value[1]].value;
					city_ = _data.childs[value[1]];
				}
				
		
				//区
				if(city_ &&  city_.childs){
					obj.district = city_.childs[value[2]].value;
				}
				
				for (let key in obj) {
					if(key){
						cityArr.push(obj[key])
					}
				}
			
				this.form.area = cityArr.join('/')
				
				this.form.address = obj;
				
			}
			
			
		}
	}
</script>

<style lang="scss">
	.menu{
		padding:20rpx 60rpx 20rpx 0;
		align-items: center;
		border-bottom: 2rpx solid rgba(238,238,238,.5);
		margin-left: 30rpx;
		.avatar{
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			overflow: hidden;
		}
		.menu-title{
			font-weight:bold;
			width: 200rpx;
			height: 100%;
			padding:20rpx 0;
			margin-left: 20rpx;
		}
	}
	.footer{
		width: 80%;
		margin:80rpx auto 0;
	}
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
