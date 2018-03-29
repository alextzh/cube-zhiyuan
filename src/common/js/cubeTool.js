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

/**
 * dialog封装
 * @param type: 类型 confirm
 * @param icon: 图标的class名称
 * @param title: 标题
 * @param content: 正文
*/
export function showDialog(title, content, confirmBtnText, cancelBtnText, confirmFn, cancelFn) {
  vm.$createDialog({
    type: 'confirm',
    icon: '',
    title: title,
    content: content,
    confirmBtn: {
      text: confirmBtnText,
      active: true,
      disabled: false,
      href: 'javascript:;'
    },
    cancelBtn: {
      text: cancelBtnText,
      active: false,
      disabled: false,
      href: 'javascript:;'
    },
    onConfirm: () => {
      confirmFn()
    },
    onCancel: () => {
      cancelFn()
    }
  }).show()
}

/**
 * picker封装
 * @param title: 标题 str
 * @param data: 传入 picker 数据 []
 * @param selectedIndex: 被选中的索引值，拉起 picker 后显示这个索引值对应的内容 [0]
 * @param cancelTxt: 取消按钮文案
 * @param confirmTxt: 确定按钮文案
*/
export function showPicker(title, data, selectedIndex, cancelTxt, confirmTxt, selectFn, cancelFn) {
  vm.$createPicker({
    title: title,
    data: [data],
    selectedIndex: [selectedIndex],
    cancelTxt: cancelTxt,
    confirmTxt: confirmTxt,
    onSelect: (selectedVal, selectedIndex, selectedText) => {
      selectFn(selectedVal, selectedIndex, selectedText)
    },
    onCancel: () => {
      cancelFn()
    }
  }).show()
}
