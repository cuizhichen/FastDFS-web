import Vue from 'vue'
import Vuex from 'vuex'

import common from './module/common'
import home from './module/home'

Vue.use(Vuex)

const modules = {
  home,
  common,
}

export default new Vuex.Store({
  modules
}) 