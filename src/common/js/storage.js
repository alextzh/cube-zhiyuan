import storage from 'good-storage'

const USER_KEY = '__user__'
const PRODUCT_KEY = '__product__'
const POSITION_KEY = '__position__'
const NOTICE_KEY = '__notice__'

export function setUserInfo(obj) {
  storage.session.set(USER_KEY, obj)
}

export function getUserInfo() {
  return storage.session.get(USER_KEY, {})
}

export function setNotice(obj) {
  storage.session.set(NOTICE_KEY, obj)
}

export function getNotice() {
  return storage.session.get(NOTICE_KEY, {})
}

export function setPosition(obj) {
  storage.session.set(POSITION_KEY, obj)
}

export function getPosition() {
  return storage.session.get(POSITION_KEY, {})
}

export function setProduct(obj) {
  storage.session.set(PRODUCT_KEY, obj)
}

export function getProduct() {
  return storage.session.get(PRODUCT_KEY, {})
}

export function clearStorage() {
  storage.session.clear()
}
