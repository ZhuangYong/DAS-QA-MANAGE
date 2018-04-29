import Const from "../../utils/const";
import Component from "vue-class-component/lib/index";
import Vue from 'vue';
import uploadImg from '../../components/Upload/singleImage.vue';
import apiUrl from "../../api/apiUrl";

import * as Quill from 'quill';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

import {quillEditor} from 'vue-quill-editor';
// import {ImageDrop} from 'quill-image-drop-module';
// import {ImageResize} from 'quill-image-resize-module';
// Quill.register('modules/imageDrop', ImageDrop);
// Quill.register('modules/imageResize', ImageResize);

@Component({
    name: "QuillEditor",
    components: {uploadImg, quillEditor},
    props: {
        defaultContent: {
            type: String,
        },
        handelEditorChange: {
            type: Function,
            default: f => f
        }
    }
})
export default class QuillEditor extends Vue {
    upImgShow = false;
    content = this.defaultContent;
    mounted() {
        this.$refs.contenQuillEditor.quill.getModule('toolbar').addHandler('image', this.imgHandler);
        // this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('video', this.videoHandler)
        console.log("-------------------------");
    }


    render() {
        const uploadImgApi = Const.BASE_API + '/' + apiUrl.API_TYPE_SAVE_QAS_IMG;
        return <div>
            <quill-editor content={this.content} ref="contenQuillEditor" options={this.getEditorOption()} onChange={this.onEditorChange}/>
            <el-dialog
                width="30%"
                title="插入图片"
                visible={this.upImgShow}
                onClose={() => this.upImgShow = false}
            append-to-body>
                <uploadImg ref="upload" actionUrl={uploadImgApi} name="insertPic"
                           uploadSuccess={this.uploadSuccess} autoUpload={true}/>
            </el-dialog>
        </div>;
    }

    uploadSuccess(key) {
        const addRange = this.$refs.contenQuillEditor.quill.getSelection();
        this.$refs.contenQuillEditor.quill.insertEmbed(addRange !== null ? addRange.index : 0, "image", Const.OSS_DOM + key.imageNet, Quill.sources.USER);
        this.$refs.contenQuillEditor.quill.setSelection(addRange.index + 1, 0, Quill.sources.USER);
        this.$refs['upload'].clearFiles();
        this.upImgShow = false;
    }

    imgHandler(state) {
        this.upImgShow = true;
    }

    getContent() {
        return this.$refs.contenQuillEditor._content;
    }

    setContents(content) {
        this.$refs.contenQuillEditor.quill.setContents(content);
    }

    onEditorChange({html}) {
        this.handelEditorChange(html);
        this.content = html;
        console.log("-------------------", html);
    }

    getEditorOption() {
        return {
            modules: {
                toolbar: [
                    [{ 'size': ['small', false, 'large'] }],
                    ['bold', 'italic'],
                    [{'list': 'ordered'}, {'list': 'bullet'}],
                    ['link', 'image']
                ],
                    history: {
                    delay: 1000,
                        maxStack: 50,
                        userOnly: false
                },
            }
        };
    }
}
