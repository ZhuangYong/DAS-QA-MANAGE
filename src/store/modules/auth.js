import {loginByUsername, logout, getUserInfo} from '../../api/auth';
import {getToken, setToken, removeToken} from '../../utils/auth';

const auth = {
    state: {
        userInfo: {},
        token: getToken(),
        roles: [],
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token;
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles;
        },
        SET_USER_INFO: (state, data) => {
            state.userInfo = data;
            state.roles = data.roles;
        },
    },

    actions: {
        // 用户名登录
        LoginByUsername({commit}, userInfo) {
            const username = userInfo.username.trim();
            return new Promise((resolve, reject) => {
                loginByUsername(username, userInfo.password, userInfo.validateCode, userInfo.validateCodeKey).then(response => {
                    setToken(response.token);
                    commit('SET_TOKEN', response.token);
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        },

        // 获取用户信息
        GetUserInfo({commit, state}) {
            return new Promise((resolve, reject) => {
                getUserInfo(state.token).then(response => {
                    if (!response) {
                        reject('error');
                    }
                    commit('SET_USER_INFO', response);
                    resolve(response);
                }).catch(error => {
                    reject(error);
                });
            });
        },

        LogOut({commit, state}) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    commit('SET_TOKEN', '');
                    commit('SET_ROLES', []);
                    removeToken();
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        },

        // 前端 登出
        FedLogOut({commit}) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '');
                removeToken();
                resolve();
            });
        },

    }
};

export default auth;
