<template>
    <div :class="['el-upload-container', isVideo ? 'video-container' : '' ]">
        <el-upload ref="singleImage" :multiple="false" :show-file-list="true" :headers='headers' :on-error="handelErr"
                   :action="actionUrl" :auto-upload="autoUpload" list-type="picture" :before-upload="beforeUpload"
                   :on-change="handleChange" :on-remove="handelRemove" :on-success="handleImageSuccess">
            <el-button ref="chooseBtn" slot="trigger" size="small" type="primary">选取文件</el-button>
        </el-upload>
        <div class="image-preview" v-show="showDefaultImg && showDefaultImg.length>1 && chooseImg && chooseImg.length === 0" style="position: relative; clear: both">
            <i class="el-icon-close" style="position: absolute;left: -3px;cursor: pointer;" @click="handelCleanImg"></i>
            <div class="image-preview-wrapper">
                <img :src="showDefaultImg">
            </div>
        </div>
    </div>
</template>

<script>
// 预览效果见付费文章
import {getToken} from '../../utils/auth';
import Const from "../../utils/const";
import videoBg from "../../assets/images/common/video_bg.png";

export default {
    name: 'singleImageUpload',
    props: {
        actionUrl: {
            type: String,
            require: true
        },
        defaultImg: {
            type: String,
            default: ""
        },
        singleUp: {
            type: Boolean,
            default: true
        },
        uploadSuccess: {
            type: Function,
            default: f => f
        },
        uploadFail: {
            type: Function,
            default: f => f
        },
        beforeUpload: {
            type: Function,
            default: f => true
        },
        chooseChange: {
            type: Function,
            default: f => f
        },
        name: {
            type: Function | String,
        },
        name2: {
            type: String,
            default: ""
        },
        autoUpload: {
            type: Boolean,
            default: false
        },
        isVideo: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
//            actionUrl: 'http://120.27.250.104:9010/system/upgrade/saveImg',
            headers: {
                token: getToken(),
            },
            imageUrl: "",
            chooseImg: [],
            sucData: null,
            success: null,
            fail: null,
            showDefaultImg: this.defaultImg
        };
    },
    methods: {
        handleImageSuccess(res) {
            const {msg, code, data} = res;
            if (code === Const.CODE_SUCCESS) {
                const {imageNet} = data;
                this.imageUrl = imageNet;
                this.sucData = data;
                this.success && this.success(data);
                this.uploadSuccess && this.uploadSuccess(data, this);
            } else if (code === Const.CODE_NEED_LOGIN) {
                location.href = "/login";
            } else {
//                this.$refs.singleImage.clearFiles();
//                this.$refs.chooseBtn.$el.classList.remove("hidden");
//                this.chooseImg = [];
                this.$refs.chooseBtn.$parent.$el.classList.remove("hidden");
                this.$refs.singleImage.clearFiles();
                this.fail && this.fail(msg);
                this.uploadFail && this.uploadFail(msg);
            }
        },
        handleStart({success, fail}) {
            this.success = success;
            this.fail = fail;
            if (this.chooseImg.length === 0) {
                success && success();
            } if (this.sucData) {
                success && success(this.sucData);
            } else {
                this.submit();
            }

        },
        submit() {
            this.$refs.singleImage.submit();
        },
        handelErr(err) {
            this.fail && this.fail(err);
            this.uploadFail && this.uploadFail(err);
        },
        handleChange(file, fileList) {
            if (this.singleUp) {
                if (fileList.length > 0) {
                    this.$refs.chooseBtn.$parent.$el.classList.add("hidden");
                    this.chooseImg = fileList;
                }
                if (fileList.length > 1) {
                    fileList.shift();
                }
            }
            if (fileList.length === 0) this.showDefaultImg = "";
            this.chooseChange && this.chooseChange(file, fileList, this);
        },
        handelRemove(file, fileList) {
            if (this.singleUp && fileList.length === 0) {
                this.$refs.chooseBtn.$parent.$el.classList.remove("hidden");
                this.chooseImg = [];
                this.sucData = null;
            }
            this.chooseChange && this.chooseChange(file, fileList, this);
        },
        handelCleanImg() {
            this.handleChange(null, []);
        },
        clearFiles() {
            this.$refs.chooseBtn.$parent.$el.classList.remove("hidden");
            this.$refs.singleImage.clearFiles();
        }
    }
};
</script>

<style>
    .el-upload-container{
        line-height: 7px;
    }
    .el-upload-container .hidden,.el-upload-container .el-upload-list__item-status-label{
        display: none!important;
    }
    .el-upload-container .el-upload-list__item.is-ready,.el-upload-container .el-upload-list__item.is-success{
        border: none;
        margin: 0;
    }
    .el-upload-container .el-icon-close{
        background: red;
        border-radius: 50%;
        padding: 6px;
        z-index: 3;
        left: 1px;
        right: auto!important;
        top: 1px!important;
        color: white!important;
    }
    .el-icon-document:before{
        content: ""!important;
    }
    .el-upload-container .image-preview-wrapper, .el-upload-list__item-thumbnail{
        height: 100px;
        width: 100px;
    }
    .video-container .el-upload-list__item-thumbnail,.video-container .image-preview-wrapper{
        background: url(../../assets/images/common/video_bg.png) no-repeat center;
        background-size: cover;
    }
    .el-upload-container .image-preview-wrapper img{
        max-width: 100%;
        max-height: 100%;
        margin-top: 7px;
    }
</style>
