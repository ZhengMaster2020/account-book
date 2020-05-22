import Vue from 'vue'
import App from './App.vue'

import axios from 'axios'
import elementUI from 'element-ui'

import './assets/css/reset.css'
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false

Vue.prototype.$http = axios

Vue.use(elementUI)

new Vue({
  render: h => h(App),
}).$mount('#app')
