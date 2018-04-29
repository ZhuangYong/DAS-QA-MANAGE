/**
 * this.goPage("DeviceGroupPage", goPageParam);
 * goPageParam: {[formData] | [defaultSearch] | [defaultData]}
 * formData 自动初始化到下一个页面 formData
 * defaultSearch
 * defaultData 自动初始化到下一个页面，所有this.keyName = defaultData[keyName]
 *
 * changePrePageData(data) 修改上个页面的formData data -> formData 等同于 formData = Object.assign({}, formData, data)
 *
 */

import Component from "vue-class-component";
import Vue from 'vue';
import CommonTable from "../../components/Table/CommonTable";
import {Watch} from "vue-property-decorator/lib/vue-property-decorator";
import ConfirmDialog from '../../components/confirm';
import _ from "lodash";
import {bindData, unBindData} from "../../utils";
import Const from "../../utils/const";

@Component({
    name: "BasePage",
})
export default class BasePage extends Vue {
    loading = false; // 数据加载等待
    submitLoading = false; // 提交等待
    selectItems = []; // 选择列
    selectItem = {};
    defaultFormData = {};
    formData = {}; // 表单数据
    viewRule = []; // 列表显示字段与规则
    tipTxt = ""; // 提示信息
    dialogVisible = false; // 是否显示confirm
    enableDefaultTableCurrentPage = true; // 是否启用默认页
    defaultTableCurrentPage = 1; // 默认选择页数
    validateRule = {}; // 校验规则
    tableActionSearchColumn = []; // 列表搜索过滤
    delItemFun = null;
    // addItemFun = null;
    // updateItemFun = null;
    tableCanSelect = false; // 列表是否可以选择 默认可选
    pagination = true; // 列表是否展示底部分页信息 默认显示
    deFaultI18nData = {};
    lanList = []; // 多语言列表
    isVideo = false;
    i18nUploadImgApi = ""; // 多语言上传地址;
    searchId = '';
    // leftPageData = ""; // 从上个页面跳过来所带的数据
    // rightPageData = ""; // 从上个页面返回的时候所带的数据
    defaultSort = {}; // 列表默认排序
    refreshViewNumber = "";

    constructor() {
        super();
    }

    @Watch("loading", { immediate: true, deep: true })
    onLoadingChange(v) {
        const onLoadingChange = this.$vnode.onLoadingChange;
        onLoadingChange && onLoadingChange(v);
    }
    @Watch("submitLoading", { immediate: true, deep: true })
    onSubmitLoadingChange(v) {
        const onLoadingChange = this.$vnode.onLoadingChange;
        onLoadingChange && onLoadingChange(v);
    }
    @Watch("tableActionSearch", { immediate: true, deep: true })
    onTableActionSearchChange(v) {
        this.$refs.commonTable && this.$refs.commonTable.handelActionSearchChange();
        // this.$refs.commonTable.handelSearch();
    }

    /**
     * the param of last page
     * this.param
     */
    get param() {
        const {formData} = this.$vnode.extraData || {};
        return formData;
    }

    created() {
        this.resetFromData();
        this.handelGhostPageData();
        this.handelPageExtraPageData();
    }
    mounted() {
        bindData(this, this.$refs.addForm);
    }
    render(h) {
        return <div class={this.refreshViewNumber}>
            {
                this.pageCanBack() ? this.pageBackHtml(h) : ""
            }
            {
                this.topButtonHtml(h)
            }
            {
                this.$slots.default
            }
        </div>;
    }

    /**
     * 表格html
     * @param h
     * @returns {*}
     */
    tableHtml(h) {
        return <div>
            <CommonTable ref="commonTable"
                 data={this.tableData || {data: []}}
                 tableAction={this.tableAction}
                 defaultSort={this.defaultSort[this.tableAction]}
                 tableActionSearchColumn={this.tableActionSearchColumn}
                 tableActionSearch={this.tableActionSearch}
                 defaultCurrentPage={this.enableDefaultTableCurrentPage ? this.defaultTableCurrentPage : 0}
                 select={this.tableCanSelect}
                 viewRule={this.viewRule}
                 pagination={this.pagination}
                 handelSortChange={this.handelSortChange}
                 handleSelectionChange={this.handleSelectionChange}
                 handelTablePageChange={this.handelTablePageChange}
                 handelTableButtonsEvent={this.handelTableButtonsEvent}
            />
            <ConfirmDialog
                visible={this.dialogVisible}
                tipTxt={this.tipTxt}
                handelSure={this.sureCallbacks}
                handelCancel={() => {
                    this.dialogVisible = false;
                }}
            />
        </div>;
    }

    /**
     *  默认顶部按钮
     * @param h
     * @returns {*}
     */
    topButtonHtml(h) {
        return "";
    }

