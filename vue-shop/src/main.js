import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import ElementUI from 'element-ui';
import Vant from 'vant'
import 'element-ui/lib/theme-chalk/index.css';
import 'vant/lib/index.css'
Vue.use(ElementUI);
Vue.use(Vant);
Vue.config.productionTip = false
Vue.prototype.$http=axios
/* 允许http请求携带cookie */
axios.defaults.withCredentials=true
/* 允许跨域访问cookie */
axios.defaults.crossDomain=true
axios.defaults.baseURL='http://192.168.14.27:3000/'
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
