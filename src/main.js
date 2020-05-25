import Vue from 'vue'
import App from './App.vue'
import store from './store'
import echarts from 'echarts'
import axios from 'axios'
import elementUI from 'element-ui'

import './assets/css/reset.css'
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false

Vue.prototype.$echarts = echarts
Vue.prototype.$http = axios

Vue.use(elementUI)

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
