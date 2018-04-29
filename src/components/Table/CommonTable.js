/*
 * Copyright (c) 2018 J-MAKE.COM All Rights Reserved.FileName: CommonTable.js @author: walljack@163.com @date: 18-1-31 下午9:32 @version: 1.0
 */
import {Vue, Component, Watch} from "vue-property-decorator";
import imageViewer from "vue-image-viewer";
import "vue-image-viewer/lib/vue-image-viewer.css";
import VueSimpleAudio from "vue-simple-audio/src/index";
import Const from "../../utils/const";
import _ from "lodash";

@Component({
    name: "CommonTable",
    components: {
        imageViewer,
        VueSimpleAudio
    },
    props: {
        defaultCurrentPage: {
            type: Number,
            default: 1
        },
        tableAction: {
            require: true,
            type: String,
        },
        tableActionSearchColumn: {
            type: Array
        },
        tableActionSearch: {
            type: Array,
            default: f => []
        },
        data: {
            type: Object
        },
        viewRule: {
            type: Array
        },
        select: {
            type: Boolean
        },
        sortable: {
            type: Boolean
        },
        pagination: {
            type: Boolean,
            default: true
        },
        'filter-multiple': {
            type: Boolean,
            default: true
        },
        handleSelectionChange: {
            type: Function
        },
        handelTablePageChange: {
            type: Function,
            default: f => f
        },
        handelTableButtonsEvent: {
            type: Function,
            default: f => f
        },
        handelSortChange: {
            type: Function,
            default: f => f
        },
        defaultSort: {
            type: Object
        },
        showDetail: {
            type: Boolean,
            default: true
        }
    }
})
export default class CommonTable extends Vue {
    currentPage = this.defaultCurrentPage || 1;
    pageSize = 10;
    loading = [];
    selectItems = [];
    tempSearchColumn = [];
    handelSearchColumnForShow = [];
    searched = false;
    orderBy = {};
    tableImages = {};
    imageViewerParams = {
        visible: false,
        index: 0,
        page: 0,
        images: []
    };
    expandedRow = {};
    preRow = null;
    showAudio = false;
    songs = [];

    constructor() {
        super();
    }
    created() {
    }
    updated() {
        this.refreshTable();
    }

    destroyed() {
        // 退出取消从雷客更新数据检查定时器
        this.updateFromLeikeTimer && clearInterval(this.updateFromLeikeTimer);
    }

    @Watch('tableAction', { immediate: true, deep: true })
    onTableActionChange() {
        this.handelActionSearchChange();
        this.currentPage = this.defaultCurrentPage || 1;
        this.tableAction && this.refreshData({
            currentPage: this.currentPage
        });
    }

    @Watch("data")
    onDataChange() {
        this.checkLeike();
    }

