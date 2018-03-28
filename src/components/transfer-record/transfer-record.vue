<template>
  <transition name="slide">
    <div class="m-container">
      <navbar :title="$t('navigator.transferRecord')" :showClose="showClose" @back="back"></navbar>
      <div class="list">
        <scroll ref="scroll" class="scroll_list"
                v-if="transferRecord.length > 0"
                :scrollbar="scrollbarObj"
                :pullDownRefresh="pullDownRefreshObj"
                :startY="parseInt(startY)"
                @pullingDown="onPullingDown">
          <li class="item-box" v-for="(item, index) in transferRecord" :key="index">
            <div class="item">
              <div class="item_head">
                <i class="iconfont icon-item"></i>
                <span class="title">{{item.product_name}}</span>
                <span class="item_state" style="color:#09B3CD;" v-if="item.status === 'SHTG'">审核通过</span>
                <span class="item_state" style="color:#652D92;" v-if="item.status === 'DSH'">待审核</span>
                <span class="item_state" style="color:#EB1C22;" v-if="item.status === 'GHJJ'">审核拒绝</span>
              </div>
              <div class="item_body">
                <div class="item__left">
                  <span>{{$t('purchase.transferShare')}}：</span>
                  <span class="new_data">{{item.deduct_money}}</span>
                </div>
                <div class="item__right" style="text-align:right;">
                  <span style="flex:1;">{{$t('purchase.transferChannel')}}：</span>
                  <span class="all_data" style="flex:0 auto;">{{item.channel}}</span>
                </div>
              </div>
              <div class="item_body">
                <div class="item__left">
                  <span>{{$t('redeemRecord.applyTime')}}：</span>
                  <span class="new_data">{{item.create_time}}</span>
                </div>
              </div>
              <div class="item_body" v-if="item.describe">
                <div class="item__left">
                  <span>{{$t('purchase.transferNote')}}：</span>
                  <span class="new_data">{{item.describe}}</span>
                </div>
              </div>
              <div class="item_action" v-if="item.status === 'DSH'">
                <div style="flex: 1;">
                  <button class="redeemAllBtn" :disabled="btnDisabled" @click="cancelAction(item)">{{$t('purchase.cancelTransfer')}}</button>
                </div>
              </div>
            </div>
          </li>
        </scroll>
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
  import Scroll from 'base/scroll/scroll'
  import Navbar from 'base/navbar/navbar'
  import {getMd5, getBJDate} from 'common/js/tool'
  import * as API from 'common/js/http'
  import {getUserInfo} from 'common/js/storage'
  import 'weui'
  import weui from 'weui.js'

  export default {
    data() {
      return {
        showClose: false,
        loading: null,
        transferRecord: [],
        scrollbar: true,
        scrollbarFade: true,
        pullDownRefresh: true,
        pullDownRefreshThreshold: 90,
        pullDownRefreshStop: 60,
        startY: 0,
        hasData: false,
        btnDisabled: false
      }
    },
    computed: {
      scrollbarObj: function() {
        return this.scrollbar ? {fade: this.scrollbarFade} : false
      },
      pullDownRefreshObj: function() {
        return this.pullDownRefresh ? {
          threshold: parseInt(this.pullDownRefreshThreshold),
          stop: parseInt(this.pullDownRefreshStop)
        } : false
      },
      netWork() {
        return this.$i18n.t('common.network')
      },
      loadingTip() {
        return this.$i18n.t('common.loading')
      },
      tip1() {
        return this.$i18n.t('purchase.tip16')
      },
      confirm() {
        return this.$i18n.t('common.confirm')
      },
      cancel() {
        return this.$i18n.t('common.cancel')
      },
      cancelTip() {
        return this.$i18n.t('common.cancelTip')
      }
    },
    created() {
      this.$i18n.locale = this.$route.params.lang === 'zh' ? 'zh' : this.$route.params.lang === 'en' ? 'en' : 'tw'
      this.loading = weui.loading(this.loadingTip)
      this.customer_id = getUserInfo().id
      // this.isTransfer()
    },
    mounted() {
      setTimeout(() => {
        this._getTransferRecord()
      }, 20)
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
      _getTransferRecord() {
        $.ajax({
          type: 'POST',
          url: API.api + '/api/v1/deduct/myDeducts',
          data: {
            customer_id: this.customer_id
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
              this.hasData = true
              setTimeout(() => {
                this.loading.hide()
              }, 20)
              return false
            }
            setTimeout(() => {
              this.loading.hide()
            }, 20)
            this.transferRecord = res.rows
            this.hasData = false
            setTimeout(() => {
              this.$refs.scroll.forceUpdate()
            }, 20)
          },
          error: (err) => {
            console.log(err)
            weui.toast(this.netWork, 500)
          }
        })
      },
      onPullingDown() {
        // 更新数据
        this._getTransferRecord()
      },
      // 取消划款申请
      cancelAction(e) {
        const transfer_id = e.id
        weui.confirm(this.tip1, {
          title: this.cancelTip,
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
              $.ajax({
                type: 'POST',
                url: API.api + '/api/v1/deduct/qxApply',
                data: {
                  id: transfer_id
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
                    return false
                  }
                  weui.toast(res.msg, 500)
                  setTimeout(() => {
                    this.$router.push({
                      path: '/' + this.$i18n.locale
                    })
                  }, 500)
                },
                error: (err) => {
                  console.log(err)
                  weui.toast(this.netWork, 500)
                }
              })
            }
          }]
        })
      }
    },
    components: {
      Scroll,
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
