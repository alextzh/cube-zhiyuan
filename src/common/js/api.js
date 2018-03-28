import axios from 'axios'
import {getMd5} from './tool'
import * as API from 'common/js/http'

const axiosIns = axios.create({})

axiosIns.defaults.timeout = 5000

// 请求拦截器
axiosIns.interceptors.request.use(config => {
  console.log(config)
  // 发起请求时，取消掉当前正在进行的相同请求
  config.headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'secret_key': getMd5(),
    'time_stamp': new Date().getTime()
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
axiosIns.interceptors.response.use((response) => {
  return response
}, error => {
  return Promise.reject(error)
})

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch(url, params = {}) {
  const _url = API.api + url
  return new Promise((resolve, reject) => {
    axiosIns.get(_url, {
      params: params
    }).then(response => {
      resolve(response.data)
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}) {
  const _url = API.api + url
  return new Promise((resolve, reject) => {
    axiosIns.post(_url, data)
      .then(response => {
        resolve(response.data)
      }).catch(err => {
        reject(err)
      })
  })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
*/

export function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    axiosIns.patch(url, data)
      .then(response => {
        resolve(response.data)
      }).catch(err => {
        reject(err)
      })
  })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
*/

export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    axiosIns.put(url, data)
      .then(response => {
        resolve(response.data)
      }).catch(err => {
        reject(err)
      })
  })
}
