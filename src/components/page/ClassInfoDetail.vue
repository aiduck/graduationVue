<template>
    <div class="wrap">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-tag"></i> 班级基本信息/班级详细信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container formCon">
            <div class="form-box">
                
                <el-form ref="form" :model="form" label-width="80px" size="mini">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="班级ID">
                                <el-input v-model="form._class.class_id" :disabled="ischeck"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="班级名称">
                                <el-input v-model="form._class.class_name" :disabled="ischeck"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="课程ID">
                                <el-input v-model="form._class.course_id" :disabled="ischeck" @change="handleCourseChange(form._class.course_id)"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="教师ID">
                                <el-input v-model="form._class.user_id" :disabled="ischeck" @change="handleTeacherChange(form._class.user_id)"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="班级状态">
                                <el-input v-model="form._class.status" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="状态">
                                <el-button type="danger" :disabled="ischeck" @click="handleDelete">{{ form._class.status == '可用' ? '禁用' : '启用'}}</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <hr class="form-hr">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="课程ID">
                                <el-input v-model="form.course.course_id" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="课程名称">
                                <el-input v-model="form.course.course_name" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="学年">
                                <el-input v-model="form.course.year" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="学期">
                                 <el-input v-model="form.course.term" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="学时">
                                <el-input v-model="form.course.hours" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="年级">
                                <el-input v-model="form.course.grade" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="学院">
                                <el-input v-model="form.course.college_id" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="专业">
                                <el-input v-model="form.course.major_id" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="平时成绩">
                                <el-input v-model="form.course.ratio_usual" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="期末成绩">
                                <el-input v-model="form.course.ratio_project" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <hr class="form-hr">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="教师ID">
                                <el-input v-model="form.teacher.user_id" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="教师名称">
                                <el-input v-model="form.teacher.username" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="性别">
                                <el-input v-model="form.teacher.sex" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="职称">
                                <el-input v-model="form.teacher.job_title" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="专业">
                                <el-input v-model="form.teacher.education" disabled></el-input>
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
            form: {
                course: {
                    course_id: '',
                    course_name: '',
                    year: '',
                    term: '',
                    hours: '',
                    grade: '',
                    college_id: '',
                    major_id: '',
                    ratio_usual: '',
                    ratio_project: '',
                },
                _class: {
                    class_id: "",
                    class_name: "",
                    course_id: "",
                    user_id: "",
                    status: "",
                },
                teacher: {
                    user_id:"",
                    username:"",
                    sex:"",
                    job_title:"",
                    education:""
                }
                
            },
            college: [],
            major:[],
            // adclass:[],
            isMajorSelect: true,
            isAdclassSelect: true,
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
        // 修改coures的id
        handleCourseChange(val) {
            let params = {
                course_id: val
            }
            axios
            .post('/api/courseInfo/queryCourseById',params)
            .then(res => {
                if(res.data.code === 200) {
                    let course = res.data.data.course[0] || {};
                    this.form.course = course;
                } else {
                    this.$message({
                        type: 'warning',
                        message: `数据库操作失败错误代码${res.data.code}`
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
        // 修改teacher的id
        handleTeacherChange(val) {
            let params = {
                user_id: val
            }
            axios
            .post('/api/teacherInfo/queryUserById',params)
            .then(res => {
                if(res.data.code === 200) {
                    let user = res.data.data.user[0] || {};
                    this.form.teacher = user;
                }  else {
                    this.$message({
                        type: 'warning',
                        message: `数据库操作失败错误代码${res.data.code}`
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
        // 初始化信息
        initUserInfo() {
            let params = {
                class_id: this.$route.params.classId
            }
            axios
            .post('/api/classInfo/queryById',params)
            .then(res => {
                if(res.data.code === 200) {
                    // console.log(res);
                    let course = res.data.data.course[0] || {};
                    let _class = res.data.data._class[0] || {};
                    let teacher = res.data.data.teacher[0] || {};
                    this.form.course = course;
                    this.form._class = _class;
                    this.form.teacher = teacher;
                }  else {
                    this.$message({
                        type: 'warning',
                        message: `数据库操作失败错误代码${res.data.code}`
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
        // 确认修改
        onSubmit() {
            let params = {
                form: {
                   ...this.form._class
                }
            }
            console.log(params);
            axios
            .post('/api/classInfo/updateClassInfo',params)
            .then(res => {
                if(res.data.code === 200) {
                    this.$message({
                        message: `修改成功`,
                        type: 'success'
                    });
                } else {
                    this.$message({
                        type: 'warning',
                        message: `数据库操作失败错误代码${res.data.code}`
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
            this.$router.push(`/classInfo/${this.$route.params.classId}/isedit`);
        },
        // 修改状态
        handleDelete() {
            let status = this.form._class.status === '可用' ? '不可用' : '可用';
            let classId = this.$route.params.classId;
            let params = {
                status: status,
                class_id: classId
            }
            axios
            .post('/api/classInfo/updateClassStatus', params)
            .then(res => {
                if(res.data.code === 200) {
                    // console.log(res)
                    // 前端修改用户状态
                    this.form._class.status = this.form._class.status === '可用' ? '不可用' : '可用';
                } else {
                    this.$message({
                        type: 'warning',
                        message: `数据库操作失败错误代码${res.data.code}`
                    });
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
.form-hr {
    margin: 20px 0;
}
</style>

