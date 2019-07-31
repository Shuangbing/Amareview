import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router'
import moment from 'moment'
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'


Vue.component('chart', ECharts)
Vue.config.productionTip = false

import http from './http'

Vue.prototype.$http = http

Vue.filter('dateformat', function(date){
  return moment(date).format('YYYY-MM-DD HH:mm:ss')
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')