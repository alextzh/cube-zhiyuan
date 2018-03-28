<template>
  <transition name="slide">
    <div class="m-container">
      <navbar :title="$t('navigator.product')" :showClose="showClose" @back="back"></navbar>
      <div class="list">
        <scroll ref="scroll" class="scroll_list"
                v-if="productList.length > 0"
                :scrollbar="scrollbarObj"
                :pullDownRefresh="pullDownRefreshObj"
                :pullUpLoad="pullUpLoadObj"
                :startY="parseInt(startY)"
                @pullingDown="onPullingDown"
                @pullingUp="onPullingUp">
          <li class="item-box" v-for="(item, index) in productList" :key="index" @click="toDetail(item)">
            <div class="item">
              <div class="item_head">
                <i class="iconfont icon-item"></i>
                <span class="title">{{item.name}}</span>
              </div>
              <div class="item_body">
                <div class="item__left">
                  <span>{{$t('purchase.productType')}}：</span>
                  <span class="new_data">{{item.type}}</span>
                </div>
                <div class="item__right" style="text-align:right;">
                  <span style="flex:1;">{{$t('purchase.productStatus')}}：</span>
                  <span class="all_data" style="color: #D9D6CF;flex:0 auto;" v-if="item.status === '已发布'">{{item.status}}</span>
                  <span class="all_data" style="color: #FE4C40;flex:0 auto;" v-if="item.status === '申购中'">{{item.status}}</span>
                  <span class="all_data" style="color: #ADA0A5;flex:0 auto;" v-if="item.status === '申购结束'">{{item.status}}</span>
                  <span class="all_data" style="color: #FD5B78;flex:0 auto;" v-if="item.status === '操盘中'">{{item.status}}</span>
                  <span class="all_data" style="color: #483C32;flex:0 auto;" v-if="item.status === '已结束'">{{item.status}}</span>
                </div>
              </div>
              <div class="item_foot" v-if="item.status !== '操盘中'">
                <span>{{$t('purchase.purchaseTime')}}：</span>
                <span>{{item.sg_start_time}} <span style="color:#ff5251;">~</span> {{item.sg_end_time}}</span>
              </div>
              <div class="item_foot">
                <span>{{$t('purchase.diskTime')}}：</span>
                <span>{{item.caopan_time}}</span>
              </div>
              <div class="item_foot" style="display: flex;">
                <span>{{$t('purchase.settlementTime')}}：</span>
                <div style="flex:1;display:flex;flex-wrap:wrap;">
                  <div style="display:flex;width:50%;" v-for="(t, i) in item.settlement_time" :key="i">
                    <span style='flex:1'>{{t}}</span>
                  </div>
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
  import {rendererZhMoneyWan, _normalizeDate, getMd5, getBJDate} from 'common/js/tool'
  import * as API from 'common/js/http'
  import {setProduct, getUserInfo} from 'common/js/storage'
  import 'weui'
  import weui from 'weui.js'

  export default{
    name: 'productList',
    data() {
      return {
        showClose: false,
        loading: null,
        productList: [],
        pageData: {
          page: 1,
          rows: 10,
          status: 'sgz',
          customer_id: ''
        },
        scrollbar: true,
        scrollbarFade: true,
        pullDownRefresh: true,
        pullDownRefreshThreshold: 90,
        pullDownRefreshStop: 40,
        pullUpLoad: true,
        pullUpLoadThreshold: 0,
        startY: 0,
        hasData: false,
        totalPage: 0
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
      pullUpLoadObj: function() {
        return this.pullUpLoad ? {
          threshold: parseInt(this.pullUpLoadThreshold)
        } : false
      },
      loadingTip() {
        return this.$i18n.t('common.loading')
      },
      netWork() {
        return this.$i18n.t('common.network')
      }
    },
    watch: {
      scrollbarObj: {
        handler() {
          this.rebuildScroll()
        },
        deep: true
      },
      pullDownRefreshObj: {
        handler() {
          this.rebuildScroll()
        },
        deep: true
      },
      pullUpLoadObj: {
        handler() {
          this.rebuildScroll()
        },
        deep: true
      }
    },
    created() {
      this.$i18n.locale = this.$route.params.lang === 'zh' ? 'zh' : this.$route.params.lang === 'en' ? 'en' : 'tw'
      this.loading = weui.loading(this.loadingTip)
      this.pageData.customer_id = getUserInfo().id
    },
    mounted() {
      setTimeout(() => {
        this._getProductList()
      }, 20)
    },
    methods: {
      back() {
        this.$router.back()
      },
      _getProductList() {
        this.pageData.page = 1
        $.ajax({
          type: 'POST',
          url: API.api + '/api/v1/product/baseList',
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
            const list = res.obj.list
            this.totalPage = res.obj.totalPage
            this.productList = this._normalizeList(list)
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
      _getMoreProductList() {
        this.pageData.page = this.pageData.page + 1
        if (this.pageData.page > this.totalPage) {
          // 如果没有新数据
          setTimeout(() => {
            this.$refs.scroll.forceUpdate()
          }, 20)
        } else {
          $.ajax({
            type: 'POST',
            url: API.api + '/api/v1/product/baseList',
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
                return false
              }
              const list = res.obj.list
              this.productList = this.productList.concat(this._normalizeList(list))
              setTimeout(() => {
                this.$refs.scroll.forceUpdate()
              }, 20)
            },
            error: (err) => {
              console.log(err)
              weui.toast(this.netWork, 500)
            }
          })
        }
      },
      onPullingDown() {
        // 更新数据
        this._getProductList()
      },
      onPullingUp() {
        // 加载更多数据
        this._getMoreProductList()
      },
      rebuildScroll() {
        this.$nextTick(() => {
          this.$refs.scroll.destroy()
          this.$refs.scroll.initScroll()
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
            list[i].settlement_time = this._normalizeStr(list[i].settlement_time)
          }
          return list
        }
      },
      _normalizeStr(str) {
        str = str || ''
        const arr = str.split(',')
        const newArr = arr.map(item => {
          return item
        })
        return newArr
      },
      toDetail(e) {
        setProduct(e)
        this.$router.push({
          path: '/product-detail/' + this.$i18n.locale
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
    padding-bottom: 10px;
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
    padding:0 10px;
    background:#fff;
    color:#ff5251;
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
  span {
    font-size: 14px;
  }
</style>
