<template>
  <transition name="slide">
    <div class="box">
      <div class="weixin">
        <img src="./weixin.png" alt="请用微信扫一扫访问">
        <p>请使用微信扫一扫访问</p>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
      }
    },
    created() {
      this.$i18n.locale = this.$route.params.lang === 'zh' ? 'zh' : this.$route.params.lang === 'en' ? 'en' : 'tw'
    }
  }
</script>

<style scoped lang="scss">
.box {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  background: #ffffff;
}
.weixin {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
