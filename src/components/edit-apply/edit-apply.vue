<template>
  <transition name="slide">
    <div class="box">
      <navbar :title="$t('navigator.modifyPurchase')" @back="back" :showClose="showClose"></navbar>
      <div class="content">
        <div class="item_head">
          <i class="iconfont icon-item"></i>
          <span class="title">{{currentProduct.name}}</span>
        </div>
        <div class="item_body">
          <div class="item__left" style="width:44%;">
            <span>{{$t('purchase.bidShare')}}：</span>
            <span class="new_data">{{currentProduct.subscribe_money}}万份</span>
          </div>
          <div class="item__right" style="width:56%;text-align:right;">
            <span style="flex:1;">{{$t('purchase.purchaseTime')}}：</span>
            <span class="all_data" style="flex:0 auto;">{{currentProduct.subscribe_time}}</span>
          </div>
        </div>
        <div class="item_body">
          <div class="item__left">
            <span>{{$t('addApply.minShare')}}：</span>
            <span class="new_data">{{currentProduct.min_money / 10000}}万份</span>
          </div>
          <div class="item__right" style="text-align:right;">
            <span style="flex:1;">{{$t('addApply.purchaseStatus')}}：</span>
            <span class="all_data" style="flex:0 auto;">{{currentProduct.subscribe_status}}</span>
          </div>
        </div>
        <div class="item_foot" style='display:flex'>
          <span>{{$t('purchase.settlementTime')}}：</span>
          <div style="flex:1;display:flex;flex-wrap:wrap;">
            <div style="display:flex;width:50%;" v-for="(t, i) in currentProduct.settlement_time" :key="i">
              <span style='flex:1'>{{t}}</span>
            </div>
          </div>
        </div>
      </div>
      <form class="form_area" method="post" @submit.prevent="formSubmit()">
        <div class="input_area">
          <div class="input_form">
            <i class="iconfont icon-redeemed"></i>
            <span class='unit'>万份</span>
            <input type="number" v-model="subscribeAmt" maxlength="20" :placeholder="$t('purchase.tip1')" />
          </div>
        </div>
        <div class="btn_area">
          <cube-button type="submit" :disabled="btnDisabled">{{subscribeBtnTxt}}</cube-button>
        </div>
      </form>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import $ from 'jquery'
  import Navbar from 'base/navbar/navbar'
  import {getUserInfo, getProduct} from 'common/js/storage'
  import {getMd5, getBJDate} from 'common/js/tool'
  import * as API from 'common/js/http'
  import {showToast, showAlert, showDialog} from 'common/js/cubeTool'

  export default {
    data() {
      return {
        showClose: false,
        currentProduct: null,
        subscribeAmt: '',
        btnDisabled: false
      }
    },
    computed: {
      subscribeBtnTxt() {
        return this.$i18n.t('modifyAdd.subscribeBtnTxt')
      },
      tip() {
        return this.$i18n.t('common.tip')
      },
      tip1() {
        return this.$i18n.t('purchase.tip1')
      },
      tip2() {
        return this.$i18n.t('purchase.tip2')
      },
      tip3() {
        return this.$i18n.t('purchase.tip3')
      },
      tip4() {
        return this.$i18n.t('purchase.tip7')
      },
      tip5() {
        return this.$i18n.t('purchase.tip8')
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
    },
    mounted() {
    },
    methods: {
      back() {
        this.$router.back()
      },
      // 提交修改申购
      formSubmit: function() {
        var that = this
        const param = this.subscribeAmt
        if (this.checkSubscribe(that, param)) {
          showDialog(this.modifyTip, `${this.tip5}${param}万份?`, this.confirm, this.cancel, this.confirmFn, this.cancelFn)
        }
      },
      confirmFn() {
        const param = this.subscribeAmt
        this.btnDisabled = true
        this.mySubmit(param)
      },
      cancelFn() {
        console.log('cancel')
      },
      // 校验申购份额
      checkSubscribe: function(that, param) {
        var amt = param
        var min = that.currentProduct.min_money / 10000
        if (!amt) {
          showAlert(that.tip, that.tip1, that.confirm)
          return false
        } else if (amt < min) {
          showAlert(that.tip, `${that.tip2}${min}万份`, that.confirm)
          return false
        } else if (amt > 100000) {
          showAlert(that.tip, that.tip3, that.confirm)
          return false
        } else if (amt % 1 !== 0) {
          showAlert(that.tip, that.tip4, that.confirm)
          return false
        } else {
          return true
        }
      },
      mySubmit: function(param) {
        var subscribeAmt = parseInt(param)
        var customer_id = getUserInfo().id
        var subscribe_id = getProduct().subscribe_id
        $.ajax({
          type: 'POST',
          url: API.api + '/api/v1/subscribe/editApply',
          data: {
            customer_id: customer_id,
            subscribe_id: subscribe_id,
            subscribe_money: subscribeAmt * 10000
          },
          dataType: 'json',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'secret_key': getMd5(),
            'time_stamp': getBJDate().getTime()
          },
          success: (res) => {
            if (!res.ret) {
              showToast(res.msg, 'warn')
              this.btnDisabled = false
              return false
            }
            showToast(res.msg, 'correct')
            setTimeout(() => {
              this.btnDisabled = false
              this.$router.push({
                path: '/' + this.$i18n.locale
              })
            }, 500)
          },
          error: (err) => {
            console.log(err)
            showToast(this.netWork, 'error')
            this.btnDisabled = false
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
.form_area{
  display:flex;
  flex-direction:column;
  width:100%;
  padding: 15px 0;
}
.input_area{
  flex:1;
  padding:0 15px;
}
.input_form{
  position:relative;
  box-sizing:border-box;
  line-height: 1.5;
  display: flex;
  align-items: center;
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
.redeem_tip i{
  font-size: 12px;
  color: #ff5251;
  padding: 0 5px;
}
.redeem_tip text{
  font-size: 12px;
  color: #ff5251;
}
.btn_area{
  margin-top: 30px;
  padding:0 15px;
}
.btn_area .devide{
  position: relative;
  height: 35px;
  line-height: 35px;
  text-align: center;
  font-size: 18px;
  color: #333;
}
.btn_area .devide::after{
  position: absolute;
  width: 100%;
  height: 1px;
  top: 50%;
  transition: translateY(-50%);
  border: 1px solid #BDBDBD;
}
.redeem_rule{
  display:flex;
  flex-direction:column;
  width:100%;
  padding:15px;
  box-sizing:border-box;
}
.redeem_rule text{
  line-height: 1.5;
  color: #666666;
  font-size: 12px;
}
.rule_title{
  margin-bottom:15px;
}
.rule_title i{
  font-size:20px;
  color:#ff5251;
}
.rule_title .tit{
  font-size:18px;
  color:#222;
}
</style>
