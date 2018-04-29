import Vue from 'vue';
import ElementUI from 'element-ui';
import 'assets/themes/index.css';
import App from './App.vue';
import router from './router';
import store from './store';
import * as filters from './utils/filters'; // 全局filter
import './assets/icons'; // icon
import './errorLog';// error log
import './permission'; // 权限
import './styles/main.scss';
// import "vue-tsx-support/enable-check";
import './utils/class-component-hooks';

Vue.use(ElementUI);

// register global utility filters.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;

new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {App}
});

