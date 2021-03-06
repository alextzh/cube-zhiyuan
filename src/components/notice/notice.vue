<template>
  <transition name="slide">
    <div class="m-container">
      <navbar :title="$t('navigator.notice')" @back="back" :showClose="showClose"></navbar>
      <div class="list">
        <cube-scroll ref="scroll"
                     v-if="noticeList.length > 0"
                     :options="options"
                     @pulling-down="onPullingDown">
          <div class="item-box" v-for="(item, index) in noticeList" v-bind:key="index">
            <div class="item" @click="toItem(item.id)">
              <div class="item_left">
                <span class="title">{{index + 1}}、{{item.text}}</span>
              </div>
            </div>
          </div>
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
  import * as API from 'common/js/http'
  import {getMd5, getBJDate} from 'common/js/tool'
  import {showToast} from 'common/js/cubeTool'

  export default {
    data() {
      return {
        showClose: false,
        loading: null,
        noticeList: [],
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
      loadingTip() {
        return this.$i18n.t('common.loading')
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
        const time_stamp = getBJDate()
        const secret_key = getMd5()
        $.ajax({
          type: 'POST',
          url: API.api + '/api/v1/notice/caption',
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
            const list = res.rows
            this.noticeList = list
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
        this._getNoticeList()
      },
      toItem(id) {
        this.$router.push({
          path: '/notice-item/' + id + '/' + this.$i18n.locale
        })
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
    background: #fff;
  }
  .list{
    position: fixed;
    top: 50px;
    bottom: 0;
    width: 100%;
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
  span {
    font-size: 14px;
  }
</style>
