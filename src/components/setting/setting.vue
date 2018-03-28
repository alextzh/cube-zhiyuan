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
        <div class="btn_area">
          <button class="btn" @click="loginOut()">{{$t('setting.logOut')}}</button>
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
        showClose: false,
        pickerArr: [{label: '简体中文', value: 0, type: 'zh'}, {label: 'English', value: 1, type: 'en'}, {label: '繁体中文', value: 2, type: 'tw'}],
        currentLanguage: ''
      }
    },
    computed: {
      quitTip() {
        return this.$i18n.t('common.quitTip')
      },
      tip1() {
        return this.$i18n.t('setting.tip1')
      },
      confirm() {
        return this.$i18n.t('common.confirm')
      },
      cancel() {
        return this.$i18n.t('common.cancel')
      }
    },
    created() {
      this.$i18n.locale = this.$route.params.lang === 'zh' ? 'zh' : this.$route.params.lang === 'en' ? 'en' : 'tw'
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
      loginOut() {
        weui.confirm(this.tip1, {
          title: this.quitTip,
          buttons: [{
            label: this.cancel,
            type: 'default',
            onClick: () => {
              console.log('已取消')
            }
          }, {
            label: this.confirm,
            type: 'primary',
            onClick: () => {
              clearStorage()
              this.$router.push({
                path: '/login/' + this.$i18n.locale
              })
            }
          }]
        })
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
        weui.picker(this.pickerArr, {
          container: 'body',
          defaultValue: [0],
          onChange: (result) => {
            console.log('change' + result)
          },
          onConfirm: (result) => {
            this.currentLanguage = this.pickerArr[result].label
            this.changeLanguage(this.pickerArr[result].type)
          }
        })
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
