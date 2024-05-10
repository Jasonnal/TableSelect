import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from '../src/router'
import store from '../src/store'
import Cookie from 'js-cookie';
import request from '@/utils/request'
Vue.config.productionTip = false
Vue.use(ElementUI);  //全局注入配置ELementUi
Vue.prototype.$request=request
Vue.prototype.$baseUrl=process.env.VUE_APP_BASEURL
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')


