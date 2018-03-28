<template>
  <transition name="slide">
    <div class="m-container" id="box" ref="container">
      <el-amap vid="amap" :plugin="plugin" class="amap-demo" style="display:none;">
      </el-amap>
      <div class="logo">
        <img src="./logo.png" alt="">
      </div>
      <form class="form_area" method="post" @submit.prevent="sub()">
        <div class="input_area">
          <div class="input_form">
            <i class="iconfont icon-phone"></i>
            <input v-model="user.mobile" maxlength="11" type="number" placeholder="手机号" @focus="onFocus" @blur="onBlur" />
          </div>
          <div class="input_form">
            <i class="iconfont icon-pwd"></i>
            <input v-model="user.password" maxlength="20" type="password" placeholder="密码" @focus="onFocus" @blur="onBlur" />
          </div>
        </div>
        <div class="btn_area">
          <button type="submit" :disabled="btnDisabled" :class="{'weui-btn_disabled': btnDisabled}" class="weui-btn weui-btn_primary"><i :class="{'weui-loading': btnLoading}"></i>{{loginBtnTxt}}</button>
        </div>
      </form>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import $ from 'jquery'
  import * as API from 'common/js/http'
  import {setUserInfo, setPosition, getPosition} from 'common/js/storage'
  import {getMd5, getBJDate} from 'common/js/tool'
  import 'weui'
  import weui from 'weui.js'

  export default{
    data() {
      const self = this
      return {
        user: {
          mobile: '',
          password: ''
        },
        loginBtnTxt: '登录',
        btnLoading: false,
        btnDisabled: false,
        lng: 0,
        lat: 0,
        plugin: [{
          pName: 'Geolocation',
          events: {
            init(o) {
              // o 是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                if (result && result.position) {
                  setPosition(result.position)
                  self.lng = result.position.lng
                  self.lat = result.position.lat
                  self.$nextTick()
                }
              })
            }
          }
        }]
      }
    },
    methods: {
      onFocus() {
        setTimeout(() => {
          const pannel = document.getElementById('box')
          pannel.scrollIntoView(true)
          pannel.scrollIntoViewIfNeeded()
        }, 100)
      },
      onBlur() {
      },
      sub() {
        const param = this.user
        const flag = this.checkMobile(param) && this.checkPwd(param)
        if (flag) {
          this.loginBtnTxt = '登录中'
          this.btnDisabled = true
          this.btnLoading = true
          this.mySubmit(param)
        }
      },
      checkMobile(param) {
        const mobile = param.mobile.trim()
        if (mobile.length === 11) {
          return true
        } else {
          weui.alert('请输入有效的手机号码', {
            title: '提示',
            buttons: [{
              label: '确定',
              type: 'primary',
              onClick: () => { console.log('ok') }
            }]
          })
          return false
        }
      },
      checkPwd(param) {
        const pwd = param.password.trim()
        if (pwd.length <= 0) {
          weui.alert('请输入密码', {
            title: '提示',
            buttons: [{
              label: '确定',
              type: 'primary',
              onClick: () => { console.log('ok') }
            }]
          })
          return false
        } else if (pwd.length < 6 || pwd.length > 20) {
          weui.alert('请输入6-20位密码', {
            title: '提示',
            buttons: [{
              label: '确定',
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
        const userInfo = {
          phone: param.mobile.trim(),
          pwd: param.password.trim()
        }
        $.ajax({
          type: 'POST',
          url: API.api + '/api/v1/login',
          data: userInfo,
          dataType: 'json',
          asyn: false,
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'secret_key': getMd5(),
            'time_stamp': getBJDate().getTime()
          },
          success: (data) => {
            if (!data.ret) {
              weui.toast(data.msg, 500)
              this.loginBtnTxt = '登录'
              this.btnDisabled = false
              this.btnLoading = false
              return false
            }
            const customer_id = data.obj.id
            $.ajax({
              type: 'POST',
              url: API.api + '/api/v1/location/report',
              data: {
                customer_id: customer_id,
                latitude: getPosition().lat,
                longitude: getPosition().lng
              },
              dataType: 'json',
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'secret_key': getMd5(),
                'time_stamp': getBJDate().getTime()
              },
              success: (res) => {
                if (!res.ret) {
                  console.log(res.msg)
                  return false
                }
                console.log(res.msg)
              },
              error: (err) => {
                console.log(err)
              }
            })
            setUserInfo(data.obj)
            weui.toast(data.msg, 500)
            setTimeout(() => {
              this.loginBtnTxt = '登录'
              this.btnDisabled = false
              this.btnLoading = false
              this.$router.push({
                path: '/c-mine'
              })
            }, 500)
          },
          error: (err) => {
            console.log(err)
            weui.toast('网络异常', 500)
            this.loginBtnTxt = '登录'
            this.btnDisabled = false
            this.btnLoading = false
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .m-container {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  .logo{
    margin-top: 50px;
    margin-bottom: 60px;
    text-align: center;
    img{
      display: inline-block;
      width: 240px;
      height: 62px;
    }
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
      font-size: 16px;
      color: #ff5251;
      z-index:1;
    }
    input{
      position: relative;
      height:50px;
      line-height: 16px;
      padding:17px 25px;
      font-size: 16px;
      border-radius: 0;
      outline: none;
      flex: 1;
      border-bottom: 1px solid #BDBDBD;
      box-sizing: border-box;
    }
  }
  .btn_area{
    width:90%;
    margin: 0 auto;
  }
</style>
