import 'weui'
import weui from 'weui.js'

var system = {}
var p = navigator.platform
var u = navigator.userAgent

system.win = p.indexOf('Win') === 0
system.mac = p.indexOf('Mac') === 0
system.x11 = (p === 'X11') || (p.indexOf('Linux') === 0)
if (system.win || system.mac || system.xll) {
  if (u.indexOf('Windows Phone') > -1) {
    console.log('Windows Phone')
  } else {
    // 这里警告框会阻塞当前页面继续加载
    weui.alert('请使用移动端访问！', () => {
      // 以下代码是用javascript强行关闭当前页面
      var opened = window.open('https://abc0pgqi.zhiyuancaopan.com/#/weixin/' + this.$i18n.locale, '_self') // https://abc0pgqi.zhiyuancaopan.com/#/weixin or https://test123.zhiyuancaopan.com/#/weixin
      opened.opener = null
      opened.close()
    }, {
      title: '提示'
    })
  }
}
