import * as types from './mutation-types'

const mutations = {
  [types.SET_VIEW_URL](state, url) {
    state.viewUrl = url
  },
  [types.SET_SIGN_URL](state, url) {
    state.signUrl = url
  }
}

export default mutations
