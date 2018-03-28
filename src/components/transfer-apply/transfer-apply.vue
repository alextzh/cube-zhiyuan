<template>
  <transition name="slide">
    <div class="box">
      <navbar :title="$t('navigator.transferApply')" @back="back" :showClose="showClose"></navbar>
      <div style="padding: 10px;width: 100%;box-sizing: border-box;margin-top:50px;" v-if="showArr.length > 0">
        <div class="form_box">
          <form class="form_area" method="post" @submit.prevent="formSubmit()">
            <div style="padding: 0 10px;">
              <div class="select_type" v-if="pickerArr.length > 1">
                <i class="iconfont icon-unfold"></i>
                <span class="type_title">{{$t('purchase.schemeType')}}：</span>
                <input type="text" palceholder="请选择方案类型" @click="selectPlan" readonly :value="curValue" />
              </div>
            </div>
            <div style="padding: 10px;" v-if="showArr.length === 1">
              <div class="item_body">
                <div class="item__left" style="width:65%;">
                  <span>{{$t('purchase.productName')}}：</span>
                  <span class="new_data">{{currentPlan.name}}</span>
                </div>
                <div class="item__right" style="width:35%;text-align:right;">
                  <span style="flex:1;">{{$t('purchase.maxNumber')}}：</span>
                  <span class="all_data" style="flex:0 auto;">{{currentPlan.max_amount}}</span>
                </div>
              </div>
              <!--<div class="item_foot" style='display:flex'>-->
                <!--<span>{{$t('purchase.settlementTime')}}：</span>-->
                <!--<div style="flex:1;display:flex;flex-wrap:wrap;">-->
                  <!--<div style="display:flex;width:50%;" v-for="(t, i) in currentPlan.settlement_time" :key="i">-->
                    <!--<span style="flex:1">{{t}}</span>-->
                  <!--</div>-->
                <!--</div>-->
              <!--</div>-->
              <div class="item_foot" style="display: flex;">
                <span>{{$t('purchase.productDetail')}}：</span>
                <div style="flex: 1;">
                  <span style="line-height: 1;">{{currentPlan.describe}}</span>
                </div>
              </div>
            </div>
            <div style="padding: 0 10px 5px;" v-if="showArr.length > 1">
              <div class="item_body">
                <div class="item__left" style="width:65%;">
                  <span>{{$t('purchase.schemeName')}}：</span>
                  <span class="new_data">{{currentPlan.name}}</span>
                </div>
                <div class="item__right" style="width:35%;text-align:right;">
                  <span style="flex:1;">{{$t('purchase.maxNumber')}}：</span>
                  <span class="all_data" style="flex:0 auto;">{{currentPlan.max_amount}}</span>
                </div>
              </div>
              <!--<div class="item_foot" style='display:flex'>-->
                <!--<span>{{$t('purchase.settlementTime')}}：</span>-->
                <!--<div style="flex:1;display:flex;flex-wrap:wrap;">-->
                  <!--<div style="display:flex;width:50%;" v-for="(t, i) in currentPlan.settlement_time" :key="i">-->
                    <!--<span style="flex:1">{{t}}</span>-->
                  <!--</div>-->
                <!--</div>-->
              <!--</div>-->
              <div class="item_foot" style="display: flex;">
                <span>{{$t('purchase.schemeDetail')}}：</span>
                <div style="flex: 1;">
                  <span>{{currentPlan.describe}}</span>
                </div>
              </div>
            </div>
            <div style="padding: 0 10px;">
              <div class="select_type" v-if="pickerArr.length > 1">
                <i class="iconfont icon-unfold"></i>
                <span class="type_title">{{$t('purchase.transferChannel')}}：</span>
                <input type="text" palceholder="请选择划款渠道" @click="selectChannel" readonly :value="currentChannel.label" />
              </div>
              <div class="input_area" style="height:auto;">
                <div class="input_form">
                  <i class="iconfont icon-redeemed"></i>
                  <span class='unit'>份</span>
                  <input type="number" v-model="purchaseAmt" :placeholder="$t('purchase.tip9')" />
                </div>
              </div>
              <div class="input_area" style="height:auto;margin-top:10px;">
                <div class="input_con" style="height:auto;">
                  <div class="weui-cell editbox">
                    <div class="weui-cell__bd">
                      <textarea class="weui-textarea" v-model="describe" :placeholder="$t('purchase.tip15')" rows="5"></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div class="btn_area">
                <button type="submit" :disabled="btnDisabled" :class="{'weui-btn_disabled': btnDisabled}" class="weui-btn weui-btn_primary"><i :class="{'weui-loading': btnLoading}"></i>{{transferBtnTxt}}</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div v-if="hasData" class="noData">
        <div class="no_data">
          <i class="iconfont icon-nodata"></i>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Navbar from 'base/navbar/navbar'
  import {getUserInfo} from 'common/js/storage'
  import {rendererZhMoneyWan, _normalizeDate, _normalizeStr, getMd5, getBJDate} from 'common/js/tool'
  import $ from 'jquery'
  import * as API from 'common/js/http'
  import Plan from 'common/js/plan'
  import 'weui'
  import weui from 'weui.js'

  export default {
    data() {
      return {
        showClose: false,
        showArr: [],
        pickerArr: [],
        curValue: '',
        currentPlan: null,
        customer_id: '',
        purchaseAmt: '',
        btnLoading: false,
        btnDisabled: false,
        hasData: false,
        describe: '',
        channelArr: [{type: 'VIP', label: 'VIP账户', value: 0}, {type: 'YHKZC', label: '银行卡转账', value: 1}],
        currentChannel: null
      }
    },
    computed: {
      transferBtnTxt() {
        return this.$i18n.t('purchase.transferBtnTxt')
      },
      tip() {
        return this.$i18n.t('common.tip')
      },
      tip1() {
        return this.$i18n.t('purchase.tip9')
      },
      tip2() {
        return this.$i18n.t('purchase.tip11')
      },
      tip3() {
        return this.$i18n.t('purchase.tip10')
      },
      tip4() {
        return this.$i18n.t('purchase.tip12')
      },
      tip5() {
        return this.$i18n.t('purchase.tip14')
      },
      tip6() {
        return this.$i18n.t('purchase.tip13')
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
      this.customer_id = getUserInfo().id
      this.currentChannel = this.channelArr[0]
      // this.isTransfer()
    },
    mounted() {
      this.$nextTick(() => {
        this.getSubProductList()
        // this.timer = setInterval(() => {
        //   this.isTransfer()
        // }, 1000)
      })
    },
    // destroyed() {
    //   clearInterval(this.timer)
    // },
    methods: {
      back() {
        this.$router.back()
      },
      // 判断当前时间是否可以申请划款
      // isTransfer() {
      //   if (time_range('09:00', '17:30')) {
      //     this.btnDisabled = false
      //   } else {
      //     this.btnDisabled = true
      //   }
      // },
      /**
       * 获取申请划款可以选择的项目
      */
      getSubProductList() {
        $.ajax({
          type: 'POST',
          url: API.api + '/api/v1/deduct/productList',
          dataType: 'json',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'secret_key': getMd5(),
            'time_stamp': getBJDate().getTime()
          },
          success: (res) => {
            if (!res.ret) {
              weui.toast(res.msg, 500)
              this.hasData = true
              return false
            }
            var list = res.obj.reverse()
            var pickerArr = []
            var showArr = list
            if (showArr.length > 0) {
              showArr.forEach((item, index) => {
                item.settlement_time = _normalizeStr(item.settlement_time)
                pickerArr.push(new Plan({
                  label: item.name,
                  value: index
                }))
              })
              this.pickerArr = pickerArr
              this.showArr = showArr
              this.currentPlan = showArr[0]
              this.curValue = pickerArr[0].label
              this.hasData = false
            }
          },
          error: (err) => {
            console.log(err)
            weui.toast(this.netWork, 500)
          }
        })
      },
      _normalizeList(list) {
        if (list === []) {
          return []
        } else {
          for (let i = 0; i < list.length; i++) {
            list[i].caopan_time = _normalizeDate(list[i].caopan_time)
            list[i].expect_quota = rendererZhMoneyWan(list[i].expect_quota)
            list[i].sg_start_time = _normalizeDate(list[i].sg_start_time)
            list[i].sg_end_time = _normalizeDate(list[i].sg_end_time)
            list[i].settlement_time = _normalizeStr(list[i].settlement_time)
          }
          return list
        }
      },
      // 选择渠道
      selectChannel() {
        weui.picker(this.channelArr, {
          container: 'body',
          defaultValue: [0],
          onChange: (result) => {
            console.log('change' + result)
          },
          onConfirm: (result) => {
            this.currentChannel = this.channelArr[result]
          }
        })
      },
      // 方案选择
      selectPlan() {
        weui.picker(this.pickerArr, {
          container: 'body',
          defaultValue: [0],
          onChange: (result) => {
            console.log('change' + result)
          },
          onConfirm: (result) => {
            this.currentPlan = this.showArr[result]
            this.curValue = this.pickerArr[result].label
          }
        })
      },
      // 表单提交
      formSubmit() {
        var that = this
        const param = this.purchaseAmt
        if (this.checkPurchase(that, param)) {
          weui.confirm(`${this.tip4}${param}${this.tip6}`, {
            title: this.tip5,
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
                this.mySubmit(that, param)
              }
            }]
          })
        }
      },
      // 校验划款份额
      checkPurchase: (that, param) => {
        var amt = param
        if (!amt) {
          weui.alert(that.tip1, {
            title: that.tip,
            buttons: [{
              label: that.confirm,
              type: 'primary',
              onClick: () => { console.log('ok') }
            }]
          })
          return false
        } else if (amt > 1000000000) {
          weui.alert(that.tip2, {
            title: that.tip,
            buttons: [{
              label: that.confirm,
              type: 'primary',
              onClick: () => { console.log('ok') }
            }]
          })
          return false
        } else if (amt % 1 !== 0) {
          weui.alert(that.tip3, {
            title: that.tip,
            buttons: [{
              label: that.confirm,
              type: 'primary',
              onClick: () => { console.log('ok') }
            }]
          })
          return false
        } else {
          return true
        }
      },
      /**
       * 提交划款份额
      */
      mySubmit: (that, param) => {
        var product_id = that.currentPlan.id
        var transferAmt = parseInt(param)
        $.ajax({
          type: 'POST',
          url: API.api + '/api/v1/deduct/apply',
          data: {
            product_id: product_id,
            customer_id: that.customer_id,
            deduct_money: transferAmt,
            describe: that.describe,
            channel: that.currentChannel.type
          },
          dataType: 'json',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'secret_key': getMd5(),
            'time_stamp': getBJDate().getTime()
          },
          success: (res) => {
            if (!res.ret) {
              weui.toast(res.msg, 500)
              that.btnDisabled = false
              that.btnLoading = false
              return false
            }
            weui.toast(res.msg, 500)
            setTimeout(() => {
              that.btnDisabled = false
              that.btnLoading = false
              that.$router.push({
                path: '/' + that.$i18n.locale
              })
            }, 500)
          },
          error: (err) => {
            console.log(err)
            weui.toast(that.netWork, 500)
            that.btnDisabled = false
            that.btnLoading = false
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
.box{
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
.item_body{
  display: flex;
  line-height: 1.5;
}
.item__left,.item__right{
  flex: 1;
  color: #333333;
  font-size: 14px;
  display: flex;
  align-items: center;
  width: 50%;
}
.new_data,.all_data{
  font-size: 14px;
  color: #ff5251;
  flex: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.item_foot{
  color: #333333;
  line-height: 1.5;
  font-size: 14px;
  display: flex;
}
.form_box {
  position:relative;
  flex: 1;
  background:#fff;
  border-radius:4px;
  box-shadow:0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12)
}
.form_area {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom:15px;
  padding-top:5px;
}
.select_type, .input_area {
  flex: 1;
  display:flex;
  align-items:center;
  height:40px;
  box-sizing:border-box;
}
.select_type {
  color: #333333;
  position: relative;
  margin-bottom: 5px;
}
.select_type i {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 40px;
  z-index: 0;
}
.select_type input {
  width: 100%;
  flex: 1;
  height: 40px;
  font-size: 18px;
  border-radius: 0;
  border-bottom: 1px solid #ff5251;
  box-sizing: border-box;
}
.type_title, .input_title {
  flex: 0 1 auto;
  font-size: 14px;
}
.input_form{
  position:relative;
  box-sizing:border-box;
  line-height: 1.5;
  display: flex;
  align-items: center;
  width: 100%;
}
.input_form i{
  font-size:18px;
  position:absolute;
  left:0;
  top: 50%;
  transform: translateY(-50%);
  color: #ff5251;
}
.input_form .unit{
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  color: #ff5251;
}
.input_con {
  display:flex;
  box-sizing:border-box;
  height:40px;
  flex:1;
  align-items:center;
}
.input_con .unit {
  flex:0 1 auto;
  color:#ff5251;
}
.input_form input{
  height:50px;
  line-height:16px;
  padding:17px 25px;
  font-size: 16px;
  flex:1;
  border-radius: 0;
  border-bottom:1px solid #BDBDBD;
  box-sizing: border-box;
  background: #fff;
  outline: none;
}
.input_con input {
  position:relative;
  width: 100%;
  height:40px;
  flex:1;
  border-radius: 0;
  box-sizing: border-box;
  outline: none;
  border-bottom: 1px solid #ff5251;
}
.btn_area{
  margin-top: 15px;
}
.editbox{
  width: 100%;
  border: 1px solid #BDBDBD;
  padding: 5px;
  box-sizing: border-box;
}
.noData{
  position: absolute;
  top: 50px;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
