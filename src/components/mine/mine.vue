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
        <div class="weui-grids">
          <a href="javascript:;" class="weui-grid" @click="toNotice">
            <div class="weui-grid__icon">
              <img src="./notice.svg" alt="">
            </div>
            <p class="weui-grid__label">{{$t('navigator.notice')}}</p>
          </a>
          <a href="javascript:;" class="weui-grid" @click="toPurchase">
            <div class="weui-grid__icon">
              <img src="./shengou.svg" alt="">
            </div>
            <p class="weui-grid__label">{{$t('navigator.purchase')}}</p>
          </a>
          <a href="javascript:;" class="weui-grid" @click="toPurchaseRecord">
            <div class="weui-grid__icon">
              <img src="./shengoujilu.svg" alt="">
            </div>
            <p class="weui-grid__label">{{$t('navigator.purchaseRecord')}}</p>
          </a>
          <a href="javascript:;" class="weui-grid" @click="toRedeemRecord">
            <div class="weui-grid__icon">
              <img src="./shuhuijilu.svg" alt="">
            </div>
            <p class="weui-grid__label">{{$t('navigator.redeemRecord')}}</p>
          </a>
          <a href="javascript:;" class="weui-grid" @click="toProductPlan" v-if="isShowPlan">
            <div class="weui-grid__icon">
              <img src="./fanganxiugai.svg" alt="">
            </div>
            <p class="weui-grid__label">{{$t('navigator.plan')}}</p>
          </a>
          <a href="javascript:;" class="weui-grid" @click="toManagement">
            <div class="weui-grid__icon">
              <img src="./management.svg" alt="">
            </div>
            <p class="weui-grid__label">{{$t('navigator.contract')}}</p>
          </a>
          <a href="javascript:;" class="weui-grid" @click="toQuestion">
            <div class="weui-grid__icon">
              <img src="./question.svg" alt="">
            </div>
            <p class="weui-grid__label">{{$t('navigator.question')}}</p>
          </a>
          <a href="tel:400-000-6887" class="weui-grid">
            <div class="weui-grid__icon">
              <img src="./dianhua.svg" alt="">
            </div>
            <p class="weui-grid__label">{{$t('navigator.contact')}}</p>
          </a>
          <a href="javascript:;" class="weui-grid" @click="toSetting">
            <div class="weui-grid__icon">
              <img src="./shezhi.svg" alt="">
            </div>
            <p class="weui-grid__label">{{$t('navigator.setting')}}</p>
          </a>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import $ from 'jquery'
import * as API from 'common/js/http'
import {getUserInfo} from 'common/js/storage'
import {getMd5, getBJDate} from 'common/js/tool'
import 'weui'
import weui from 'weui.js'

export default {
  data() {
    return {
      userInfo: null,
      isShowPlan: false
    }
  },
  computed: {
    netWork() {
      return this.$i18n.t('common.network')
    }
  },
  created() {
    var lang = this.$i18n.locale
    if (lang !== this.$route.params.lang) {
      const newPath = this.$route.path.substring(0, -2) + lang
      this.$router.replace(newPath)
    }
    this.userInfo = getUserInfo()
  },
  mounted() {
    setTimeout(() => {
      this.hasProductPlan()
    }, 20)
  },
  methods: {
    /**
     * 是否显示更改方案
    */
    hasProductPlan() {
      const customer_id = getUserInfo().id
      $.ajax({
        type: 'POST',
        url: API.api + '/api/v1/product/myFAproducts',
        data: {
          customer_id: customer_id
        },
        dataType: 'json',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'secret_key': getMd5(),
          'time_stamp': getBJDate().getTime()
        },
        success: (res) => {
          if (!res.ret) {
            this.isShowPlan = false
          } else {
            this.isShowPlan = true
          }
        },
        error: (err) => {
          console.log(err)
          weui.toast(this.netWork, 500)
        }
      })
    },
    toPurchase() {
      this.$router.push({
        path: '/purchase/' + this.$i18n.locale
      })
    },
    toPurchaseRecord() {
      this.$router.push({
        path: '/purchase-record/' + this.$i18n.locale
      })
    },
    toRedeemRecord() {
      this.$router.push({
        path: '/redeem-record/' + this.$i18n.locale
      })
    },
    toProductPlan() {
      this.$router.push({
        path: '/product-plan/' + this.$i18n.locale
      })
    },
    toNotice() {
      this.$router.push({
        path: '/notice/' + this.$i18n.locale
      })
    },
    toManagement() {
      this.$router.push({
        path: '/management/' + this.$i18n.locale
      })
    },
    toQuestion() {
      this.$router.push({
        path: '/question/' + this.$i18n.locale
      })
    },
    toSetting() {
      this.$router.push({
        path: '/setting/' + this.$i18n.locale
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
.weui-grids {
  margin: 15px 0;
  background: #fff;
}
.weui-grid:before {
  border-right: 0;
}
.weui-grid:after {
  border-bottom: 0;
}
</style>
