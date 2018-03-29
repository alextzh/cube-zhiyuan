<template>
  <transition name="slide">
    <div class="box">
      <div class="content">
        <div class="user_box">
          <img class="bg_img" src="./bg.png" />
          <div class="info_box">
            <img class="user_avatar" src="./avatar.jpg" />
            <div class="user_msg">
              <p class="name">{{userInfo.name}}</p>
              <p class="mobile">{{userInfo.phone}}</p>
            </div>
          </div>
        </div>
        <div class="grids">
          <a href="javascript:;" class="grid" @click="toPurchase">
            <div class="grid__icon">
              <img src="./shengou.svg" alt="">
            </div>
            <p class="grid__label">立即申购</p>
          </a>
          <a href="javascript:;" class="grid" @click="toPurchaseRecord">
            <div class="grid__icon">
              <img src="./shengoujilu.svg" alt="">
            </div>
            <p class="grid__label">申购记录</p>
          </a>
          <a href="javascript:;" class="grid" @click="toRedeemRecord">
            <div class="grid__icon">
              <img src="./shuhuijilu.svg" alt="">
            </div>
            <p class="grid__label">赎回记录</p>
          </a>
          <a href="tel:400-000-6887" class="grid">
            <div class="grid__icon">
              <img src="./dianhua.svg" alt="">
            </div>
            <p class="grid__label">联系我们</p>
          </a>
          <a href="javascript:;" class="grid" @click="toSetting">
            <div class="grid__icon">
              <img src="./shezhi.svg" alt="">
            </div>
            <p class="grid__label">我的设置</p>
          </a>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {getUserInfo} from 'common/js/storage'

  export default {
    data() {
      return {
        userInfo: null
      }
    },
    created() {
      this.userInfo = getUserInfo()
    },
    methods: {
      toPurchase() {
        this.$router.push({
          path: '/c-purchase'
        })
      },
      toPurchaseRecord() {
        this.$router.push({
          path: '/c-purchase-record'
        })
      },
      toRedeemRecord() {
        this.$router.push({
          path: '/c-redeem-record'
        })
      },
      toSetting() {
        this.$router.push({
          path: '/c-setting'
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .box {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 100;
    width: 100%;
    background: #f6f6f6;
  }
  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .user_box {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 30%;
    -webkit-transform-origin: top;
    transform-origin: top;
    background-size: cover;
    box-sizing: border-box;
    border: 0;
    outline: 0;
  }
  .bg_img {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 0;
  }
  .info_box {
    position: absolute;
    top: 50%;
    text-align: center;
    z-index: 50;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 20px;
  }
  .user_avatar {
    flex: 0 0 60px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
  .user_msg {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    flex: 1;
    padding-left: 20px;
    overflow: hidden;
    line-height: 1.5;
  }
  .user_msg .name {
    font-size: 16px;
    color: #fff;
  }
  .user_msg .mobile {
    color: #fff;
    font-size: 14px;
  }
  .grids {
  position: relative;
  overflow: hidden;
  margin: 15px 0;
  background: #fff;
}
.grids:before {
  content: " ";
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 1px;
  border-top: none;
  color: #D9D9D9;
  transform-origin: 0 0;
  transform: scaleY(0.5);
}
.grids:after {
  content: " ";
  position: absolute;
  left: 0;
  top: 0;
  width: 1px;
  bottom: 0;
  border-left: none;
  color: #D9D9D9;
  transform-origin: 0 0;
  transform: scaleX(0.5);
}
.grid{
  position: relative;
  float: left;
  padding: 20px 10px;
  width: 33.33333333%;
  box-sizing: border-box;
}
.grid:before {
  content: " ";
  position: absolute;
  right: 0;
  top: 0;
  width: 1px;
  bottom: 0;
  border-right: none;
  color: #D9D9D9;
  transform-origin: 100% 0;
  transform: scaleX(0.5);
}
.grid:after {
  content: " ";
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1px;
  border-bottom: none;
  color: #D9D9D9;
  -webkit-transform-origin: 0 100%;
  transform-origin: 0 100%;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
.grid__icon {
  width: 28px;
  height: 28px;
  margin: 0 auto;
}
.grid__icon img {
  display: block;
  width: 100%;
  height: 100%;
}
.grid__label {
  display: block;
  text-align: center;
  color: #000000;
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.grid__icon + .grid__label {
  margin-top: 5px;
}
</style>
