// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'

import Vue from 'vue'
import Vuex from 'vuex';
import store from './store/store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import router from './router'

import axios from 'axios'
import qs from 'qs'
Vue.prototype.$http = axios;

// axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
axios.defaults.baseURL = 'http://spsapp.spsing.com';
// axios.defaults.baseURL = 'http://spsgo.spsing.com';
// axios.defaults.baseURL = 'http://192.168.1.112/Sps';
// axios.defaults.baseURL = 'http://192.168.1.125/Sps';

Vue.use(ElementUI);
Vue.use(Vuex)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
