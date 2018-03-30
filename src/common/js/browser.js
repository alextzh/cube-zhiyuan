import i18n from '../../language/index'

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
    window.location.href = 'https://abc0pgqi.zhiyuancaopan.com/#/weixin/' + i18n.locale
  }
}
