<template>
    <div class="wrap">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-profile"></i> 用户基本信息/教师详细信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container formCon">
            <div class="form-box">
                <el-form ref="form" :model="userForm" label-width="80px" size="mini">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="用户名">
                                <el-input v-model="userForm.user_id" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="用户姓名">
                                <el-input v-model="userForm.username" :disabled="ischeck"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="邮箱">
                                <el-input v-model="userForm.email" :disabled="ischeck"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="电话">
                                <el-input v-model="userForm.telno" :disabled="ischeck"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="住址">
                        <el-input v-model="userForm.address" :disabled="ischeck"></el-input>
                    </el-form-item>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="用户状态">
                                <el-input v-model="userForm.status" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="状态">
                                <el-button type="danger" :disabled="ischeck" @click="handleDelete">{{ userForm.status == '可用' ? '禁用用户' : '启用用户'}}</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="用户类型">
                                <el-select v-model="userForm.user_type_name" placeholder="请选择用户状态" disabled>
                                    <el-option label="学生" value="学生"></el-option>
                                    <el-option label="老师" value="老师"></el-option>
                                    <el-option label="管理员" value="管理员"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="密码">
                                <el-button type="danger" :disabled="ischeck" @click="resetPwd">重置密码</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="职称">
                                <el-input v-model="userForm.job_title" :disabled="ischeck"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="学历">
                                <el-input v-model="userForm.education" :disabled="ischeck"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="性别">
                                <el-select v-model="userForm.sex" placeholder="请选择用户性别" :disabled="ischeck">
                                    <el-option label="男" value="男"></el-option>
                                    <el-option label="女" value="女"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item class="footSubmit" size="medium" v-if="!ischeck">
                        <el-button type="primary" @click="onSubmit">确认修改</el-button>
                    </el-form-item>
                    <el-form-item class="footSubmit" size="medium" v-else>
                        <el-button type="primary" @click="leaveFor">前往编辑</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
import axios from '../../utils/axiosHttp.js';
import util from '../../utils/utils.js'
export default {
    name: 'userDetails',
    data() {
        return {
            userForm: {
                user_id: '',
                username: '',
                email: '',
                telno: '',
                address: '',
                user_type_name: '',
                status: '可用',
                sex: '性别',
                job_title: '职称',
                education: '学历'
            },
            ischeck: false,
        }
    },
    mounted() {
        this.ischeck = this.$route.params.isCheck === 'ischeck' ? true :false;
        this.initUserInfo();
    },
    watch:{
        // 监听路由变化
        $route(newValue, oldValue){
            this.ischeck = this.$route.params.isCheck === 'ischeck' ? true :false;
        }
    },
    methods: {
        // 初始化用户信息
        initUserInfo() {
            let params = {
                user_id: this.$route.params.userId
            }
            axios
            .post('/api/teacherInfo/queryUserById',params)
            .then(res => {
                if(res.data.code === 200) {
                    let user = res.data.data.user[0];
                    this.userForm = user;
                }
            })
            .catch(err => {
                this.$message({
                    message: `链接发生错误`,
                    type: 'error'
                });
            })
        },
        // 确认修改
        onSubmit() {
            let {
                username,
                email, 
                telno, 
                address, 
                user_type_name, 
                user_id,
                sex,
                job_title,
                education
            } = this.userForm;
            let params = {
                userForm: {
                    username,
                    email, 
                    telno, 
                    address, 
                    user_type_name, 
                    user_id,
                    sex,
                    job_title,
                    education
                }
            }
            axios
            .post('/api/teacherInfo/updateUserInfo',params)
            .then(res => {
                if(res.data.code === 200) {
                    this.$message({
                        message: `修改成功`,
                        type: 'success'
                    });
                }
            })
            .catch(err => {
                this.$message({
                    message: `链接发生错误`,
                    type: 'error'
                });
            })
        },
        // 去修改界面
        leaveFor() {
            this.$router.push(`/teacherInfo/${this.$route.params.userId}/isedit`);
        },
        // 重置密码
        resetPwd() {
            let params = {
                user_id: this.$route.params.userId
            }
            axios
            .post('/api/userInfo/updatePwc', params)
            .then(res => {
                if(res.data.code === 200) {
                    this.$message({
                        message:'重置密码成功',
                        type: 'success'
                    })
                }
            })
            .catch(err => {
                this.$message({
                    message: `链接发生错误`,
                    type: 'error'
                });
            })
        },
        // 修改状态
        handleDelete() {
            let status = this.userForm.status === '可用' ? '不可用' : '可用';
            let user_id = this.$route.params.userId;
            let params = {
                status: status,
                user_id: user_id
            }
            axios
            .post('/api/userInfo/updateStatus', params)
            .then(res => {
                if(res.data.code === 200) {
                    // 前端修改用户状态
                    this.userForm.status = this.userForm.status === '可用' ? '不可用' : '可用';
                }
            })
            .catch(err => {
                this.$message({
                    message: `链接发生错误`,
                    type: 'error'
                });
            })
        }
    }
}
</script>
<style>
.formCon {
    padding-top: 50px
}
.footSubmit {
    text-align: right;
    margin: 50px 0;
}
</style>

