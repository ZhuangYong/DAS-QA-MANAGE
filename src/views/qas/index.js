/*
 * Copyright (c) 2018 J-MAKE.COM All Rights Reserved.FileName: thirdMenu.js @author: walljack@163.com @date: 18-3-15 上午11:06 @version: 1.0
 */

import {Component} from "vue-property-decorator";
import BaseView from "../../components/common/BaseView";
import BasePage from "../../components/common/BasePage";
import {State} from "vuex-class";
import JPanel from "../../components/panel/JPanel";
import JSelect from "../../components/select/select";
import {deleteQa, save as saveQa} from "../../api/qas";
import apiUrl from "../../api/apiUrl";
import Const from "../../utils/const";
import uploadImg from '../../components/Upload/singleImage.vue';
import QuillEditor from '../../components/Editor/quillEditor';
import editExamPage from "./commPage/editExamPage";
import examsPage from "./commPage/examsPage";
import _ from "lodash";

@Component({name: "QasView"})
export default class QasView extends BaseView {
    created() {
        this.initialPages([<IndexPage/>, <EditQaPage/>, <ExamsPage/>, <EditExamPage/>]);
    }
}

@Component({name: "IndexPage"})
class IndexPage extends BasePage {
    tableAction = 'qas/RefreshPage';
    viewRule = [
        {columnKey: 'id', label: 'ID', minWidth: 90, inDetail: true},
        {columnKey: 'title', label: '名称', minWidth: 160},
        {columnKey: 'name', label: '发布者', minWidth: 90},
        {columnKey: 'exams', label: '题目数量', minWidth: 90, formatter: r => _.isEmpty(r.exams) ? 0 : r.exams.split(",").length},
        {columnKey: 'introduction', label: '描述', minWidth: 190},
        {columnKey: 'startTime', label: '开始时间', minWidth: 170},
        {columnKey: 'endTime', label: '结束时间', minWidth: 170},
        {columnKey: 'createTime', label: '创建时间', minWidth: 170, inDetail: true},
        {label: '操作', buttons: [{label: '编辑', type: 'edit'}, {label: '题目', type: 'examsPage'}, {label: '删除', type: 'del', condition: r => !r.isLeike}], minWidth: 176}
    ];

    tableActionSearch = [
        // {column: 'name', label: '请输入接口名称', type: 'input', value: ''},
    ];

    delItemFun = deleteQa;

    @State(state => state.qas.qasPage) tableData;

    render(h) {
        return <div>
            {
                this.topButtonHtml(h)
            }
            {
                this.tableHtml(h)
            }
        </div>;
    }

    topButtonHtml(h) {
        return <div class="filter-container table-top-button-container">
            <el-button class="filter-item" onClick={
                () => {
                    this.goPage("EditQaPage");
                }
            } type="primary" icon="edit">添加
            </el-button>
        </div>;
    }

    handelEdit(row) {
        this.goPage("EditQaPage", {formData: row});
    }
    handelExamsPage(row) {
        this.goPage("ExamsPage", {formData: row});
    }
}

@Component({name: "EditQaPage", components: {JPanel, JSelect, uploadImg, QuillEditor}})
class EditQaPage extends BasePage {
    contentEditShow = false;
    defaultFormData = {
        title: '',
        introduction: '',
        startTime: '',
        endTime: '',
        effectTime: [new Date(new Date().getTime() - 3600 * 1000 * 24 * 7), new Date()],
        remark: '',
    };
    validateRule = {
        title: [
            {required: true, message: '请输入标题'}
        ],
        introduction: [
            {required: true, message: '请输入简介'}
        ],
        effectTime: [
            {required: true, message: '请选择时间范围'}
        ],
    };
    pickerOptions = {
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
    };

    editFun = saveQa;

    created() {
        this.formData.effectTime = [this.formData.startTime, this.formData.endTime];
    }

