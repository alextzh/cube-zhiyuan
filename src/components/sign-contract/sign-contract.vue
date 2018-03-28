<template>
  <transition name="slide">
    <div class="m-container">
      <navbar :title="$t('navigator.signContract')" :showClose="showClose" @back="back"></navbar>
      <div class="box">
        <iframe id="mainIframe" name="mainIframe" :src="signUrl" frameborder="0" scrolling="auto" ></iframe>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Navbar from 'base/navbar/navbar'
  import { mapGetters } from 'vuex'

  export default {
    data() {
      return {
        showClose: false
      }
    },
    computed: {
      ...mapGetters([
        'signUrl'
      ])
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
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 100;
    width: 100%;
    background: #fff;
  }
  .box{
    position: absolute;
    top: 50px;
    bottom: 0;
    width: 100%;
  }
  #mainIframe{
    width: 100%;
    height: 100%;
  }
</style>
