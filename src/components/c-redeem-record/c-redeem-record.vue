<template>
  <transition name="slide">
    <div class="m-container">
      <navbar title="赎回记录" :showClose="showClose" @back="back"></navbar>
      <div class="list">
        <scroll ref="scroll" class="scroll_list"
                v-if="redeemRecord.length > 0"
                :scrollbar="scrollbarObj"
                :pullDownRefresh="pullDownRefreshObj"
                :startY="parseInt(startY)"
                @pullingDown="onPullingDown">
          <li class="item-box" v-for="(item, index) in redeemRecord" :key="index">
            <div class="item">
              <div class="item_head">
                <i class="iconfont icon-item"></i>
                <span class="title">{{item.name}}</span>
              </div>
              <div class="item_body">
                <div class="item__left">
                  <span>赎回数量：</span>
                  <span class="new_data">{{item.sub_number}}个</span>
                </div>
                <div class="item__right" style="text-align:right;">
                  <span style="flex:1;">产品状态：</span>
                  <span class="all_data" style="color: #652D92;flex:0 auto;" v-if="item.status === '待审核'">{{item.status}}</span>
                  <span class="all_data" style="color: #09B3CD;flex:0 auto;" v-if="item.status === '审核通过'">{{item.status}}</span>
                  <span class="all_data" style="color: #EB1C22;flex:0 auto;" v-if="item.status === '审核拒绝'">{{item.status}}</span>
                  <span class="all_data" style="color: #262163;flex:0 auto;" v-if="item.status === '赎回待审核'">{{item.status}}</span>
                  <span class="all_data" style="color: #2E3094;flex:0 auto;" v-if="item.status === '已赎回'">{{item.status}}</span>
                </div>
              </div>
              <div class="item_foot">
                <span>申请时间：</span>
                <span>{{item.create_time}}</span>
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
  import Scroll from 'base/c-scroll/c-scroll'
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
        redeemRecord: [],
        pageData: {
          customer_id: ''
        },
        scrollbar: true,
        scrollbarFade: true,
        pullDownRefresh: true,
        pullDownRefreshThreshold: 90,
        pullDownRefreshStop: 60,
        startY: 0,
        hasData: false
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
      }
    },
    created() {
      this.loading = weui.loading('加载中')
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
        $.ajax({
          type: 'POST',
          url: API.api + '/api/v1/test/product/myRedeem',
          data: this.pageData,
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
            const list = res.obj
            this.redeemRecord = list
            this.hasData = false
            setTimeout(() => {
              this.$refs.scroll.forceUpdate()
            }, 20)
          },
          error: (err) => {
            console.log(err)
            weui.toast('网络异常', 500)
          }
        })
      },
      onPullingDown() {
        // 更新数据
        this._getRedeemRecord()
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
