<template>
    <div class="wrap">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-file"></i>项目收藏/项目详细信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container formCon">
            <div class="form-box">
                
                <el-form ref="form" :model="form" label-width="100px" size="mini">
                   
                    <!-- 项目信息 -->
                    <div class="form-hr">
                        <span class="form-tip">项目信息</span>
                        <hr>
                    </div>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="项目ID">
                                <el-input v-model="form.project.project_id" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="项目名称">
                                <el-input v-model="form.project.project_name" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="项目内容">
                                <el-input v-model="form.project.project_content" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="项目目标">
                                <el-input v-model="form.project.target" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="项目截止日期">
                                <el-input v-model="form.project.deadline" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                     <!-- 成果信息 -->
                    <div class="form-hr">
                        <span class="form-tip">成果信息</span>
                        <hr>
                    </div>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="成果ID">
                                <el-input v-model="form.delivery.delivery_id" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="成果名称">
                                <el-input v-model="form.delivery.title" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="提交日期">
                                <el-input v-model="form.delivery.submit_date" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="提交时间">
                                <el-input v-model="form.delivery.submit_time" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="项目ID">
                                <el-input v-model="form.delivery.project_id" disabled></el-input>
                            </el-form-item>
                        </el-col>
                         <el-col :span="12">
                            <el-form-item label="提交者ID">
                                <el-input v-model="form.delivery.user_id" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                     <el-row>
                        <el-col :span="12">
                            <el-form-item label="是否收藏">
                                <el-input v-model="form.delivery.is_collect" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!-- 项目文件提交  -->
                    <div class="form-hr">
                        <span class="form-tip">成果文件</span>
                        <hr>
                    </div>
                    <el-upload
                        disabled
                        class="upload-demo"
                        ref="upload"
                        name="uploadFile"
                        action="/api/projectAchi/saveAchifile"
                        multiple
                        :file-list="fileList"
                        :auto-upload="false">
                    </el-upload>
                     <!-- 课程信息 -->
                     <div class="form-hr">
                        <span class="form-tip">课程信息</span>
                        <hr>
                    </div>
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
                     <el-row>
                        <el-col :span="12">
                            <el-form-item label="课程状态">
                                <el-input v-model="form.course.status" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!-- 项目组信息 -->
                    <div class="form-hr">
                        <span class="form-tip">项目组信息</span>
                        <hr>
                    </div>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="项目组ID">
                                <el-input v-model="form.team.team_id" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="项目组名称">
                                <el-input v-model="form.team.team_name" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="负责人ID">
                                <el-input v-model="form.team.user_id" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="教学班级ID">
                                <el-input v-model="form.team.class_id" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <!-- 教学班级信息 -->
                    <div class="form-hr">
                        <span class="form-tip">教学班级信息</span>
                        <hr>
                    </div>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="教学班级ID">
                                <el-input v-model="form.classes.class_id" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="教学班级名称">
                                <el-input v-model="form.classes.class_name" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="教师ID">
                                <el-input v-model="form.classes.user_id" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <!-- 教师信息 -->
                    <div class="form-hr">
                        <span class="form-tip">项目教师信息</span>
                        <hr>
                    </div>
                    <el-row >
                        <el-col :span="12">
                            <el-form-item label="教师ID">
                                <el-input v-model="form.teacher.user_id" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="教师姓名">
                                <el-input v-model="form.teacher.username" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="教师联系方式">
                                <el-input v-model="form.teacher.telno" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="教师邮箱">
                                <el-input v-model="form.teacher.email" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row >
                        <el-col :span="12">
                            <el-form-item label="教师地址">
                                <el-input v-model="form.teacher.address" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
import axios from '../../utils/axiosHttp.js';
import util from '../../utils/utils.js';
import moment from 'moment';
export default {
    name: 'ProjectInfoDetail',
    data() {
        return {
            form: {
                delivery: {
                    project_id: '',
                    user_id: '',
                    delivery_id: '',
                    title: '',
                    submit_date: '',
                    submit_time: '',
                    is_collect: ''
                },
                project: {
                    project_id: "",
                    project_name: "",
                    project_content: "",
                    target: "",
                    deadline: ""
                },  
                course : {
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
                    status: '',
                },
                team: {
                    team_id: "",
                    team_name: "",
                    user_id: "",
                    class_id: "",
                },
                classes: {
                    class_id: "",
                    class_name: "",
                    user_id: "",
                },
                teacher: {
                    address: "",
                    email: "",
                    telno: "",
                    user_id: "",
                    username: "",
                }
            },
            fileList: [],
        }
    },
    computed: {
        isstudent() {
            return this.$store.state.user.usertype === '学生';
        },
    },
    mounted() {
        this.initProjectInfo();
    },
    watch:{},
    methods: {
        // 初始化信息
        initProjectInfo() {
            let params = {
                id: this.$route.params.id,
            }
            axios
            .post('/api/projectAchi/queryCaseById',params)
            .then(res => {
                if(res.data.code === 200) {
                    this.form.course = res.data.data.course || [];
                    this.form.project = res.data.data.project || [];
                    this.form.team = res.data.data.team || [];
                    this.form.classes = res.data.data.classes || [];
                    this.form.teacher = res.data.data.teacher || [];
                    this.form.delivery = res.data.data.delivery || [];
                    
                    let params = {
                        delivery_id: this.form.delivery.delivery_id,
                    }
                    this.initFileList(params);
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
        initFileList(params) { 
            axios
            .post('/api/projectAchi/getAchifileList',params)
            .then(res => {
                if(res.data.code === 200) {
                    this.fileList = [];
                    if(res.data.data.length > 0) {
                        res.data.data.map(item => {
                            this.fileList.push({
                                name: item.filename,
                                path: item.filepath
                            })
                        })
                    }
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
.form-tip {
    border-bottom: 4px solid #409EFF;
}
</style>