    render(h) {
        const _defaultSort = this.defaultSort ? {order: this.defaultSort.direction + "ending", prop: this.defaultSort.sort} : {order: "", prop: ""};
        return (
            <div class="table" style="padding: 14px; background-color:white; border-radius: 4px; clear: both;">
                {
                    this.handelSearchColumnForShow && this.handelSearchColumnForShow.map(_data => {
                        let str = '';
                        let {column, label, type, value, options} = _data;
                        switch (type) {
                            case 'input':
                                str = <el-input value={value} placeholder={label} name={column} onChange={v => {
                                    _data.value = v;
                                    this.onChangeTableActionSearch();
                                }} class="table-top-item">
                                    {
                                        _data.value ? <i slot="append" class="el-icon-circle-close" style="cursor: pointer" onClick={v => {
                                            _data.value = '';
                                            this.onChangeTableActionSearch();
                                        }}/> : ""
                                    }
                                </el-input>;
                                break;
                            case 'option':
                                str = <el-select placeholder={label} value={value} name={column} onHandleOptionClick={f => {
                                    _data.value = f.value;
                                    this.handelSearch();
                                }} class="table-top-item">
                                    {
                                        !_.isEmpty(value + "") ? <el-option label="" value="" key="">所有</el-option> : ""
                                    }
                                    {
                                        options.map && options.map(u => (
                                            <el-option label={u.label} value={u.value} key={u.value}/>
                                        ))
                                    }
                                </el-select>;
                                break;
                            case 'daterange':
                                str = <el-date-picker
                                    class="table-top-item"
                                    style="max-width: 300px;"
                                    type="daterange"
                                    picker-options={this.options}
                                    range-separator="-"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    value={_data.value}
                                    onInput={v => {
                                        _data.value = v || [];
                                        this.handelSearch();
                                    }}
                                    align="left">
                                </el-date-picker>;
                                break;
                            default:
                                break;
                        }
                        return str;
                    })
                }
                {
                    (this.tableActionSearch && this.tableActionSearch.length > 0) && <el-button type="primary" icon="search" class="table-top-item" onClick={this.handelSearch}>搜索</el-button>
                }
                {
                    this.tableAction ? <el-table
                        stripe
                        data={this.data.data}
                        v-loading={this.loading.length > 0}
                        filter-multiple={this['filter-multiple']}
                        ref="multipleTable"
                        tooltip-effect="dark"
                        style="width: 100%"
                        default-sort={_defaultSort}
                        onSelection-change={this.onSelectionChange}>
                        {
                            this.showDetail && <el-table-column type="expand">
                                {
                                    this.getDetails(h)
                                }
                            </el-table-column>
                        }

                        {
                            this.select && <el-table-column type="selection" width="55"/>
                        }
                        {
                            this.viewRule && this.viewRule.map((viewRuleItem) => (
                                !viewRuleItem.inDetail ? <el-table-column
                                    key={this.tableAction + viewRuleItem.label}
                                    prop={viewRuleItem.columnKey}
                                    sortable={!!viewRuleItem.sortable}
                                    scope="scope"
                                    label={viewRuleItem.label || viewRuleItem.columnKey}
                                    width={viewRuleItem.width || ''}
                                    min-width={viewRuleItem.minWidth || 100}
                                    fixed={viewRuleItem.fixed || false}
                                    formatter={viewRuleItem.buttons ? (row) => {
                                        return (
                                            viewRuleItem.buttons.map(button => (
                                                (!button.condition || (typeof button.condition === "function" && button.condition(row))) && <el-button
                                                    size="mini"
                                                    type={(button.type === "edit" && "success") || (button.type === "del" && "danger") || (button.type === "auth" && "plain") || "primary"}
                                                    onClick={
                                                        (e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            this.$emit(button.type, row);
                                                            this.handelTableButtonsEvent(button.type, row);
                                                        }
                                                    }>{typeof button.label === "function" ? button.label(row) : button.label}</el-button>
                                            ))
                                        );
                                    } : (viewRuleItem.formatter ? (row) => {
                                        return viewRuleItem.formatter(row, h);
                                    } : (viewRuleItem.imgColumn ? (row) => {
                                        let _img = typeof viewRuleItem.imgColumn === "function" ? viewRuleItem.imgColumn(row) : row[viewRuleItem.imgColumn] || (row.tails && row.tails[viewRuleItem.imgColumn]);
                                        if (viewRuleItem.ossDomain) _img = viewRuleItem.ossDomain + _img;
                                        this.tableImages[_img] = true;
                                        if (_img) return (<img src={_img} style="height: 30px; margin-top: 6px; cursor: pointer;" onClick={e => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            (this.imageViewerParams.images = [{url: _img}]) && (this.imageViewerParams.visible = true);
                                        }}/>);
                                        return '';
                                    } : (viewRuleItem.auditionColumn ? row => {
                                        return <div>
                                            <span style={{lineHeight: "30px"}}>{row[viewRuleItem.auditionColumn]}</span>
                                            <span style={{
                                                position: "relative",
                                                display: "inline-block",
                                                top: "3px",
                                                left: "3px",
                                                width: "20px",
                                                height: "20px",
                                                border: "1px solid #409EFF",
                                                borderRadius: "20px",
                                                cursor: "pointer"
                                            }} onClick={e => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                this.showAudio = true;
                                                this.songs = [{
                                                    url: row.musicUrl,
                                                    songname: row.nameNorm
                                                }];

                                            }}><span style={{
                                                position: "absolute",
                                                display: "inline-block",
                                                top: "50%",
                                                left: "50%",
                                                marginTop: "-6px",
                                                marginLeft: "-3px",
                                                width: 0,
                                                height: 0,
                                                borderTop: '6px solid transparent',
                                                borderLeft: '6px solid #409EFF',
                                                borderBottom: '6px solid transparent',
                                                boxSizing: "border-box"
                                            }} /></span>
                                        </div>;
                                    } : null)))}>
                                </el-table-column> : ""
                            ))
                        }
                    </el-table> : '请制定列表api'
                }
                {
                    this.pagination ? <div style="margin-top: 20px">
                        <el-pagination
                            onSize-change={this.handlePageSizeChange}
                            onCurrent-change={this.handleCurrentPageChange}
                            current-page={this.currentPage}
                            page-sizes={[2, 10, 50, 100, 400]}
                            page-size={this.data.pageSize}
                            layout="total, sizes, prev, pager, next, jumper"
                            total={this.data.totalRow}>
                        </el-pagination>
                    </div> : ''
                }
                <image-viewer images={this.imageViewerParams.images}
                              index={this.imageViewerParams.index}
                              visible={this.imageViewerParams.visible}
                              page={this.imageViewerParams.page}
                              onClose={f => this.imageViewerParams.visible = false}/>

