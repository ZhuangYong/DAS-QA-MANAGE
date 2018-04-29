import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import auth from './modules/auth';
import permission from './modules/permission';
import qas from './modules/qas';
import getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        app,
        auth,
        permission,
        qas
    },
    getters
});

export default store;
