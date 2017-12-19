import {mapGetters} from "vuex";
import BaseListView from '../../components/common/BaseListView';
import uploadImg from '../../components/Upload/singleImage.vue';
import Const from "../../utils/const";
import apiUrl from "../../api/apiUrl";
import {add as changeChannel} from '../../api/channel';

const imgFormat = (r, h) => {
    if (r.payCodeImgOss) return (<img src={r.payCodeImgOss} style="height: 30px; margin-top: 6px;"/>);
    return '';
};
const defaultFormData = {
    name: '',
    code: '',
    payCodeImg: '',
    payCodeImgOss: '',
    payX: '',
    payY: '',
    payW: '',
    payH: '',
    status: 1,
    remark: ''
};
export default BaseListView.extend({
    name: 'channelIndex',
    components: {
        uploadImg
    },
    data() {
        return {
            viewRule: [
                {columnKey: 'name', label: '机型名称', minWidth: 190},
                {columnKey: 'code', label: '机型值'},
                // {columnKey: 'payCodeImg', label: '支付二维码背景图片', minWidth: 170, formatter: imgFormat},
                // {columnKey: 'payX', label: 'X轴'},
                // {columnKey: 'payY', label: 'Y轴'},
                // {columnKey: 'payW', label: '宽'},
                // {columnKey: 'payH', label: '高'},
                {columnKey: 'status', label: '状态', formatter: r => {
                    if (r.status === 1) return '生效';
                    if (r.status === 2) return '禁用';
                    if (r.status === 3) return '删除';
                }},
                {columnKey: 'remark', label: '描述'},
                {columnKey: 'createTime', label: '创建日期', minWidth: 170},
                {columnKey: 'updateTime', label: '修改日期', minWidth: 190},
                {label: '操作', buttons: [{label: '编辑', type: 'edit'}, {label: '删除', type: 'del'}], minWidth: 120}
            ],
            validateRule: {
                name: [
                    {required: true, message: '请输入机型名称'},
                    {min: 6, max: 16, message: '请输入6-16位字符'}
                ],
                code: [
                    {required: true, message: '请输入机型值'},
                    {min: 1, max: 20, message: '请输入1-20位字符'}
                ],
                payCodeImgOss: [
                    {required: true, message: '请输入图片地址或点击选择图片'}
                ],
                payX: [
                    {required: true, message: '请输入x轴'},
                    {type: 'number', message: '必须为数字值'}
                ],
                payY: [
                    {required: true, message: '请输入y轴'},
                    {type: 'number', message: '必须为数字值'}
                ],
                payW: [
                    {required: true, message: '请输入宽'},
                    {type: 'number', message: '必须为数字值'}
                ],
                payH: [
                    {required: true, message: '请输入高'},
                    {type: 'number', message: '必须为数字值'}
                ]
            },
            listDataGetter: function() {
                return this.channel.channelPage;
            },
            pageAction: 'channel/RefreshPage',
            defaultFormData: defaultFormData, // 默认表单值
            formData: {}, // 表单值
            tableCanSelect: false, // 表单项是否可以选择
            imgChooseFileList: []
        };
    },

    computed: {
        ...mapGetters(['channel'])
    },
    methods: {

        /**
         * 新增、修改、查看页面模板
         * @param h
         * @returns {XML}
         */
        cruHtml: function (h) {
            const uploadImgApi = Const.BASE_API + "/" + apiUrl.API_CHANNEL_SAVE_IMAGE;
            return (
                <el-form v-loading={this.loading} class="small-space" model={this.formData}
                         ref="addForm" rules={this.validateRule} label-position="right" label-width="180px">
                     <el-form-item label="机型名称：" prop="name">
                         <el-input value={this.formData.name} name="name"/>
                     </el-form-item>
                    <el-form-item label="机型值：" prop="code">
                         <el-input value={this.formData.code} placeholder="设置后不能修改" name="code"/>
                     </el-form-item>
                    <el-form-item label="支付二维码背景图片：" prop="payCodeImgOss" ref="uploadItem">
                        {
                            this.imgChooseFileList.length === 0 ? <el-input value={this.formData.payCodeImgOss} name="payCodeImgOss" placeholder="输入图片url地址，以‘http://’开头"/> : <div style="display: none;">
                                <el-input type="hidden" value={this.formData.payCodeImgOss} name="payCodeImgOss"/>
                                <el-input type="hidden" value={this.formData.payCodeImg} name="payCodeImg"/>
                            </div>
                        }
                        <uploadImg ref="upload" defaultImg={this.formData.payCodeImgOss} actionUrl={uploadImgApi} chooseChange={this.chooseChange}/>
                     </el-form-item>
                    <el-form-item label="支付列表显示（x轴）：" prop="payX">
                       <el-input value={this.formData.payX} name="payX" number/>
                    </el-form-item>
                    <el-form-item label="支付列表显示（Y轴）：" prop="payY">
                       <el-input value={this.formData.payY} name="payY" number/>
                    </el-form-item>
                    <el-form-item label="支付列表（宽）：" prop="payW">
                       <el-input value={this.formData.payW} name="payW" number/>
                    </el-form-item>
                    <el-form-item label="支付列表（高）：" prop="payH">
                       <el-input value={this.formData.payH} name="payH" number/>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-radio-group value={this.formData.status} name='status'>
                            <el-radio value={1} label={1}>生效</el-radio>
                            <el-radio value={2} label={2}>禁用</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="备注" prop="remark">
                        <el-input type="textarea" rows={2} value={this.formData.remark} name='remark'/>
                     </el-form-item>

                    <el-form-item>
                        <el-button type="primary" onClick={this.submitAddOrUpdate}>提交</el-button>
                        <el-button onClick={
                            () => {
                                this.status = "list";
                            }
                        }>取消
                        </el-button>
                    </el-form-item>
                </el-form>
            );
        },

        submitAddOrUpdate: function () {
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    this.submitLoading = true;
                    // 上传图片成功后再提交
                    this.$refs.upload.handleStart({
                        success: r => {
                            if (r) {
                                const {imageNet, imgPath} = r;
                                this.formData.payCodeImgOss = imageNet;
                                this.formData.payCodeImg = imgPath;
                            }
                            changeChannel(this.formData).then(res => {
                                this.$message({
                                    message: "操作成功",
                                    type: "success"
                                });
                                this.submitLoading = false;
                                this.status = 'list';
                            }).catch(err => {
                                this.$message.error(`操作失败(${typeof err === 'string' ? err : ''})！`);
                                this.submitLoading = false;
                            });
                        }, fail: err => {
                            this.formData.payCodeImgOss = '';
                            this.formData.payCodeImg = '';
                            this.submitLoading = false;
                            this.$message.error(`操作失败(${typeof err === 'string' ? err : '网络错误或服务器错误'})！`);
                        }
                    });
                } else {
                    return false;
                }
            });
        },

        // 当图片选择修改的时候
        chooseChange: function (file, fileList) {
            if (!this.submitLoading) {
                this.imgChooseFileList = fileList;
                if (fileList.length > 0) {
                    this.$refs.uploadItem.resetField();
                    this.formData.payCodeImgOss = fileList[0].name;
                } else {
                    this.formData.payCodeImgOss = "";
                }
            }
        }
    }
});