<template>
  <transition name="slide">
    <div class="m-container">
      <navbar :title="$t('navigator.noticeDetail')" @back="back" :showClose="showClose"></navbar>
      <div class="box">
        <div class="title"><span>{{curNotice.title}}</span></div>
        <div class="pub_time"><span>{{$t('notice.releaseTime')}}：{{curNotice.pub_time}}</span></div>
        <div class="content" v-if="curNotice.type !== 'JZGG'" v-html="content"></div>
        <div class="table" v-if="curNotice.type === 'JZGG'">
          <div class="tr">
            <div class="th">项目</div>
            <div class="th">操盘起始时间</div>
            <div class="th">累计净值</div>
            <div class="th">最新净值</div>
          </div>
          <div class="tr" v-for="(item, index) in content" v-bind:key="index">
            <div class="td">{{item[0]}}</div>
            <div class="td">{{item[1]}}</div>
            <div class="td">{{item[2]}}</div>
            <div class="td">{{item[3]}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Navbar from 'base/navbar/navbar'
  import {getNotice} from 'common/js/storage'

  export default {
    data() {
      return {
        showClose: false,
        curNotice: null
      }
    },
    computed: {
      content() {
        if (this.curNotice.type === 'JZGG') {
          return this.handleStr(this.curNotice.content)
        } else {
          return this.curNotice.content.trim()
        }
      }
    },
    created() {
      this.$i18n.locale = this.$route.params.lang === 'zh' ? 'zh' : this.$route.params.lang === 'en' ? 'en' : 'tw'
      this.curNotice = getNotice()
    },
    methods: {
      back() {
        this.$router.back()
      },
      handleStr(str) {
        const _str = str.trim()
        const arr = _str.split('\x0a')
        const _arr = arr.map((item) => {
          return item.split('|')
        })
        return _arr
      }
    },
    components: {
      Navbar
    }
  }
</script>

<style scoped lang="scss">
  .m-container {
    position: relative;
    width: 100%;
    background: #fff;
  }
  .box {
    display:flex;
    flex-direction:column;
    justify-content:center;
    padding:15px;
    width:100%;
    box-sizing:border-box;
    padding-top: 65px;
  }
  .title {
    padding-bottom: 10px;
  }
  .title span {
    font-size: 18px;
    color: #ff5251;
  }
  .pub_time span {
    font-size: 12px;
    color: #999999;
  }
  .content{
    font-size: 14px;
    padding: 10px 0;
    white-space: pre-wrap;
    line-height: 1.5;
  }
  .table{
    position: relative;
    border-right: 0;
    border-bottom: 0;
    width: 100%;
    box-sizing: border-box;
    margin-top: 20px;
  }
  .table::after{
    content: "";
    pointer-events: none;
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    transform-origin: 0 0;
    border: 1PX solid #DADADA;
    border-radius: 2PX;
    box-sizing: border-box;
    width: 200%;
    height: 200%;
    transform: scale(0.5) translateZ(0);
  }
  .tr{
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .th,.td {
    position: relative;
    padding: 10px 0;
    font-size: 12px;
    text-align: center;
    width:100%;
    box-sizing: border-box;
  }
  .th::after, .td::after{
    content: "";
    pointer-events: none;
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    transform-origin: 0 0;
    border-bottom: 1px solid #DADADA;
    border-right: 1px solid #DADADA;
    border-radius: 2PX;
    box-sizing: border-box;
    width: 200%;
    height: 200%;
    transform: scale(0.5) translateZ(0);
  }
  .th {
    font-weight: 400;
    background-color: #DADADA;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
</style>
