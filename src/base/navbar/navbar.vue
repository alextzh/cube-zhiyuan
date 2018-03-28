<template>
  <div class="navbar" :style="styleObj">
    <div class="back" @click="back" v-if="showBack">
      <i class="iconfont icon-fanhui" :style="{'color': styleObj.color}"></i>
    </div>
    <div class="close" @click="close" v-if="showClose">
      <i class="iconfont icon-guanbi" :style="{'color': styleObj.color}"></i>
    </div>
    <h1 class="title">{{title}}</h1>
  </div>
</template>

<script type="text/ecmascript-6">
  export default{
    name: 'navbar',
    props: {
      showBack: { // 是否显示返回按钮
        type: Boolean,
        default: true
      },
      showClose: { // 是否显示关闭按钮
        type: Boolean,
        default: true
      },
      title: { // 标题
        type: String,
        default: ''
      },
      styleObj: { // 设置背景、字体颜色
        type: Object,
        default: function() {
          return {
            color: '#ffffff',
            background: '#ff5251'
          }
        }
      }
    },
    methods: {
      back() { // 发射返回事件
        this.$emit('back')
      },
      close() { // 发射关闭事件
        this.$emit('close')
      }
    }
  }
</script>

<style scoped lang="scss">
  .navbar{
    position: fixed;
    top: 0;
    display: flex;
    align-items: center;
    height:50px;
    line-height: 50px;
    background: #ff5251;
    color: #fff;
    width: 100%;
    z-index: 999;
    .back,.close{
      position: absolute;
      width: 50px;
      height:50px;
      text-align: center;
      line-height:50px;
      z-index: 99;
      i{
        font-size:18px;
        color: #fff;
      }
    }
    .title{
      flex:1;
      text-align: center;
      font-size: 16px;
    }
  }
</style>
