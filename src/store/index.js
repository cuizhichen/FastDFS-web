import Vue from 'vue'
import Vuex from 'vuex'
import home from './module/home'

Vue.use(Vuex)

const modules = {
  home,
}

export default new Vuex.Store({
  modules
})