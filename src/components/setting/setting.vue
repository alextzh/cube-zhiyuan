<template>
  <transition name="slide">
    <div class="box">
      <navbar :title="$t('navigator.setting')" @back="back" :showClose="showClose"></navbar>
      <div class="list">
        <div class="item" @click="toTransfer()">
          <i class="iconfont icon-payment" style="color:#FF0000;"></i>
          <span class="text">{{$t('navigator.transferApply')}}</span>
          <i class="iconfont icon-goto fc999"></i>
        </div>
        <div class="item" @click="toTransferRecord()">
          <i class="iconfont icon-record" style="color:#AB5EA2;"></i>
          <span class="text">{{$t('navigator.transferRecord')}}</span>
          <i class="iconfont icon-goto fc999"></i>
        </div>
        <div class="item" @click="toModifyPwd()">
          <i class="iconfont icon-config" style="color:#2196F3;"></i>
          <span class="text">{{$t('setting.modifyPwd')}}</span>
          <i class="iconfont icon-goto fc999"></i>
        </div>
        <div class="item" @click="toSwitchLanguage()">
          <i class="iconfont icon-qiehuan" style="color:#ff5251;"></i>
          <span class="text">{{$t('setting.language')}}</span>
          <span class="value" >{{currentLanguage}}</span>
        </div>
        <div class="item">
          <i class="iconfont icon-qiehuan" style="color:#ff5251;"></i>
          <span class="text">自动登录</span>
          <cube-switch v-model="isAuto" @click="changeState"></cube-switch>
        </div>
        <div class="btn_area">
          <cube-button @click="loginOut()">{{$t('setting.logOut')}}</cube-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Navbar from 'base/navbar/navbar'
  import {clearStorage} from 'common/js/storage'
  import {showDialog, showPicker, showToast} from 'common/js/cubeTool'

  export default {
    data() {
      return {
        showClose: false,
        pickerArr: [{text: '简体中文', value: 0, type: 'zh'}, {text: 'English', value: 1, type: 'en'}, {text: '繁体中文', value: 2, type: 'tw'}],
        currentLanguage: '',
        isAuto: false
      }
    },
    computed: {
      quitTip() {
        return this.$i18n.t('common.quitTip')
      },
      tip1() {
        return this.$i18n.t('setting.tip1')
      },
      tip2() {
        return this.$i18n.t('setting.tip2')
      },
      confirm() {
        return this.$i18n.t('common.confirm')
      },
      cancel() {
        return this.$i18n.t('common.cancel')
      },
      switchLanguage() {
        return this.$i18n.t('setting.language')
      }
    },
    created() {
      const AUTO = window.localStorage.getItem('__auto__')
      console.log(AUTO)
      this.$i18n.locale = this.$route.params.lang === 'zh' ? 'zh' : this.$route.params.lang === 'en' ? 'en' : 'tw'
      this.isAuto = AUTO === 'Y' ? true : AUTO === 'N' ? false : null
    },
    watch: {
      isAuto(newVal) {
        console.log(newVal)
        if (newVal) {
          window.localStorage.setItem('__auto__', 'Y')
          showToast('自动登录已开启', 'correct')
        } else {
          window.localStorage.setItem('__auto__', 'N')
          showToast('自动登录已关闭', 'correct')
        }
      }
    },
    mounted() {
      if (this.$i18n.locale === 'zh') {
        this.currentLanguage = '简体中文'
      } else if (this.$i18n.locale === 'en') {
        this.currentLanguage = 'English'
      } else if (this.$i18n.locale === 'tw') {
        this.currentLanguage = '繁体中文'
      }
    },
    methods: {
      back() {
        this.$router.back()
      },
      changeState() {
        if (!this.isAuto) {
          window.localStorage.setItem('__auto__', 'Y')
          showToast('自动登录已开启', 'correct')
        } else {
          window.localStorage.setItem('__auto__', 'N')
          showToast('自动登录已关闭', 'correct')
        }
      },
      loginOut() {
        showDialog(this.quitTip, this.tip1, this.confirm, this.cancel, this.confirmFn, this.cancelFn)
      },
      confirmFn() {
        clearStorage()
        showToast(this.tip2, 'correct')
        window.localStorage.removeItem('__phone__')
        window.localStorage.removeItem('__pwd__')
        setTimeout(() => {
          this.$router.push({
            path: '/login/' + this.$i18n.locale
          })
        }, 500)
      },
      cancelFn() {
        console.log('cancel')
      },
      toTransfer() {
        this.$router.push({
          path: '/transfer-apply/' + this.$i18n.locale
        })
      },
      toTransferRecord() {
        this.$router.push({
          path: '/transfer-record/' + this.$i18n.locale
        })
      },
      toModifyPwd() {
        this.$router.push({
          path: '/modify-pwd/' + this.$i18n.locale
        })
      },
      toSwitchLanguage() {
        showPicker(this.switchLanguage, this.pickerArr, 0, this.cancel, this.confirm, this.selectPlanFn, this.cancelPlanFn)
      },
      cancelPlanFn() {
        console.log('cancel')
      },
      selectPlanFn(selectedVal, selectedIndex, selectedText) {
        this.currentLanguage = selectedText[0]
        this.changeLanguage(this.pickerArr[selectedIndex].type)
      },
      changeLanguage(lang) {
        if (this.$route.params.lang !== lang) {
          this.$i18n.locale = lang
          const newPath = this.$route.path.substring(0, -2) + lang
          this.$router.replace(newPath)
        }
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
