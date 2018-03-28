import Vue from 'vue'

const vm = new Vue()

/**
 * toast封装
 * @param txt: 显示内容
 * @param type: 图标类型 loading/correct/error/warn 默认loading
 * @param mask: 设置为 true 时会显示遮罩
 * @param time: 显示时间 默认3000ms
*/
export function showToast(txt, type) {
  vm.$createToast({
    type: type,
    mask: true,
    txt: txt,
    time: 500
  }).show()
}

/**
 * alert封装
 * @param type: 类型alert
 * @param icon: 图标的class名称
 * @param title: 标题
 * @param content: 正文
*/
export function showAlert(title, content, confirmBtnText) {
  vm.$createDialog({
    type: 'alert',
    title: title,
    content: content,
    icon: '',
    confirmBtn: {
      text: confirmBtnText,
      active: true,
      disabled: false,
      href: 'javascript:;'
    }
  }).show()
}
