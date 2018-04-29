export default {
    CODE_SUCCESS: 200,

    CODE_BAD_REQUEST: 400,

    CODE_BAD_CREDENTIALS: 401,

    CODE_SERVICE_ERR: 500,

    CODE_NEED_LOGIN: 1004,

    // fetch方法失败提示信息显示时间
    FETCH_ERROR_COUNT: 3,

    // 登陆前url记录key
    BEFORE_LOGIN_URL_KEY: "BEFORE_LOGIN_URL_KEY",

    // 检查正在从雷客更新数据的状态
    CHECK_LEIKE_BETWEEN_TIME: 5000,

    // 从雷客更新数据 0： 正在更新 1：更新完成
    STATUS_UPDATE_DATE_FROM_LEIKE_UPDATE_ING: '0',

    BASE_API: process.env.BASE_API,

    OSS_DOM: process.env.OSS_DOM,

    PAGE_SET: {
        PAGE_LIST: 'list',
        PAGE_EDIT: 'edit',
        PAGE_ADD: 'add',
        PAGE_TREE: 'tree',
        PAGE_EDIT_I18N: 'editI18n',
        currentPage: location.hash ? location.hash.replace("#", "") : 'list'
    },

    //1为图片，2为文字，3为epg选择，4为load选择

    TYPE_I18N_KEY_IMG: 1,

    TYPE_I18N_KEY_TXT: 2,

    TYPE_I18N_KEY_EPG: 3,

    TYPE_I18N_KEY_LOAD: 4,

    // 金麦客
    USER_TYPE_JMAKE: 1,
    // 销售方
    USER_TYPE_SALES: 2,
    // 渠道方
    USER_TYPE_MANUFACTURER: 3,

    // 是否启用
    IS_ENABLE_TRUE: 1,
    IS_ENABLE_FALSE: 2,

    dataRangerOption: {
        shortcuts: [{
            text: '最近一周',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
            }
        }, {
            text: '最近15天',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
                picker.$emit('pick', [start, end]);
            }
        }, {
            text: '最近一个月',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
            }
        }]
    },

    //----------
    //  按钮权限
    //----------
    ROLE: {
        ROLE_ADD: "addRole",
        ROLE_EDIT: "editRole",
        ROLE_DELETE: "delRole",
        ROLE_APPLY: "applyRole"
    },

    ACCOUNT: {
        ACCOUNT_SUPER_MANAGE_TOGGLE: "toggleSuperManage",
        ACCOUNT_RESET_PWD: "resetPwd",
        ACCOUNT_ADD: "addAccount",
        ACCOUNT_EDIT: "editAccount",
        ACCOUNT_DELETE: "delAccount",
        ACCOUNT_APPLY: "applyAccount"
    },

};
