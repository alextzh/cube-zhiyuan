<template>
  <transition name="slide">
    <div class="m-container">
      <navbar :title="$t('navigator.redeemRecord')" :showClose="showClose" @back="back"></navbar>
      <div class="list">
        <cube-scroll  ref="scroll"
                      v-if="redeemRecord.length > 0"
                      :options="options"
                      @pulling-down="onPullingDown">
          <li class="item-box" v-for="(item, index) in redeemRecord" :key="index">
            <div class="item">
              <div class="item_head">
                <i class="iconfont icon-item"></i>
                <span class="title">{{item.product_name}}</span>
                <span class="item_state" style="color:#09B3CD;" v-if="item.redeem_status === '审核通过'">{{item.redeem_status}}</span>
                <span class="item_state" style="color:#2E3094;" v-if="item.redeem_status === '已处理'">{{item.redeem_status}}</span>
                <span class="item_state" style="color:#652D92;" v-if="item.redeem_status === '待审核'">{{item.redeem_status}}</span>
                <span class="item_state" style="color:#EB1C22;" v-if="item.redeem_status === '审核拒绝'">{{item.redeem_status}}</span>
              </div>
              <div class="item_body">
                <div class="item__left">
                  <span>{{$t('purchaseRecord.redeemShare')}}：</span>
                  <span class="new_data">{{item.money}}万份</span>
                </div>
                <div class="item__right" style="text-align:right;">
                  <span style="flex:1;">{{$t('redeemRecord.applyTime')}}：</span>
                  <span class="all_data" style="flex:0 auto;">{{item.redeem_time}}</span>
                </div>
              </div>
              <div class="item_action" v-if="item.isQxshBtn">
                <div style="flex: 1;">
                  <cube-button @click="cancelAction(item)">{{$t('redeemRecord.cancelRedeem')}}</cube-button>
                </div>
              </div>
            </div>
          </li>
        </cube-scroll>
        <div v-if="hasData">
          <div class="no_data">
            <i class="iconfont icon-nodata"></i>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import $ from 'jquery'
  import Navbar from 'base/navbar/navbar'
  import {rendererZhMoneyWan, _normalizeDate, getMd5, getBJDate} from 'common/js/tool'
  import * as API from 'common/js/http'
  import {getUserInfo} from 'common/js/storage'
  import {showToast, showDialog} from 'common/js/cubeTool'

  export default {
    data() {
      return {
        showClose: false,
        loading: null,
        redeemRecord: [],
        pageData: {
          customer_id: ''
        },
        options: {
          pullDownRefresh: {
            threshold: 90,
            stop: 40,
            txt: '刷新成功'
          },
          scrollbar: {
            fade: true
          }
        },
        hasData: false
      }
    },
    computed: {
      netWork() {
        return this.$i18n.t('common.network')
      },
      cancelTip() {
        return this.$i18n.t('common.cancelTip')
      },
      tip1() {
        return this.$i18n.t('redeemRecord.tip1')
      },
      loadingTip() {
        return this.$i18n.t('common.loading')
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
      this.loading = this.$createToast({
        time: 0,
        txt: this.loadingTip,
        mask: true
      })
      this.loading.show()
      this.pageData.customer_id = getUserInfo().id
    },
    mounted() {
      setTimeout(() => {
        this._getRedeemRecord()
      }, 20)
    },
    methods: {
      back() {
        this.$router.back()
      },
      _getRedeemRecord() {
        const time_stamp = getBJDate()
        const secret_key = getMd5()
        $.ajax({
          type: 'POST',
          url: API.api + '/api/v1/redeem/myRedeems',
          data: this.pageData,
          dataType: 'json',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'secret_key': secret_key,
            'time_stamp': time_stamp
          },
          success: (res) => {
            this.loading.hide()
            if (!res.ret) {
              showToast(res.msg, 'warn')
              this.hasData = true
              return false
            }
            const list = res.obj.list
            this.redeemRecord = this._normalizeList(list)
            this.hasData = false
            setTimeout(() => {
              this.$refs.scroll.forceUpdate()
            }, 20)
          },
          error: (err) => {
            console.log(err)
            this.loading.hide()
            showToast(this.netWork, 'error')
          }
        })
      },
      onPullingDown() {
        // 更新数据
        this._getRedeemRecord()
      },
      _normalizeList(list) {
        if (list === []) {
          return []
        } else {
          for (let i = 0; i < list.length; i++) {
            list[i].money = rendererZhMoneyWan(list[i].money)
            list[i].redeem_time = _normalizeDate(list[i].redeem_time)
          }
          return list
        }
      },
      cancelAction(e) {
        this.redeem_id = e.id
        showDialog(this.cancelTip, this.tip1, this.confirm, this.cancel, this.confirmFn, this.cancelFn)
      },
      confirmFn() {
        const time_stamp = getBJDate()
        const secret_key = getMd5()
        $.ajax({
          type: 'POST',
          url: API.api + '/api/v1/redeem/qxApply',
          data: {
            redeem_id: this.redeem_id
          },
          dataType: 'json',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'secret_key': secret_key,
            'time_stamp': time_stamp
          },
          success: (res) => {
            if (!res.ret) {
              showToast(res.msg, 'warn')
              return false
            }
            showToast(res.msg, 'correct')
            setTimeout(() => {
              this.$router.push({
                path: '/' + this.$i18n.locale
              })
            }, 500)
          },
          error: (err) => {
            console.log(err)
            showToast(this.netWork, 'error')
          }
        })
      },
      cancelFn() {
        console.log('cancel')
      }
    },
    components: {
      Navbar
    }
  }
</script>

<style scoped lang="scss">
  .m-container {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 100;
    width: 100%;
    background: #f6f6f6;
  }
  .list{
    position: fixed;
    top: 50px;
    bottom: 0;
    width: 100%;
    overflow: hidden;
  }
  .item-box {
    padding-bottom: 10px;
  }
  .item{
    position:relative;
    padding: 10px;
    box-sizing:border-box;
    background:#fff;
    transition:all .3s;
    border-radius:4px;
    box-shadow:0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12)
  }
  .item:active{
    box-shadow: 0 1px 3px 0 rgba(244,67,54,.2), 0 1px 1px 0 rgba(244,67,54,.14), 0 2px 1px -1px rgba(244,67,54,.12);
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
  .item_state{
    float: right;
    padding:0;
    background:#fff;
    color:#ff5251;
  }
  .item_body{
    display: flex;
    line-height: 1.5;
  }
  .item__left,.item__right{
    flex: 1;
    color: #333;
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
    color: #333;
    line-height: 1.5;
    font-size: 14px;
    display: flex;
  }
  .item_action{
    position: relative;
    margin-top:10px;
    padding-top:10px;
    border-top:1px dashed #BDBDBD;
    display: flex;
  }
  span {
    font-size: 14px;
  }
</style>
