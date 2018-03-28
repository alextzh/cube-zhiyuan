<template>
  <transition name="slide">
    <div class="m-container">
      <navbar :title="$t('navigator.contract')" :showClose="showClose" @back="back"></navbar>
      <div class="list">
        <scroll ref="scroll" class="scroll_list"
                v-if="contractList.length > 0"
                :scrollbar="scrollbarObj"
                :pullDownRefresh="pullDownRefreshObj"
                :startY="parseInt(startY)"
                @pullingDown="onPullingDown">
          <li class="item-box" v-for="(item, index) in contractList" :key="index">
            <div class="item">
              <div class="item_head">
                <i class="iconfont icon-agreement"></i>
                <span class="title">{{item.contract_type}}</span>
                <span class="item_state" style='color: #652D92;' v-if="item.status === 'DQ'">{{item.contract_status}}</span>
                <span class="item_state" style='color: #09B3CD;' v-if="item.status === 'QYWC'">{{item.contract_status}}</span>
                <span class="item_state" style='color: #92278F;' v-if="item.status === 'GD'">{{item.contract_status}}</span>
                <span class="item_state" style='color: #41123C;' v-if="item.status === 'WQ'">{{item.contract_status}}</span>
                <span class="item_state" style='color: #2E3094;' v-if="item.status === 'KHYQ'">{{item.contract_status}}</span>
              </div>
              <div class="item_body">
                <div class="item__left">
                  <span>{{$t('management.contractName')}}：</span>
                  <span class="new_data">{{item.doc_title}}</span>
                </div>
              </div>
              <div class="item_action" v-if="item.sign_url && item.status === 'DQ'">
                <div style="flex: 1;">
                  <a class="btn" href="javascript:;" @click="toSign(item.sign_url)">{{$t('management.signContract')}}</a>
                </div>
              </div>
              <div class="item_action" v-else>
                <div style="flex: 1;margin-right:10px;" v-if="device === 'Android' || device === 'WindowsPhone'">
                  <a class="btn" :href="item.download_url">{{$t('management.download')}}</a>
                </div>
                <div style="flex: 1;margin-right:10px;" v-if="device === 'iPhone'">
                  <a class="btn" href="javascript:;" @click="toDownload">{{$t('management.download')}}</a>
                </div>
                <div style="flex: 1;">
                  <a class="btn" href="javascript:;" @click="toView(item.viewpdf_url)">{{$t('management.view')}}</a>
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
  import * as API from 'common/js/http'
  import {getUserInfo} from 'common/js/storage'
  import {getMd5, getBJDate} from 'common/js/tool'
  import 'weui'
  import weui from 'weui.js'
  import { mapMutations } from 'vuex'

  const u = navigator.userAgent
  const website = 'https://ht.izycp.com'

  export default {
    data() {
      return {
        showClose: false,
        loading: null,
        contractList: [],
        customer_id: '',
        scrollbar: true,
        scrollbarFade: true,
        pullDownRefresh: true,
        pullDownRefreshThreshold: 90,
        pullDownRefreshStop: 60,
        startY: 0,
        hasData: false,
        device: ''
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
      loadingTip() {
        return this.$i18n.t('common.loading')
      },
      netWork() {
        return this.$i18n.t('common.network')
      },
      downloadTip() {
        return this.$i18n.t('common.downloadTip')
      },
      tip() {
        return this.$i18n.t('management.tip')
      },
      download() {
        return this.$i18n.t('management.download')
      },
      confirm() {
        return this.$i18n.t('common.confirm')
      }
    },
    created() {
      this.$i18n.locale = this.$route.params.lang === 'zh' ? 'zh' : this.$route.params.lang === 'en' ? 'en' : 'tw'
      this.loading = weui.loading(this.loadingTip)
      this.customer_id = getUserInfo().id
      if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) { // 安卓手机
        this.device = 'Android'
      } else if (u.indexOf('iPhone') > -1) { // 苹果手机
        this.device = 'iPhone'
      } else if (u.indexOf('Windows Phone') > -1) { // winphone手机
        this.device = 'WindowsPhone'
      }
    },
    mounted() {
      setTimeout(() => {
        this.getContractList()
      }, 20)
    },
    methods: {
      back() {
        this.$router.back()
      },
      getContractList() {
        $.ajax({
          type: 'POST',
          url: API.api + '/api/v1/contract/myContract',
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
            const list = res.rows
            this.contractList = list
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
        this.getContractList()
      },
      toSign(url) {
        this.setSignUrl(url)
        this.$router.push({
          path: '/sign-contract/' + this.$i18n.locale
        })
      },
      toView(url) {
        this.setViewUrl(url)
        this.$router.push({
          path: '/preview-contract/' + this.$i18n.locale
        })
      },
      toDownload() {
        weui.alert(`${this.tip} ${website} ${this.download}`, {
          title: this.downloadTip,
          buttons: [{
            label: this.confirm,
            type: 'primary',
            onClick: () => {
              console.log('ok')
            }
          }]
        })
      },
      ...mapMutations({
        setViewUrl: 'SET_VIEW_URL',
        setSignUrl: 'SET_SIGN_URL'
      })
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
    color: #333;
    font-size: 14px;
    display: flex;
    align-items: center;
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
    display: flex;
  }
  .item_action{
    position: relative;
    margin-top:10px;
    padding-top:10px;
    border-top:1px dashed #BDBDBD;
    display: flex;
  }
  .item_action .btn{
    display: block;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background: #ff5251;
    color: #fff;
    border-radius: 4px;
    box-sizing: border-box;
  }
  span {
    font-size: 14px;
  }
</style>
