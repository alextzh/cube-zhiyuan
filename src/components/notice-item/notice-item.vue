<template>
  <transition name="slide">
    <div class="m-container">
      <navbar :title="title" @back="back" :showClose="showClose"></navbar>
      <div class="list">
        <scroll ref="scroll" class="scroll_list"
                v-if="noticeList.length > 0"
                :scrollbar="scrollbarObj"
                :pullDownRefresh="pullDownRefreshObj"
                :startY="parseInt(startY)"
                @pullingDown="onPullingDown">
          <li class="item-box" v-for="(item, index) in noticeList" :key="index">
            <div class="item" @click="toDetail(item)">
              <div class="item_left">
                <span class="title">{{item.title}}</span>
                <span class="pub_time">{{item.pub_time}}</span>
              </div>
              <div class="item_right">
                <span class="btn">{{$t('notice.viewDetail')}}</span>
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
  import {setNotice} from 'common/js/storage'
  import {getMd5, getBJDate} from 'common/js/tool'
  import 'weui'
  import weui from 'weui.js'

  export default {
    data() {
      return {
        id: '',
        showClose: false,
        loading: null,
        noticeList: [],
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
      title: function() {
        const id = this.$route.path.split('/')[2]
        this.id = id
        return id === 'PTGG' ? this.$i18n.t('navigator.systemNotice') : id === 'CPGG' ? this.$i18n.t('navigator.productNotice') : ''
      },
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
      }
    },
    created() {
      this.$i18n.locale = this.$route.params.lang === 'zh' ? 'zh' : this.$route.params.lang === 'en' ? 'en' : 'tw'
      this.loading = weui.loading(this.loadingTip)
    },
    mounted() {
      setTimeout(() => {
        this._getNoticeList()
      }, 20)
    },
    methods: {
      back() {
        this.$router.back()
      },
      _getNoticeList() {
        const id = this.id
        $.ajax({
          type: 'POST',
          url: API.api + '/api/v1/notice/all',
          data: {
            type_id: id
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
            const list = res.obj
            this.noticeList = list
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
        this._getNoticeList()
      },
      toDetail(item) {
        setNotice(item)
        this.$router.push({
          path: '/notice-detail/' + this.$i18n.locale
        })
      }
    },
    components: {
      Navbar,
      Scroll
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
    background: #fff;
  }
  .list{
    position: fixed;
    top: 50px;
    bottom: 0;
    width: 100%;
  }
  .scroll_list {
    height: 100%;
    overflow: hidden;
  }
  .item-box {
    padding-bottom: 10px;
  }
  .item{
    position:relative;
    display: flex;
    align-items: center;
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
  .item_left{
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow:hidden;
  }
  .item_left .title {
    font-size: 18px;
    padding-bottom: 5px;
    flex:1;
    text-overflow:ellipsis;
    overflow:hidden;
    white-space:nowrap;
    color: #ff5251;
  }
  .item_left .pub_time {
    color: #999;
  }
  .item_right{
    flex: 0 1 auto;
  }
  span {
    font-size: 14px;
  }
</style>
