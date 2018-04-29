import {asyncRouterMap, constantRouterMap} from '../../router';
import {parseTime} from '../../utils/filters';

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param urls
 * @param route
 * @param PPath
 */
function hasPermission(urls, route, PPath = "") {
    if (route.path === "*") return true;
    const has = Object.keys(urls).some(k => {
        const routPath = PPath.split("/").filter(p => p).concat(route.path.split("/").filter(p => p)).join("/");
        const urlPath = k.split("/").filter(p => p).join("/");
        route.component.path = routPath;
        if (route.component.computed) route.component.computed.path = () => routPath;
        return routPath === urlPath;
    });
    return has;
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param urls
 * @param PPath
 */
function filterAsyncRouter(asyncRouterMap, urls, PPath = "") {
    const accessedRouters = asyncRouterMap.filter(route => {
        if (route.children && route.children.length) {
            route.children = filterAsyncRouter(route.children, urls, PPath.split("/").filter(p => p).concat(route.path.split("/").filter(p => p)).join("/"));
            return route.children.length;
        } else {
            return hasPermission(urls, route, PPath);
        }
    });
    return accessedRouters;
}

const permission = {
    state: {
        routers: constantRouterMap,
        addRouters: []
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.addRouters = routers;
            state.routers = constantRouterMap.concat(routers);
        }
    },
    actions: {
        GenerateRoutes({commit}, data) {
            return new Promise(resolve => {
                const {urls, time} = data;
                let accessedRouters;
                if (time && time.split(" ")[0] === parseTime(new Date(), '{y}-{m}-{d}')) {
                    accessedRouters = asyncRouterMap;
                } else {
                    accessedRouters = filterAsyncRouter(asyncRouterMap, urls);
                }
                commit('SET_ROUTERS', accessedRouters);
                resolve();
            });
        }
    }
};

export default permission;
