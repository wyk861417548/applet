<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import url("@/static/css/common.css");
	
	@import "uview-ui/index.scss";
	// 注意引入外部scss 这样写
	@import "@/static/css/app.scss";
	
	page{
		background-color: #ededed;
	}
</style>
