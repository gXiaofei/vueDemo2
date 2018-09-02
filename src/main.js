// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '../static/font-awesome-4.7.0/css/font-awesome.min.css';
import axios from 'axios';
import jsCookie from 'js-cookie';

Vue.prototype.$axios = axios;
Vue.prototype.$Cookie = jsCookie;

Vue.config.productionTip = false;
Vue.use(ElementUI);
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
});