    render(h) {
        const uploadImgApi = Const.BASE_API + '/' + apiUrl.API_TYPE_SAVE_QAS_IMG;
        return (
            <div>
                <div class="filter-container" style="margin: 12px 12px 12px 0; display: table-row;">
                    {
                        this.pageBackFormHtml(h)
                    }
                </div>
                <JPanel title={`${this.formData.id ? "添加" : "新增"}`}>
                    <el-form class="small-space" model={this.formData} rules={this.validateRule} ref="addForm" label-position="right" label-width="180px">
                        <el-form-item label="标题：" prop="title">
                            <el-input value={this.formData.title} name="title"/>
                        </el-form-item>
                        <el-form-item label="略缩图：" prop="remark">
                            <uploadImg ref="upload" defaultImg={this.formData.thumbUrl ? Const.OSS_DOM + this.formData.thumbUrl : ""} actionUrl={uploadImgApi} name="ottPic"
                                       uploadSuccess={d => this.formData.thumbUrl = d.imageNet}
                                       chooseChange={(f, l) => !l.length && (this.formData.thumbUrl = "")}
                                       autoUpload={true}/>
                        </el-form-item>
                        <el-form-item label="详细说明：">
                            <div class="content-dialog">
                                <QuillEditor ref="content" defaultContent={this.formData.content} handelEditorChange={html => this.formData.content = html}/>
                            </div>
                        </el-form-item>
                        <el-form-item label="简介：" prop="introduction">
                            <el-input type="textarea" rows={6} value={this.formData.introduction} name="introduction"/>
                        </el-form-item>
                        <el-form-item label="具体说明：" prop="effectTime">
                            <el-date-picker
                                style="max-width: 300px;"
                                type="daterange"
                                picker-options={this.pickerOptions}
                                range-separator="-"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                value={this.formData.effectTime}
                                onInput={v => {
                                    this.formData.effectTime = v || [];
                                }}
                                align="left">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="备注：" prop="remark">
                            <el-input rows={6} type="textarea" value={this.formData.remark} name="remark"/>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" onClick={() => {
                                this.formData.startTime = this.formData.effectTime[0];
                                this.formData.endTime = this.formData.effectTime[1];
                                this.submitAddOrUpdate(() => {
                                    this.pageBack();
                                });
                            }}>提交</el-button>
                            <el-button onClick={this.pageBack}>取消
                            </el-button>
                        </el-form-item>
                    </el-form>

                    <el-dialog title="编辑内容" visible={this.contentEditShow} onClose={() => this.contentEditShow = false} class="content-dialog">
                        <el-form class="small-space" ref="addForm" label-position="right" label-width="0">
                            <QuillEditor ref="content"/>
                            <hr/>
                            <el-form-item style="margin-top: 1rem; text-align: right;">
                                <el-button type="primary" onClick={() => {
                                    this.formData.content = this.$refs.content.getContent();
                                    this.contentEditShow = false;
                                    console.log(this.$refs.content.getContent());
                                }}>提交
                                </el-button>
                                <el-button onClick={this.pageBack}>取消
                                </el-button>
                            </el-form-item>
                        </el-form>

                    </el-dialog>
                </JPanel>
            </div>
        );
    }

}

@Component({name: "ExamsPage"})
class ExamsPage extends examsPage {

    tableAction = 'qas/exams/in/qas/RefreshPage';

    @State(state => state.qas.examsInQasPage) tableData;

    created() {
        this.qaId = this.formData.id;
        this.tableActionSearchColumn = [{exams: this.formData.exams}];
    }

    topButtonHtml(h) {
        return <div class="filter-container table-top-button-container">
            {
                this.pageBackHtml(h)
            }
            <el-button class="filter-item" onClick={
                () => {
                    this.goPage("EditExamPage", {defaultData: {qaId: this.qaId, exams: this.formData.exams}});
                }
            } type="primary" icon="edit">添加
            </el-button>
        </div>;
    }

    handelEdit(row) {
        this.goPage("EditExamPage", {formData: row, defaultData: {qaId: this.qaId, exams: this.formData.exams}});
    }
}

@Component({name: "EditExamPage"})
class EditExamPage extends editExamPage {

    created() {
        console.log("----------", this.qaId);
    }
    topButtonHtml(h) {
        return <div class="filter-container table-top-button-container">
            {
                this.pageBackFormHtml(h)
            }
        </div>;
    }
}
