const getters = {
    permission: state => state.permission,
    sidebar: state => state.app.sidebar,
    visitedViews: state => state.app.visitedViews,
    auth: state => state.auth,
    qas: state => state.qas,
};
export default getters;
