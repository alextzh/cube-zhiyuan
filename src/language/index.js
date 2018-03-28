import Vue from 'vue'
import VueI18n from 'vue-i18n'
import SimpleChinese from './simple-chinese'
import TraditionalChinese from './traditional-chinese'
import English from './english'

Vue.use(VueI18n)

export default new VueI18n({
  locale: 'zh',
  fallbackLocale: 'en',
  messages: {
    zh: SimpleChinese,
    en: English,
    tw: TraditionalChinese
  }
})
