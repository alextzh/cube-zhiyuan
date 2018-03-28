<template>
  <transition name="slide">
    <div class="m-container">
      <navbar :title="$t('navigator.noticeDetail')" @back="back" :showClose="showClose"></navbar>
      <div class="box">
        <div class="title"><span>{{curNotice.title}}</span></div>
        <div class="pub_time"><span>{{$t('notice.releaseTime')}}：{{curNotice.pub_time}}</span></div>
        <div class="content" v-html="content"></div>
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
        return this.curNotice.content.trim()
      }
    },
    created() {
      this.$i18n.locale = this.$route.params.lang === 'zh' ? 'zh' : this.$route.params.lang === 'en' ? 'en' : 'tw'
      this.curNotice = getNotice()
    },
    mounted() {
    },
    methods: {
      back() {
        this.$router.back()
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
  }
</style>
