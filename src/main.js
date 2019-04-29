import Vue from 'vue'
import App from './App.vue';
import router from './router'
import store from './store'

import ElementUI from 'element-ui';
import './element-variables.scss'

import '@/assets/css/universal.css'
import '@/assets/css/layout.css'

Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
