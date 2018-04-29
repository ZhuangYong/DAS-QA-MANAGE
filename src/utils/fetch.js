import axios from 'axios';
import {Message, MessageBox} from 'element-ui';
import store from '../store';
import {getToken} from '../utils/auth';
import Const from './const';
import Cookies from 'js-cookie';
import {rememberPath} from "./index";

// 创建axios实例
const service = axios.create({
    // withCredentials: true,
    baseURL: process.env.BASE_API, // api的base_url
    timeout: 25000                  // 请求超时时间
});

// request拦截器
service.interceptors.request.use(config => {
    // Do something before request is sent
    if (store.getters.auth.token) {
        config.headers['token'] = getToken();
        // config.headers['Access-Control-Allow-Origin'] = true
    }
    let {data, url} = config;
    if (data) {
        const {urlJoin} = data;
        if (urlJoin) {
            config.url = url + urlJoin;
            delete data.urlJoin;
            config.data = data;
        }
    }
    return config;
}, error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
});

// respone拦截器
service.interceptors.response.use(
    response => {
        const res = response.data;
        const {msg, code: status, data} = res;
        if (status !== Const.CODE_SUCCESS) {
            handelErrCode(status, msg);
            return Promise.reject(msg);
            // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
            // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
            //     MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
            //         confirmButtonText: '重新登录',
            //         cancelButtonText: '取消',
            //         type: 'warning'
            //     }).then(() => {
            //         store.dispatch('FedLogOut').then(() => {
            //             location.reload();// 为了重新实例化vue-router对象 避免bug
            //         });
            //     });
            // }
        } else {
            return data || "";
        }
    },

    /**
     * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
     * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
     */

    error => {
        const {response = {}} = error || {};
        const {status, data} = response;
        console.log('err' + error);// for debug
        if (status === 302) {
            rememberPath();
            location.href = data.data;
        }
        handelErrCode(status, error.message);
        return Promise.reject(error);
    },

);

function handelErrCode(code, msg) {
    let errMsg = "";
    switch (code) {
        case Const.CODE_BAD_REQUEST:
            errMsg = "参数错误";
            break;
        case Const.CODE_NEED_LOGIN:
            errMsg = "请登录";
            break;
        case Const.CODE_BAD_CREDENTIALS:
            errMsg = "用户名或密码错误";
            break;
        case Const.CODE_SERVICE_ERR:
            errMsg = "";
            break;
        default:
            break;
    }
    Message({
        message: (errMsg || "操作失败") + `${msg ? `(${msg})` : ""}`,
        type: 'error',
        duration: Const.FETCH_ERROR_COUNT * 1000
    });
}

export default service;