    /**
     * 返回按钮
     * @param h
     * @param txt
     * @returns {*}
     */
    pageBackHtml(h, txt = "") {
        return <el-button class="filter-item" onClick={this.pageBack} type="primary" icon="caret-left">
            {txt ? txt : '返回'}
        </el-button>;
    }

    /**
     * 返回按钮
     * @param h
     * @param txt
     * @returns {*}
     */
    pageBackFormHtml(h, txt = "") {

        return <div class="filter-container table-top-button-container">
            {
                this.pageBackHtml(h, txt)
            }
        </div>;
    }

    /**
     * 新增、修改提交
     */
    submitAddOrUpdate(success, fail) {
        if (!this.addFun && !this.editFun) throw new Error("没有设置操作方法！");
        this.$refs.addForm.validate((valid) => {
            if (valid) {
                let operateFun = this.editFun;
                if (!this.formData.id && this.addFun) operateFun = this.addFun;
                this.applyApiDurFun(operateFun, success, fail);
            } else {
                return false;
            }
        });
    }

    /**
     * 删除列
     * @param row
     * @param idKey
     * @param success
     * @param fail
     */
    submitDel(row, idKey, success, fail) {
        this.dialogVisible = true;
        this.tipTxt = "确定要删除吗？";
        const id = idKey ? row[idKey] : row.id;
        if (!this.delItemFun) throw new Error("没有指明删除方法！");
        this.sureCallbacks = () => {
            this.dialogVisible = false;
            this.submitLoading = true;
            this.delItemFun && this.delItemFun(id).then(res => {
                this.submitLoading = false;
                this.successMsg("删除成功");
                this.refreshTable();
                success && success(res);
            }).catch(err => {
                this.submitLoading = false;
                fail && fail(err);
            });
        };
    }

    /**
     *
     * @param fun
     * @param success
     * @param fail
     * @param noNeedLoading
     */
    applyApiDurFun(fun, success, fail, noNeedLoading) {
        if (!fun) return;
        !noNeedLoading && (this.submitLoading = true);
        if (this.formData.map && this.formData.map.nameKey && this.formData.map.nameKey.hasOwnProperty("type")) this.formData.map.nameKey.type = Const.TYPE_I18N_KEY_TXT;
        if (this.formData.map && this.formData.map.ottPicKey && this.formData.map.ottPicKey.hasOwnProperty("type")) this.formData.map.ottPicKey.type = Const.TYPE_I18N_KEY_IMG;
        if (this.formData.map && this.formData.map.wxPicKey && this.formData.map.wxPicKey.hasOwnProperty("type")) this.formData.map.wxPicKey.type = Const.TYPE_I18N_KEY_IMG;
        if (this.formData.map && this.formData.map.epgIndexKey && this.formData.map.epgIndexKey.hasOwnProperty("type")) this.formData.map.epgIndexKey.type = Const.TYPE_I18N_KEY_EPG;
        if (this.formData.map && this.formData.map.loadKey && this.formData.map.loadKey.hasOwnProperty("type")) this.formData.map.loadKey.type = Const.TYPE_I18N_KEY_LOAD;
        const submitFormData = Object.assign({}, this.beforeSubmit ? this.beforeSubmit(this.formData) : this.formData);
        fun(submitFormData).then(r => {
            this.successMsg();
            this.submitLoading = false;
            if (!(success instanceof Event)) success && success(r);
        }).catch(err => {
            this.submitLoading = false;
            this.failMsg(err);
            fail && fail(err);
        });
    }

    /**
     * 当表格当前页码修改的时候
     * @param currentTablePage
     */
    handelTablePageChange(currentTablePage) {
        this.defaultTableCurrentPage = currentTablePage;
    }

    /**
     *
     * @param eventType
     * @param row
     */
    handelTableButtonsEvent(eventType, row) {
        const funcName = "handel" + eventType.replace(/^\S/, s => s.toUpperCase());
        const handelTableTopButtonTypeEvent = this[funcName];
        if (handelTableTopButtonTypeEvent) handelTableTopButtonTypeEvent.apply(this, [row]);
    }

    handelSortChange(sort) {
        this.defaultSort = sort;
    }

    /**
     * 默认点击修改跳转到EditPage
     * @param row 列表行数据
     */
    handelEdit(row) {
        this.goPage("EditPage", {formData: row});
    }

    /**
     * 默认点击列表中行中的删除
     * @param row
     */
    handelDel(row) {
        this.submitDel(row);
    }

    /**
     * 处理上个页面修改本页面返回后的数据
     */
    handelGhostPageData() {
        if (this.$vnode.ghostPageData) {
            Object.keys(this.$vnode.ghostPageData).map(key => {
                this[key] = this.$vnode.ghostPageData[key];
            });
        }
    }

