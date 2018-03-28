import Md5 from './md5'

// 截取年月日
export function _normalizeDate(date) {
  return date.substr(0, 10)
}

// 转为以万为单位
export function rendererZhMoneyWan(v) {
  if (isNaN(v)) {
    return v
  }
  v = v * 0.0001 // 10000
  v = parseInt(v)
  rendererZhMoney(v)
  return v
}
// 数字千分符
function rendererZhMoney(v) {
  if (isNaN(v)) {
    return v
  }
  v = (Math.round((v - 0) * 100)) / 100
  v = (v === Math.floor(v)) ? v + '.00' : ((v * 10 === Math.floor(v * 10)) ? v + '0' : v)
  v = String(v)
  var ps = v.split('.')
  var whole = ps[0]
  // var sub = ps[1] ? '.' + ps[1] : '.00'
  var r = /(\d+)(\d{3})/
  while (r.test(whole)) {
    whole = whole.replace(r, '$1' + ',' + '$2')
  }
  v = whole
  return v
}
// 数字千分符转数字
export function rendertoNumber(num) {
  num = num.split(',').join('')
  return num
}

export function _normalizeStr(str) {
  str = str || ''
  const arr = str.split(',')
  const newArr = arr.map(item => {
    return item
  })
  return newArr
}

export function getMd5() {
  const timestamp = getBJDate().getTime()
  const key = 'zhiyuancp'
  const str = `${timestamp}${key}`
  return Md5(str)
}

export function time_range(beginTime, endTime) {
  var strb = beginTime.split(':')
  if (strb.length !== 2) {
    return false
  }

  var stre = endTime.split(':')
  if (stre.length !== 2) {
    return false
  }

  var b = getBJDate()
  var e = getBJDate()
  var n = getBJDate()

  b.setHours(strb[0])
  b.setMinutes(strb[1])
  e.setHours(stre[0])
  e.setMinutes(stre[1])

  if (n.getTime() - b.getTime() > 0 && n.getTime() - e.getTime() < 0) {
    return true
  } else {
    return false
  }
}

export function getBJDate() {
  var d = new Date()
  var currentDate = new Date()
  var tmpHours = currentDate.getHours()
  // 算得时区
  var time_zone = -d.getTimezoneOffset() / 60
  // 少于0的是西区 西区应该用时区绝对值加京八区 重新设置时间（西区时间比东区时间早 所以加时区间隔）
  if (time_zone < 0) {
    time_zone = Math.abs(time_zone) + 8
    currentDate.setHours(tmpHours + time_zone)
  } else {
    // 大于0的是东区  东区时间直接跟京八区相减
    time_zone -= 8
    currentDate.setHours(tmpHours - time_zone)
  }
  return currentDate
}
