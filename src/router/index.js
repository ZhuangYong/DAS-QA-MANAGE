import Vue from 'vue';
import Router from 'vue-router';
import Layout from '../views/layout/Layout';
import qaPage from '../views/qas/index';
import examsPage from '../views/qas/exams';

const _import = require('./_import_' + process.env.NODE_ENV);

Vue.use(Router);

export const constantRouterMap = [
    {path: '/login', component: _import('login/index'), hidden: true},
    {path: '/404', component: _import('errorPage/404'), hidden: true},
    {path: '/401', component: _import('errorPage/401'), hidden: true},
    {
        path: '',
        component: Layout,
        redirect: "/info",
        icon: 'theme',
        name: '问卷管理',
        // children: [{path: 'dashboard', component: _import('dashboard/index')}]
        children: [
            {path: 'info', component: qaPage, name: '问卷列表'},
            {path: 'list', component: examsPage, name: '题库管理'},
        ]
    },
];

export default new Router({
    mode: 'history',
    scrollBehavior: () => ({y: 0}),
    routes: constantRouterMap
});
export const asyncRouterMap = [
    {path: '*', redirect: '/404', hidden: true}
];