    /**
     *  处理从上个页面带过来的数据
     *  formData 与 其他data值分开处理
     */
    handelPageExtraPageData() {
        const {formData, defaultSearch, defaultData} = this.$vnode.extraData || {};
        if (formData) this.formData = Object.assign({}, this.formData, formData);

        // 跳转到指定页面并初始化搜索条件值
        if (defaultSearch && this.tableActionSearch.length) {
            defaultSearch.map(defaultSearchItem => {
                Object.keys(defaultSearchItem).map(key => {
                    this.tableActionSearch.map(searchItem => {
                        const {column} = searchItem;
                        if (column === key) searchItem.value = defaultSearchItem[key];
                    });
                });
            });
        }

        // 除formData外其他需要初始化data值
        if (defaultData) {
            Object.keys(defaultData).map(key => {
               this[key] = defaultData[key];
            });
        }
    }

    //----------------------
    // 图片相关
    //----------------------
    // 当图片选择修改的时候
    chooseChange (file, fileList, uploadImgItem) {
        if (!this.submitLoading) {
            this.imgChooseFileList = fileList;
            const {name, name2} = uploadImgItem;
            if (fileList.length > 0) {
                const imgnet = (fileList[0].response && fileList[0].response.data.imageNet) || fileList[0].url;
                if (typeof name === "function") {
                    name(imgnet);
                } else {
                    name && (this.formData[name] = imgnet);
                }
            } else {
                if (typeof name === "function") {
                    name("");
                    this.refreshViewNumber = Math.random();
                } else {
                    name && (this.formData[name] = "");
                    name2 && (this.formData[name2] = "");
                }

            }
        }
    }

    /**
     * 图片上传成功
     * @param data
     * @param uploadImgItem
     */
    uploadSuccess (data, uploadImgItem) {
        const {imageNet, imgPath} = data;
        const {name, name2} = uploadImgItem;
        if (name && typeof name === "function") {
            name(imageNet);
        } else {
            name && (this.formData[name] = imageNet);
            name2 && (this.formData[name2] = imgPath);
        }
        uploadImgItem.uploadSuccessData = data;
        this.submitLoading = false;
    }

    /**
     * 图片上传之前
     */
    beforeUpload () {
        this.submitLoading = true;
    }


    /**
     * 重置表单数据
     */
    resetFromData() {
        this.formData = _.cloneDeep(this.defaultFormData);
    }

    /**
     * 刷新列表
     */
    refreshTable() {
        this.$refs.commonTable && this.$refs.commonTable.refreshData({
            currentPage: this.defaultTableCurrentPage
        });
    }

    /**
     * 修改上个页面的数据
     * @param data
     */
    changePrePageData(data = {}) {
        if (this.$vnode.leftPageData && this.$vnode.leftPageData.formData) {
            this.$vnode.leftPageData.formData = Object.assign({}, this.$vnode.leftPageData.formData, data);
        }
        console.log(this.$vnode.leftPageData);
    }

    /**
     * jump page with name and data: extraData
     * @param pageName
     *          the name of the page to go
     * @param extraData
     *          the data will be take to the back page
     *          extraData will handel in function handelPageExtraPageData when run in Life cycle: created
     */
    goPage(pageName, extraData) {
        this.$vnode.subPageRouter.goPage(pageName, this._data, extraData);
    }

    /**
     * page back with data: extraData
     * @param extraData
     *          The data will be take to the back page
     *          extraData will handel in function handelPageExtraPageData when run in Life cycle: created
     */
    pageBack(extraData) {
        const ghostPageData = this.$vnode.leftPageData; // 上个页面传过来的数据，修改后返回回去
        this.$vnode.subPageRouter.pageBack(this._data, ghostPageData, extraData);
    }

    /**
     * return to the page with name and extra data
     * @param pageName
     * @param extraData
     *          the data will be take to the back page
     *          extraData will handel in function handelPageExtraPageData when run in Life cycle: created
     */
    pageBackTo(pageName, extraData) {
        const ghostPageData = this.$vnode.leftPageData; // 上个页面传过来的数据，修改后返回回去
        this.$vnode.subPageRouter.pageBackTo(pageName, this._data, ghostPageData, extraData);
    }

    /**
     * page can return or not
     * @returns {boolean}
     */
    pageCanBack() {
        return !!(this.$vnode.subPageRouter && this.$vnode.subPageRouter.pageCanBack());
    }

    /**
     * show success message
     * @param msg
     */
    successMsg(msg) {
        this.$message({
            message: msg || "操作成功",
            type: "success"
        });
    }

    /**
     * show fail message
     * @param err
     */
    failMsg(err) {
        this.$message.error(`操作失败(${typeof err === 'string' ? err : ''})！`);
    }

}


