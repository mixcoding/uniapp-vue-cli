/*
 * @Date: 2023-01-07 11:00:52
 * @LastEditors: mixcoding
 * @LastEditTime: 2023-01-07 11:12:49
 */
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'
import uView from "uview-ui";
Vue.use(uView);
const app = new Vue({
  ...App
})
app.$mount()
