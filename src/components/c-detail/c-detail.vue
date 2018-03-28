<template>
  <transition name="slide">
    <div class="box">
      <navbar title="产品详情" @back="back" :showClose="showClose"></navbar>
      <div class="content">
        <div class="item_head">
          <i class="iconfont icon-item"></i>
          <span class="title">{{currentProduct.name}}</span>
        </div>
        <div class="item_body">
          <div class="item__left">
            <span>产品类型：</span>
            <span class="new_data">{{currentProduct.type}}</span>
          </div>
          <div class="item__right" style="text-align:right;">
            <span style="flex:1;">产品状态：</span>
            <span class="all_data" style="flex:0 auto;">{{currentProduct.status}}</span>
          </div>
        </div>
        <div class="item_foot">
          <span>申购时间：</span>
          <span>{{currentProduct.sg_start_time}}</span>
        </div>
        <div class="item_foot" style="display: flex;" v-if="currentProduct.describe">
          <span>产品简介：</span>
          <div style="flex: 1;">
            <span style="line-height: 1;">{{currentProduct.describe}}</span>
          </div>
        </div>
      </div>
      <div style="padding: 10px;width: 100%;box-sizing: border-box;">
        <div class="form_box">
          <form class="form_area" method="post" @submit.prevent="formSubmit()">
            <div style="padding: 0 10px;">
              <div class="input_area">
                <div class="input_title">申购数量：</div>
                <div class="input_con">
                  <input type="number" v-model="purchaseAmt" placeholder="请输入申购数量" />
                  <span class='unit'>个</span>
                </div>
              </div>
              <div class="btn_area">
                <button type="submit" :disabled="btnDisabled" :class="{'weui-btn_disabled': btnDisabled}" class="weui-btn weui-btn_primary"><i :class="{'weui-loading': btnLoading}"></i>{{purchaseBtnTxt}}</button>
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
  import {getMd5, getBJDate} from 'common/js/tool'
  import $ from 'jquery'
  import * as API from 'common/js/http'
  import 'weui'
  import weui from 'weui.js'

  export default {
    data() {
      return {
        showClose: false,
        currentProduct: null,
        customer_id: '',
        purchaseAmt: '',
        purchaseBtnTxt: '申购',
        btnLoading: false,
        btnDisabled: false
      }
    },
    created() {
      this.currentProduct = getProduct()
      this.customer_id = getUserInfo().id
    },
    methods: {
      back() {
        this.$router.back()
      },
      // 表单提交
      formSubmit() {
        var that = this
        const param = this.purchaseAmt
        if (this.checkPurchase(that, param)) {
          weui.confirm(`您确认要申购当前产品${param}个吗?`, {
            title: '提示',
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
                this.purchaseBtnTxt = '申购中'
                this.btnDisabled = true
                this.btnLoading = true
                this.mySubmit(that, param)
              }
            }]
          })
        }
      },
      // 校验申购个数
      checkPurchase: (that, param) => {
        var amt = param
        if (!amt) {
          weui.alert('请输入申购数量', {
            title: '提示',
            buttons: [{
              label: '确定',
              type: 'primary',
              onClick: () => { console.log('ok') }
            }]
          })
          return false
        } else if (amt < 1) {
          weui.alert(`最小申购数量为1个`, {
            title: '提示',
            buttons: [{
              label: '确定',
              type: 'primary',
              onClick: () => { console.log('ok') }
            }]
          })
          return false
        } else if (amt % 1 !== 0) {
          weui.alert(`申购递增数量为1个`, {
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
      /**
       * 提交申购数量
       */
      mySubmit: (that, param) => {
        var product_id = that.currentProduct.id
        var purchaseAmt = parseInt(param)
        $.ajax({
          type: 'POST',
          url: API.api + '/api/v1/test/product/addSub',
          data: {
            product_id: product_id,
            customer_id: that.customer_id,
            sub_number: purchaseAmt
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
              that.purchaseBtnTxt = '申购'
              that.btnDisabled = false
              that.btnLoading = false
              return false
            }
            weui.toast(res.msg, 500)
            setTimeout(() => {
              that.purchaseBtnTxt = '申购'
              that.btnDisabled = false
              that.btnLoading = false
              that.$router.push({
                path: '/c-mine'
              })
            }, 500)
          },
          error: (err) => {
            console.log(err)
            weui.toast('网络异常', 500)
            that.purchaseBtnTxt = '申购'
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
    padding:0 10px;
  }
</style>
