import QuillEditor from "../../../components/Editor/quillEditor";
import {Component} from "vue-property-decorator/lib/vue-property-decorator";
import QaItem from "../../../components/Editor/qaItem";
import Const from "../../../utils/const";
import JPanel from "../../../components/panel/JPanel";
import {examsItems, saveExam} from "../../../api/qas";
import apiUrl from "../../../api/apiUrl";
import JSelect from "../../../components/select/select";
import BasePage from "../../../components/common/BasePage";
import uploadImg from '../../../components/Upload/singleImage.vue';
import _ from "lodash";

@Component({name: "EditExamPage", components: {JPanel, JSelect, uploadImg, QuillEditor, QaItem}})
export default class EditExamPage extends BasePage {
    defaultFormData = {
        title: '',
        content: "",
        description: "",
        thumbUrl: "",
        multiSelect: 0,
        items: []
    };
    validateRule = {
        title: [
            {required: true, message: '请输入标题'}
        ],
        address: [
            {required: true, message: '请输入地址'}
        ],
        phone: [
            {required: true, message: '请输入联系电话'}
        ],
    };

    editFun = saveExam;

    created() {
        this.formData.examId && this.getItems(this.formData.examId);
    }
    render() {
        console.log(this.formData.items);
        const uploadImgApi = Const.BASE_API + '/' + apiUrl.API_TYPE_SAVE_QAS_IMG;
        return (
            <JPanel title={`${this.formData.examId ? "修改答题" : "新增答题"}`}>
                <el-form class="small-space" model={this.formData} rules={this.validateRule} ref="addForm" label-position="right" label-width="140px">
                    <el-form-item label="答题略缩图：" prop="remark">
                        <uploadImg ref="upload" defaultImg={this.formData.thumbUrl ? (Const.OSS_DOM + this.formData.thumbUrl) : ""} actionUrl={uploadImgApi} name="ottPic"
                                   uploadSuccess={d => this.formData.thumbUrl = d.imageNet}
                                   chooseChange={(f, l) => !l.length && (this.formData.thumbUrl = "")}
                                   autoUpload={true}/>
                    </el-form-item>
                    <el-form-item label="答题详细说明：">
                        <div class="content-dialog">
                            <QuillEditor ref="content" defaultContent={this.formData.content} handelEditorChange={html => this.formData.content = html}/>
                        </div>
                    </el-form-item>
                    <el-form-item label="标题：" prop="title">
                        <el-input value={this.formData.title} name="title"/>
                    </el-form-item>
                    <el-form-item label="是否多选：" prop="multiSelect">
                        <el-radio-group value={this.formData.multiSelect} name="multiSelect">
                            <el-radio value={1} label={1}>是</el-radio>
                            <el-radio value={0} label={0}>否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="答案：">
                        {
                            (this.formData.items || []).filter(item => item.isChecked === 1).map(i => i.orderNo).join(",") || "未设置"
                        }
                    </el-form-item>
                    <el-form-item label="答案选项：" prop="title">
                        <el-button type="primary" plain onClick={this.addNewItem}>添加
                        </el-button>
                        {
                            this.getItemsHtml()
                        }
                    </el-form-item>
                    <el-form-item label="备注：" prop="description">
                        <el-input rows={6} type="textarea" value={this.formData.remark} name="description"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" onClick={() => {
                            this.submitAddOrUpdate(id => {
                                this.changePrePageData({
                                    exams: this.exams ? this.exams + "," + id : id,
                                });
                                this.pageBack();
                            });
                        }}>提交</el-button>
                        <el-button onClick={this.pageBack}>取消
                        </el-button>
                    </el-form-item>
                </el-form>
            </JPanel>
        );
    }

    getItems(examId) {
        examsItems({id: examId}).then(res => {
            this.formData.items = res;
            this.bubbleSort();
        });
    }

    getItemsHtml() {
        return (this.formData.items || []).map(i => {
            return <QaItem orderNo={i.orderNo} title={i.title} id={i.itemId} isChecked={i.isChecked} handelEdit={({title, orderNo, id, isChecked}) => {
                this.formData.items.map(item => {
                    if (item.itemId === id) {
                        item.title = title;
                        item.orderNo = orderNo;
                        item.isChecked = isChecked;
                        this.bubbleSort();
                    }
                });
            }} handelClose={id => {
                this.formData.items = this.formData.items.filter(item => {
                    if (item.itemId !== id) return item;
                });
                this.bubbleSort();
            }}/>;
        });
    }

    addNewItem() {
        console.log(this.formData.items);
        const no = this.formData.items.length > 25 ? this.formData.items.length : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')[this.formData.items.length];
        this.formData.items.push({title: "此处应替换为标题", orderNo: no, itemId: "temp_" + no, isChecked: 0});
    }

    bubbleSort() {
        const items = _.cloneDeep(this.formData.items);
        const len = items.length;
        for (let i = 0; i < len; i++) {
            for (let j = 0; j < len - 1 - i; j++) {
                if (items[j].orderNo > items[j + 1].orderNo) {
                    const temp = items[j + 1];
                    items[j + 1] = items[j];
                    items[j] = temp;
                }
            }
        }
        this.formData.items = [];
        setImmediate(() => {
            this.formData.items = items;
        }, 500);

    }

    beforeSubmit(data) {
        const formData = _.cloneDeep(data);
        formData.items = formData.items.map(item => {
            delete item.itemId;
            return item;
        });
        formData.qaId = this.qaId;
        return formData;
    }
}
