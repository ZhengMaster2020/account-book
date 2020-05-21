import Vue from 'vue'
import App from './App.vue'

import axios from 'axios'


// const  { changeCSVToJSON } = require('./utils/serve')
// changeCSVToJSON('./mock/bill.csv')

import { fetchData } from './utils/index'
fetchData()
// getData('src/mock/bill.csv')

Vue.config.productionTip = false

Vue.prototype.$http = axios

new Vue({
  render: h => h(App),
}).$mount('#app')