                <el-dialog customClass="audioDialog" title="试听" visible={this.showAudio} onClose={() => this.showAudio = false}>
                    {this.showAudio && <VueSimpleAudio
                        style={{
                            margin: '10px auto',
                            backgroundColor: '#324157',
                            // transform: 'scale(1)',
                            boxShadow: 'none',
                        }}
                        width="250"
                        songs={this.songs}
                        initial-volume="40"
                        loop
                        auto-play
                        repeat />}
                </el-dialog>
            </div>
        );
    }

    getDetails(h) {
        const row = this.preRow;
        if (!row) return "";
        const detailContent = (ruleItem) => {
            const {formatter, imgColumn, auditionColumn, columnKey} = ruleItem;
            if (typeof formatter === "function") return formatter(row, h) || " ";
            if (imgColumn) {
                let _img = typeof imgColumn === "function" ? imgColumn(row) : row[imgColumn] || (row.tails && row.tails[imgColumn]);
                if (ruleItem.ossDomain) _img = ruleItem.ossDomain + _img;
                let showImgs;
                if (_img && _img.map) {
                    showImgs = _img.map(subImg => {
                        return {url: subImg};
                    });
                } else {
                    showImgs = [{url: _img}];
                }
                this.tableImages[_img] = true;
                return (<img src={showImgs[0].url} v-show={showImgs[0].url} style="height: 30px; margin-top: 6px; cursor: pointer;" onClick={f => (this.imageViewerParams.images = showImgs) && (this.imageViewerParams.visible = true)}/>);
            }
            if (auditionColumn) {
                return row[auditionColumn] || " ";
            }
            return row[columnKey] || " ";
        };
        return (
            <form class="el-form el-form--label-left el-form--inline" style="max-width: 1000px;" id={`detail-${Math.random()}`}>
                {
                    (row && this.viewRule) && this.viewRule.map((viewRuleItem) => (
                        !viewRuleItem.buttons ? <div class= "el-form-item" style="margin-right: 0; margin-bottom: 0; width: 50%; display: flex; align-items: center; float: left;">
                            <label class="el-form-item__label" style="min-width: 110px; color: #99a9bf;">{viewRuleItem.label}</label>
                            <div class="el-form-item__content" style="line-height: 18px">
                                    <span style="word-break: break-word">
                                        {
                                            detailContent(viewRuleItem)
                                        }
                                    </span>
                            </div>
                        </div> : ""
                    ))
                }
            </form>
        );
    }

    /**
     * 刷新页面数据
     * @param param
     * @param tableAction
     * @param hideLoading 是否不需要loading显示
     */
    refreshData (param, tableAction, hideLoading) {
        const _tableAction = tableAction || this.tableAction;
        if (!_tableAction) return;
        const randomNum = !hideLoading ? Math.random() : "";
        if (randomNum) this.loading.push(randomNum);
        let _searchColumnData = {};
        console.log(this.tableActionSearchColumn);
        this.tempSearchColumn.concat(this.tableActionSearchColumn).map(_data => {
            if (_data) {
                const _column = Object.keys(_data)[0];
                const _val = _data[_column];
                if (!_.isEmpty(_column) && !_.isEmpty(_val + "")) {
                    _searchColumnData[_column] = _val;
                }
            }
        });
        param = Object.assign({}, this.orderBy, param, _searchColumnData);
        if (this.data.data.length > 0) {
            param["seek"] = this.data.data[this.data.data.length - 1];
        }
        this.searched = !!Object.keys(_searchColumnData).length;
        this.$store.dispatch(_tableAction, param).then((res) => {
            const {currentPage} = res;
            this.currentPage = currentPage;
            this.loading = this.loading.filter(l => l !== randomNum);
            this.$emit('pageChange', currentPage);
            this.handelTablePageChange(currentPage);
        }).catch((err) => {
            this.loading = this.loading.filter(l => l !== randomNum);
        });
    }

    /**
     * 排序、详情展开
     */
    refreshTable() {
        if (this.$refs.multipleTable && !this.$refs.multipleTable.sortChange) {
            this.$refs.multipleTable.$on("sort-change", f => {
                const {order, prop} = f;
                if (prop) {
                    this.orderBy = {sort: prop, direction: order.replace("ending", "")};
                } else {
                    this.orderBy = {};
                }
                let actionOrderBy = {};
                if (order) actionOrderBy[this.tableAction] = {sort: prop, direction: order.replace("ending", "")};
                this.handelSortChange(actionOrderBy);
                this.tableAction && this.refreshData({
                    currentPage: this.currentPage
                });
            });

            this.showDetail && this.$refs.multipleTable.$on("cell-click", row => {
                if (this.preRow === row) {
                    const opened = !!this.$refs.multipleTable.opened;
                    this.$refs.multipleTable.toggleRowExpansion(row, !opened);
                    this.$refs.multipleTable.opened = !opened;
                    return;
                }
                if (this.preRow) {
                    this.$refs.multipleTable.toggleRowExpansion(this.preRow, false);
                    this.$refs.multipleTable.toggleRowExpansion(row, true);
                } else {
                    this.$refs.multipleTable.toggleRowExpansion(row, true);
                }
                this.$refs.multipleTable.opened = true;
                this.preRow = row;
            });
            this.$refs.multipleTable.sortChange = true;
        }
    }

    /**
     * 选择的item修改的时候调用
     * @param selectedItems
     */
    onSelectionChange(selectedItems) {
        this.selectItems = selectedItems;
        this.handleSelectionChange && this.handleSelectionChange(selectedItems);
    }

    /**
     * 表单的action url修改的时候调用
     */
    onChangeTableActionSearch() {
        let hasValue = false;
        this.handelSearchColumnForShow && this.handelSearchColumnForShow.map(_data => {
            const {value} = _data;
            if (value || value === 0) hasValue = true;
        });
        if (!this.searched) return;
        if (!hasValue) {
            this.tableActionSearch && this.tableActionSearch.map(_data => {
                _data.value = _data.defaultValue;
            });
            this.handelSearchColumnForShow && this.handelSearchColumnForShow.map(_data => {
                _data.value = _data.defaultValue;
            });
            this.tempSearchColumn = [];
            this.tableAction && this.refreshData({
                currentPage: this.currentPage
            });
            this.searched = false;
        }
    }

    /**
     * 点击搜索
     */
    handelSearch() {
        this.handelSearchColumnForShowChange();
        this.refreshData({
            currentPage: this.currentPage
        });
    }

    /**
     * 显示的查询条件值修改的时候调用
     */
    handelSearchColumnForShowChange() {
        this.tempSearchColumn = [];
        this.handelSearchColumnForShow && this.handelSearchColumnForShow.map(_data => {
            this.tableActionSearch && this.tableActionSearch.map(__data => {
                const {column, value} = _data;
                const column1 = __data.column;
                if (column === column1) __data.value = value;
                if (column.indexOf(",") > 0) {
                    const columns = column.split(",");
                    columns.map((c, i) => {
                        let _item = {};
                        _item[c] = value[i];
                        this.tempSearchColumn.push(_item);
                    });
                } else {
                    let _item = {};
                    _item[column] = value;
                    this.tempSearchColumn.push(_item);
                }
            });
        });
    }

    /**
     * 当前页码改变的时候调用
     * @param page
     */
    handleCurrentPageChange(page) {
        if (this.currentPage !== page) {
            this.refreshData({
                currentPage: page
            });
        } else {
            this.currentPage = page;
        }
    }

    /**
     * 处理每页size修改时候调用
     * @param size
     */
    handlePageSizeChange(size) {
        this.currentPage = 1;
        this.refreshData({
            pageSize: size,
            currentPage: 1
        });
    }

    /**
     * 搜索条件改变的时候
     */
    handelActionSearchChange() {
        this.tempSearchColumn = [];
        this.handelSearchColumnForShow = [];
        this.tableActionSearch && this.tableActionSearch.map(_data => {
            const {column, value} = _data;
            let _item = {};
            _item[column] = value;
            this.handelSearchColumnForShow.push(Object.assign({}, _data));
            this.tempSearchColumn.push(_item);
        });
    }

    /**
     * 检查从雷客更新的数据情况
     */
    checkLeike() {
        if (!this.data || !this.data.config) return;
        const {isLeike, confValue} = this.data.config;
        if (confValue === 0 || confValue === Const.STATUS_UPDATE_DATE_FROM_LEIKE_UPDATE_ING) {
            if (!this.updateFromLeikeTimer) this.updateFromLeikeTimer = setInterval(f => {
                if (this.data.config.confValue !== Const.STATUS_UPDATE_DATE_FROM_LEIKE_UPDATE_ING) {
                    this.updateFromLeikeTimer && clearInterval(this.updateFromLeikeTimer);
                    this.updateFromLeikeTimer = 0;
                    this.$message({
                        message: `从雷客更新${this.dataName}数据成功`,
                        type: "success"
                    });
                } else {
                    this.tableAction && this.refreshData({
                        currentPage: this.currentPage
                    }, null, true);
                }
            }, Const.CHECK_LEIKE_BETWEEN_TIME);
        } else if (this.updateFromLeikeTimer) {
            this.$message({
                message: `从雷客更新${this.dataName}数据成功`,
                type: "success"
            });
            clearInterval(this.updateFromLeikeTimer);
            this.updateFromLeikeTimer = 0;
        }
    }


}
