<template>
    <el-menu class="navbar" mode="horizontal" background-color="#fdfdfd">
        <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
        <levelbar></levelbar>
        <error-log v-if="log.length>0" class="errLog-container" :logsList="log"></error-log>

        <!--<span @click="logout" style="float: right; cursor: pointer; margin: 0 1rem;">注销</span>-->
        <el-dropdown class="avatar-container" trigger="click">
            <div class="avatar-wrapper" style="cursor: auto">
                <img class="user-avatar" :src="auth.avatar ? auth.avatar+'?imageView2/1/w/80/h/80' : defaultAvatar">
                <span class="user-name">{{auth.name}}</span>
                <span @click="logout" style="display: block;margin-left: 16px;color: #c30808;font-weight: bold;cursor: pointer;">注销</span>
            </div>
            <el-dropdown-menu class="user-dropdown" slot="dropdown">
            </el-dropdown-menu>
        </el-dropdown>
        <!--<screenfull class='screenfull'></screenfull>-->
    </el-menu>
</template>

<script>
    import {mapGetters} from 'vuex';
    import Levelbar from './Levelbar';
    import TabsView from './TabsView';
    import Hamburger from 'components/Hamburger';
    import Screenfull from 'components/Screenfull';
    import ErrorLog from 'components/ErrLog';
    import errLogStore from 'store/errLog';
    import defaultImg from '../../assets/images/common/Faces_Users_1.png';

    export default {
        components: {
            Levelbar,
            Hamburger,
            ErrorLog,
            Screenfull,
            TabsView
        },
        data() {
            return {
                log: errLogStore.state.errLog,
                defaultAvatar: defaultImg,
                deviceWidth: false //false隐藏,true显示
            };
        },
        created() {
            const width = window.innerWidth;
            if (width > 700) {
                this.deviceWidth = true;
            } else {
                this.deviceWidth = false;
            }

        },
        mounted() {
            const that = this;
            window.onresize = () => {
                const width = window.innerWidth;
                if (width > 700) {
                    that.deviceWidth = true;
                } else {
                    that.deviceWidth = false;
                }

            };
        },
        computed: {
            ...mapGetters([
                'sidebar',
                'auth'
            ])
        },
        methods: {
            toggleSideBar() {
                this.$store.dispatch('ToggleSideBar');
            },
            logout() {
                this.$store.dispatch('LogOut').then(() => {
                    location.reload();// 为了重新实例化vue-router对象 避免bug
                });
            }
        }
    };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .navbar {
        height: 50px;
        line-height: 50px;
        border-radius: 0px !important;
        .hamburger-container {
            line-height: 58px;
            height: 50px;
            float: left;
            padding: 0 10px;
        }
        .errLog-container {
            display: inline-block;
            position: absolute;
            right: 150px;
        }
        .screenfull {
            float: right;
            margin-right: 22px;
            margin-top: 16px;
            color: red;
        }
        .avatar-container {
            height: 50px;
            display: inline-block;
            float: right;
            margin-right: 22px;
            top: 0px;
            .avatar-wrapper {
                display: inline-flex;
                cursor: pointer;
                margin-top: 5px;
                position: relative;
                .user-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }
                .user-name{
                    margin-left: 12px;
                }
                .el-icon-caret-bottom {
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
</style>
