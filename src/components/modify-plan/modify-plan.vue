<template>
  <transition name="slide">
    <div class="box">
      <navbar :title="$t('navigator.modifyPlan')" @back="back" :showClose="showClose"></navbar>
      <div class="content">
        <div class="item_head">
          <i class="iconfont icon-item"></i>
          <span class="title">{{currentProduct.base_name}}</span>
        </div>
        <div class="item_body">
          <div class="item__left" style="width:58%;">
            <span>{{$t('purchase.schemeName')}}：</span>
            <span class="new_data">{{currentProduct.product_name}}</span>
          </div>
          <div class="item__right" style="width:42%;text-align:right;">
            <span style="flex:1;">{{$t('purchase.bidShare')}}：</span>
            <span class="all_data" style="flex:0 auto;">{{currentProduct.subscribe_money}}万份</span>
          </div>
        </div>
        <div class="item_foot">
          <span>{{$t('purchase.purchaseTime')}}：</span>
          <span>{{currentProduct.subscribe_time}}</span>
        </div>
        <div class="item_foot" style="display: flex;" v-if="currentProduct.describe">
          <span>{{$t('purchase.productIntroduction')}}：</span>
          <div style="flex: 1;">
            <span style="line-height: 1;">{{currentProduct.describe}}</span>
          </div>
        </div>
      </div>
      <div style="padding: 10px;width: 100%;box-sizing: border-box;">
        <div class="form_box">
          <form class="form_area" method="post" @submit.prevent="formSubmit()">
            <div style="padding: 0 10px;">
              <div class="select_type" v-if="pickerArr.length > 1">
                <i class="iconfont icon-unfold"></i>
                <span class="type_title">{{$t('modifyPlan.selectPlan')}}：</span>
                <input type="text" palceholder="请选择方案类型" @click="selectPlan" readonly :value="curValue" />
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
              <div class="item_body">
                <div class="item__left">
                  <span>{{$t('addApply.minShare')}}：</span>
                  <span class="new_data">{{currentPlan.min_money / 10000}}万份</span>
                </div>
                <div class="item__right" style="text-align:right;">
                  <span style="flex:1;">{{$t('purchase.increasingShare')}}：</span>
                  <span class="all_data" style="flex:0 auto;">{{currentPlan.step_money / 10000}}万份</span>
                </div>
              </div>
              <div class="item_foot" style='display:flex'>
                <span>{{$t('purchase.settlementTime')}}：</span>
                <div style="flex:1;display:flex;flex-wrap:wrap;">
                  <div style="display:flex;width:50%;" v-for="(t, i) in currentPlan.settlement_time" :key="i">
                    <span style="flex:1">{{t}}</span>
                  </div>
                </div>
              </div>
              <div class="item_foot" style="display: flex;">
                <span>{{$t('purchase.schemeDetail')}}：</span>
                <div style="flex: 1;">
                  <span>{{currentPlan.describe}}</span>
                </div>
              </div>
            </div>
            <div v-if="flag" style="padding: 0 10px;">
              <div class="input_area">
                <div class="input_title">{{$t('modifyPlan.changeShare')}}：</div>
                <div class="input_con">
                  <input type="number" v-model="purchaseAmt" :placeholder="$t('modifyPlan.tip1')" />
                  <span class='unit'>万份</span>
                </div>
              </div>
              <div class="btn_area">
                <button type="submit" :disabled="btnDisabled" :class="{'weui-btn_disabled': btnDisabled}" class="weui-btn weui-btn_primary"><i :class="{'weui-loading': btnLoading}"></i>{{modifyBtnTxt}}</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Navbar from 'base/navbar/navbar'
  import {getUserInfo, getProduct} from 'common/js/storage'
  import {_normalizeStr, getMd5, getBJDate} from 'common/js/tool'
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
        currentProduct: null,
        customer_id: '',
        purchaseAmt: '',
        btnLoading: false,
        btnDisabled: false,
        flag: false
      }
    },
    computed: {
      modifyBtnTxt() {
        return this.$i18n.t('modifyPlan.modifyBtnTxt')
      },
      tip() {
        return this.$i18n.t('common.tip')
      },
      tip1() {
        return this.$i18n.t('modifyPlan.tip1')
      },
      tip2() {
        return this.$i18n.t('modifyPlan.tip2')
      },
      tip3() {
        return this.$i18n.t('modifyPlan.tip3')
      },
      tip4() {
        return this.$i18n.t('modifyPlan.tip4')
      },
      tip5() {
        return this.$i18n.t('modifyPlan.tip5')
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
      this.currentProduct = getProduct()
      this.customer_id = getUserInfo().id
    },
    mounted() {
      var that = this
      this.$nextTick(() => {
        this.getSubProductList(that, this.currentProduct.base_id)
      })
    },
    methods: {
      back() {
        this.$router.back()
      },
      /**
       * 获取申购项目子列表
      */
      getSubProductList(that, bid) {
        $.ajax({
          type: 'POST',
          url: API.api + '/api/v1/product/listByBaseId',
          data: {
            base_product_id: bid
          },
          async: false,
          dataType: 'json',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'secret_key': getMd5(),
            'time_stamp': getBJDate().getTime()
          },
          success: (res) => {
            var list = res.obj.list.reverse()
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
              if (showArr[0].name === that.currentProduct.product_name) {
                this.flag = false
              } else {
                this.flag = true
              }
              this.pickerArr = pickerArr
              this.showArr = showArr
              this.currentPlan = showArr[0]
              this.curValue = pickerArr[0].label
            }
          },
          error: (err) => {
            console.log(err)
            weui.toast(this.netWork, 500)
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
            if (this.showArr[result].name === this.currentProduct.product_name) {
              this.flag = false
            } else {
              this.flag = true
            }
          }
        })
      },
      // 表单提交
      formSubmit() {
        var that = this
        const param = this.purchaseAmt
        const curPlan = this.currentPlan
        if (this.checkPurchase(that, param)) {
          weui.confirm(`${this.tip5}${curPlan.name}${param}万份?`, {
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
                this.mySubmit(that, param)
              }
            }]
          })
        }
      },
      // 校验申购金额
      checkPurchase: (that, param) => {
        var amt = param
        var curPlan = that.currentPlan
        var min = curPlan.min_money / 10000
        var max = that.currentProduct.subscribe_money
        var step = curPlan.step_money / 10000

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
        } else if (amt < min) {
          weui.alert(`${that.tip2}${min}万份`, {
            title: that.tip,
            buttons: [{
              label: that.confirm,
              type: 'primary',
              onClick: () => { console.log('ok') }
            }]
          })
          return false
        } else if (amt > max) {
          weui.alert(that.tip3, {
            title: that.tip,
            buttons: [{
              label: that.confirm,
              type: 'primary',
              onClick: () => { console.log('ok') }
            }]
          })
          return false
        } else if (amt % step !== 0) {
          weui.alert(`${that.tip4}${step}万份`, {
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
       * 提交方案更改
      */
      mySubmit: (that, param) => {
        var purchaseAmt = parseInt(param)
        var target_product_id = that.currentPlan.id
        var subscribe_id = that.currentProduct.id
        $.ajax({
          type: 'POST',
          url: API.api + '/api/v1/subscribe/editFA',
          data: {
            subscribe_id: subscribe_id,
            target_product_id: target_product_id,
            eidt_money: purchaseAmt * 10000
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
.content {
  width:100%;
  display:flex;
  flex-direction:column;
  padding:65px 15px 5px;
  box-sizing:border-box;
}
.item_head{
  position: relative;
  line-height:30px;
  padding-bottom:10px;
}
.item_head i{
  color: #ff5251;
  font-size: 18px;
}
.item_head .title{
  padding-left: 10px;
  font-size: 18px;
  color: #212121;
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
</style>
