<template>
  <transition name="slide">
    <div class="box" id="box">
      <navbar :title="$t('navigator.password')" @back="back" :showClose="showClose"></navbar>
      <div class="content">
        <form class="form_area" method="post" @submit.prevent="formSubmit()">
          <div class="input_area">
            <div class="input_form">
              <i class="iconfont icon-oldpwd"></i>
              <input v-model="password" minlength="6" maxlength="20" type="password" :placeholder="$t('modifyPwd.tip1')" @focus="focus" />
            </div>
            <div class="input_form">
              <i class="iconfont icon-newpwd"></i>
              <input v-model="password1" minlength="6" maxlength="20" type="password" :placeholder="$t('modifyPwd.tip2')" @focus="focus" />
            </div>
            <div class="input_form">
              <i class="iconfont icon-surepwd"></i>
              <input v-model="password2" minlength="6" maxlength="20" type="password" :placeholder="$t('modifyPwd.tip3')" @focus="focus" />
            </div>
          </div>
          <div class="btn_area">
            <button type="submit" :disabled="btnDisabled" :class="{'weui-btn_disabled': btnDisabled}" class="weui-btn weui-btn_primary"><i :class="{'weui-loading': btnLoading}"></i>{{modifyBtnTxt}}</button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import $ from 'jquery'
  import Navbar from 'base/navbar/navbar'
  import * as API from 'common/js/http'
  import {getUserInfo} from 'common/js/storage'
  import {getMd5, getBJDate} from 'common/js/tool'
  import 'weui'
  import weui from 'weui.js'

  export default {
    data() {
      return {
        showClose: false,
        password: '',
        password1: '',
        password2: '',
        btnLoading: false,
        btnDisabled: false
      }
    },
    computed: {
      modifyBtnTxt() {
        return this.$i18n.t('modifyPwd.modifyBtnTxt')
      },
      tip() {
        return this.$i18n.t('common.tip')
      },
      tip1() {
        return this.$i18n.t('modifyPwd.tip1')
      },
      tip2() {
        return this.$i18n.t('modifyPwd.tip2')
      },
      tip3() {
        return this.$i18n.t('modifyPwd.tip3')
      },
      tip4() {
        return this.$i18n.t('modifyPwd.tip4')
      },
      tip5() {
        return this.$i18n.t('modifyPwd.tip5')
      },
      tip6() {
        return this.$i18n.t('modifyPwd.tip6')
      },
      tip7() {
        return this.$i18n.t('modifyPwd.tip7')
      },
      modifyTip() {
        return this.$i18n.t('common.modifyTip')
      },
      netWork() {
        return this.$i18n.t('common.network')
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
    },
    methods: {
      back() {
        this.$router.back()
      },
      focus() {
        setTimeout(() => {
          const pannel = document.getElementById('box')
          pannel.scrollIntoView(true)
          pannel.scrollIntoViewIfNeeded()
        }, 200)
      },
      formSubmit() {
        const param = {
          password: this.password,
          password1: this.password1,
          password2: this.password2
        }
        var flag = this.checkPassword(param) && this.checkNewPassword(param)
        if (flag) {
          weui.confirm(this.tip7, {
            title: this.modifyTip,
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
                this.btnDisabled = true
                this.btnLoading = true
                this.mySubmit(param)
              }
            }]
          })
        }
      },
      checkPassword(param) {
        var password = param.password.trim()
        if (!password) {
          weui.alert(this.tip1, {
            title: this.tip,
            buttons: [{
              label: this.confirm,
              type: 'primary',
              onClick: () => { console.log('ok') }
            }]
          })
          return false
        } else if (password.length < 6 || password.length > 20) {
          weui.alert(this.tip4, {
            title: this.tip,
            buttons: [{
              label: this.confirm,
              type: 'primary',
              onClick: () => { console.log('ok') }
            }]
          })
          return false
        } else {
          return true
        }
      },
      checkNewPassword(param) {
        var password1 = param.password1.trim()
        var password2 = param.password2.trim()
        if (!password1 || !password2) {
          weui.alert(this.tip2, {
            title: this.tip,
            buttons: [{
              label: this.confirm,
              type: 'primary',
              onClick: () => { console.log('ok') }
            }]
          })
          return false
        } else if (password1.length < 6 || password1.length > 20) {
          weui.alert(this.tip5, {
            title: this.tip,
            buttons: [{
              label: this.confirm,
              type: 'primary',
              onClick: () => { console.log('ok') }
            }]
          })
          return false
        } else if (password2.length < 6 || password2.length > 20) {
          weui.alert(this.tip5, {
            title: this.tip,
            buttons: [{
              label: this.confirm,
              type: 'primary',
              onClick: () => { console.log('ok') }
            }]
          })
          return false
        } else if (password1 !== password2) {
          weui.alert(this.tip6, {
            title: this.tip,
            buttons: [{
              label: this.confirm,
              type: 'primary',
              onClick: () => { console.log('ok') }
            }]
          })
          return false
        } else {
          return true
        }
      },
      mySubmit(param) {
        const customer_id = getUserInfo().id
        $.ajax({
          type: 'POST',
          url: API.api + '/api/v1/login/updatePwd',
          data: {
            old_pwd: param.password.trim(),
            new_pwd: param.password1.trim(),
            customer_id: customer_id
          },
          dataType: 'json',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'secret_key': getMd5(),
            'time_stamp': getBJDate().getTime()
          },
          success: (data) => {
            if (!data.ret) {
              weui.toast(data.msg, 500)
              this.btnDisabled = false
              this.btnLoading = false
              return false
            }
            weui.toast(data.msg, 500)
            setTimeout(() => {
              this.btnDisabled = false
              this.btnLoading = false
              this.$router.push({
                path: '/' + this.$i18n.locale
              })
            }, 500)
          },
          error: (err) => {
            console.log(err)
            weui.toast(this.netWork, 500)
            this.btnDisabled = false
            this.btnLoading = false
          }
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
  left: 0;
  right: 0;
  z-index: 100;
  background: #fff;
}
.content {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 65px;
}
.form_area{
  display:flex;
  flex-direction:column;
  width:100%;
}
.input_area{
  flex:1;
  padding:0 15px;
  margin-bottom: 40px;
  margin-top: 10px;
}
.input_form{
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  i{
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
    color: #ff5251;
    z-index:1;
  }
  input{
    position: relative;
    height:50px;
    line-height: 16px;
    padding:17px 25px;
    outline: none;
    flex: 1;
    font-size: 16px;
    border-radius: 0;
    border-bottom: 1px solid #BDBDBD;
    box-sizing: border-box;
  }
}
.btn_area{
  width:90%;
  margin: 0 auto;
}
</style>
