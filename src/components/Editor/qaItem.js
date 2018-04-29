import Component from "vue-class-component/lib/index";
import Vue from 'vue';

@Component({
    name: "QuillEditor",
    components: {},
    props: {
        id: {
            type: Number | String
        },
        orderNo: {
            type: Number | String
        },
        title: {
            type: String
        },
        isChecked: {
            type: Number,
            default: 0
        },
        editable: {
            type: Boolean,
            default: true
        },
        closeable: {
            type: Boolean,
            default: true
        },
        handelEdit: {
            type: Function,
            default: f => f
        },
        handelClose: {
            type: Function,
            default: f => f
        },
    }
})
export default class QaItem extends Vue {
    contentEditShow = false;
    formData = {
        id: this.id,
        title: this.title,
        orderNo: this.orderNo,
        isChecked: this.isChecked

    };
    validateRule = {
        title: [
            {required: true, message: '请输入标题'}
        ],
        orderNo: [
            {required: true, message: '请输入序号（类似：A、B、C、D 或 1、2、3、4）'}
        ],
    };
    mounted() {
    }

    render() {
        return <div class={`${this.formData.isChecked ? "is-check" : ""}`} id={`item_${this.title}`} style="border: 1px solid #dcdfe6; display: inline-flex; clear: both; align-items: center; float: left; padding: 12px; border-radius: 4px; margin-top: 12px;">
            <p style="line-height: 19px; color: #636363;">
                {this.formData.orderNo}.{this.formData.title}
            </p>
            <p style="display: flex; margin-left: 22px;">
                 {
                     this.editable ? <i class="el-icon-edit edit-button" onClick={() => this.contentEditShow = true}/> : ""
                 }
                 {
                    this.closeable ? <i class="el-icon-close edit-button" onClick={() => this.handelClose(this.formData.id)}/> : ""
                 }
            </p>
            <el-dialog title="编辑答题选项" visible={this.contentEditShow} onClose={() => this.contentEditShow = false} class="content-dialog" style="top: 50%; margin-top: -170px;">
                <el-form class="small-space" model={this.formData} ref="editForm" rules={this.validateRule} label-position="right" label-width="160">
                    <el-form-item label="序号：" prop="orderNo">
                        <el-input value={this.formData.orderNo} onChange={v => this.formData.orderNo = v}/>
                    </el-form-item>
                    <el-form-item label="标题：" prop="title">
                        <el-input value={this.formData.title} onChange={v => this.formData.title = v}/>
                    </el-form-item>
                    <el-form-item label="是否答案：" prop="isChecked">
                        <el-radio-group value={this.formData.isChecked} onInput={v => this.formData.isChecked = v}>
                            <el-radio value={1} label={1}>是</el-radio>
                            <el-radio value={0} label={0}>否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item style="margin-top: 1rem; text-align: right;">
                        <el-button type="primary" onClick={() => {
                            this.$refs.editForm.validate((valid) => {
                                if (valid) {
                                    this.handelEdit({title: this.formData.title, isChecked: this.formData.isChecked, orderNo: this.formData.orderNo, id: this.formData.id});
                                    this.contentEditShow = false;
                                } else {
                                    return false;
                                }
                            });
                        }}>提交
                        </el-button>
                        <el-button onClick={() => this.contentEditShow = false}>取消
                        </el-button>
                    </el-form-item>
                </el-form>

            </el-dialog>
        </div>;
    }


}
