<template>
  <transition name="slide">
    <div class="box">
      <navbar title="我的设置" @back="back" :showClose="showClose"></navbar>
      <div class="list">
        <div class="item" @click="toModifyPwd()">
          <i class="iconfont icon-config" style="color:#2196F3;"></i>
          <span class="text">修改密码</span>
          <i class="iconfont icon-goto fc999"></i>
        </div>
        <div class="btn_area">
          <button class="btn" @click="loginOut()">退出账号</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Navbar from 'base/navbar/navbar'
  import {clearStorage} from 'common/js/storage'
  import 'weui'
  import weui from 'weui.js'

  export default {
    data() {
      return {
        showClose: false
      }
    },
    methods: {
      back() {
        this.$router.back()
      },
      loginOut() {
        weui.confirm('确定要退出账号吗', {
          title: '退出提示',
          buttons: [{
            label: '取消',
            type: 'default',
            onClick: () => {
              console.log('已取消')
            }
          }, {
            label: '确定',
            type: 'primary',
            onClick: () => {
              clearStorage()
              this.$router.push({
                path: '/c-login'
              })
            }
          }]
        })
      },
      toModifyPwd() {
        this.$router.push({
          path: '/c-modify-pwd'
        })
      }
    },
    components: {
      Navbar
    }
  }
</script>

<style scoped lang="scss">
  .box {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 100;
    width: 100%;
    background: #f6f6f6;
  }
  .list{
    padding: 15px 0;
    width: 100%;
    box-sizing: border-box;
    padding-top: 65px;
  }
  .item{
    position: relative;
    height:50px;
    line-height:50px;
    background:#fff;
    color: #333;
    padding:0 10px;
    margin-bottom: 10px;
    transition: all .3s;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
  }
  .item:active{
    background: rgba(0,0,0,.1);
  }
  .item::after{
    content:" ";
    width:200%;
    height:200%;
    position:absolute;
    top:0;
    left:0;
    border-top:1px solid #BDBDBD;
    border-bottom:1px solid #BDBDBD;
    -webkit-transform:scale(0.5);
    transform:scale(0.5);
    -webkit-transform-origin:0 0;
    transform-origin:0 0;
    box-sizing:border-box;
  }
  .item i{
    font-size: 18px;
  }
  .item .text{
    flex: 1;
    font-size: 16px;
    padding-left: 10px;
  }
  .btn_area{
    margin-top: 30px;
    padding:0 15px;
  }
</style>
