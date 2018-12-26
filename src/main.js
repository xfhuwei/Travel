// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import fastClick from 'fastClick' // 移动端点击300ms延迟问题解决方案
import VueAwesomeSwiper from 'vue-awesome-swiper'
import store from './store'
import 'swiper/dist/css/swiper.css'
import 'styles/reset.css' // 初始化css
import 'styles/border.css' // 1px边框
import 'styles/iconfont.css' // 1px边框

import lodash from 'lodash'
Object.defineProperty(Vue.prototype, '$_', { value: lodash }) // 全局引用lodash

Vue.config.productionTip = false

fastClick.attach(document.body)
Vue.use(VueAwesomeSwiper)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  store,
  template: '<App/>'
})
