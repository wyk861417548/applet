<template>
  <div v-show="show" class="my-mask">
    <div class="my-dialog" :style="styles">
      <div class="my-dialog-header">
        <slot name="header">标题</slot>
      </div>
      <div class="my-dialog-container">
         <slot name="container">
          内容
         </slot>
      </div>
      <div class="my-dialog-footer">
          <slot name="footer">
            <button class="" @click="cancel">取消</button>
            <button class="bg108 colfff" @click="confirm">确定</button>
          </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:['styles','value'],
  data () {
    return {
      show:false,
      
      boolen:true
    };
  },

  methods: {
    // 确认
    confirm(){
      this.show = false;
      this.$emit("confirm",this.boolen);
    },
    //取消
    cancel(){
      this.show = false;
    }
  },
  watch:{
    // value: {
    //     handler(newVal, oldVal) {
    //         console.info('value changed 2', newVal)
    //     },
    //     deep: true
    // }
  }
}
</script>
<style lang="scss" scoped>
  .my-mask{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background-color: rgba(55,55,55,.6);
    font-size:16px;
    z-index:1444;
    .my-dialog{
      position: absolute;
      top: 20%;
      left: 50%;
      width: 70%;
      transform: translateX(-50%);
      border-radius: 5px;
      box-shadow: 0 4px 12px rgba(0,0,0,.15);
      background:#fff;
      z-index:1444;
      .my-dialog-container{
        overflow: auto;
        max-height:500px;
        border:1px solid #e8eaec;
        border-width: 1px 0;
      }
      .my-dialog-footer{
				display: flex;
				justify-content: flex-end;
        text-align: right;
        .my-dialog-footer-cancel{
          border:none;
        }
        & > button{
          margin-left:15rpx;
					padding:0 20rpx;
					line-height: 60rpx;
					height: 60rpx;
        }
      }
      & > div{
        padding:14px 16px;
      }
    }
  }
 
  
 
</style>