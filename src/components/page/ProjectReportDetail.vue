<template>
    <div class="wrap">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-file"></i> 项目案例库信息/项目详细信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container formCon">
            <div class="form-box">
                
                <el-form ref="form" :model="form" label-width="100px" size="mini">
                    <!-- 日报信息 -->
                    <div class="form-hr">
                        <span class="form-tip">日报信息</span>
                        <hr>
                    </div>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="日报ID">
                                <el-input v-model="form.report.report_id" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="提交者ID">
                                <el-input v-model="form.report.user_id" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="提交日期">
                                <el-input v-model="form.report.report_date" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="提交时间">
                                <el-input v-model="form.report.report_time" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="审核状态">
                                <el-input v-model="form.report.report_status" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="项目ID">
                                <el-input v-model="form.report.project_id" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="工作内容">
                                <el-input type="textarea" :maxlength="500" v-model="form.report.report_work" :disabled="!(checkStudent === 1)"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="工作计划">
                                <el-input type="textarea"  :maxlength="300" v-model="form.report.report_plan" :disabled="!(checkStudent === 1)"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="工作困难">
                                <el-input type="textarea" :maxlength="300" v-model="form.report.report_problem" :disabled="!(checkStudent === 1)"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="日报评语" >
                                <el-input type="textarea" :maxlength="100" v-model="form.report.report_comment" :disabled="!(checkStudent === 2)"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                   
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

                    <!-- 教师/管理员可以查看学生信息 -->
                    <div v-if="!isstudent" class="form-hr">
                        <span class="form-tip">提交者(学生)信息</span>
                        <hr>
                    </div>
                    <el-row v-if="!isstudent">
                        <el-col :span="12">
                            <el-form-item label="学生ID">
                                <el-input v-model="form.student.user_id" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="学生姓名">
                                <el-input v-model="form.student.username" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row v-if="!isstudent">
                      <el-row>
                        <el-col :span="12">
                            <el-form-item label="学生联系方式">
                                <el-input v-model="form.student.telno" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="学生邮箱">
                                <el-input v-model="form.student.email" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="!isstudent">
                        <el-col :span="12">
                            <el-form-item label="学生地址">
                                <el-input v-model="form.student.address" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!-- 学生可以查看教师信息 -->
                    <div v-if="isstudent" class="form-hr">
                        <span class="form-tip">项目教师信息</span>
                        <hr>
                    </div>
                    <el-row v-if="isstudent">
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
                    <el-row v-if="isstudent">
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
                    <el-row v-if="isstudent">
                        <el-col :span="12">
                            <el-form-item label="教师地址">
                                <el-input v-model="form.teacher.address" disabled></el-input>
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
import util from '../../utils/utils.js';
import moment from 'moment';
export default {
    name: 'ProjectInfoDetail',
    data() {
        return {
            form: {
                report: {
                    project_id: '',
                    user_id: '',
                    report_id: '',
                    report_date: '',
                    report_time: '',
                    report_work: '',
                    report_problem: '',
                    report_plan: '',
                    report_status: '',
                    report_comment: '',
                },
                project: {
                    project_id: "",
                    project_name: "",
                    project_content: "",
                    target: ""
                },   
                team: {
                    team_id: "",
                    team_name: "",
                    user_id: "",
                    class_id: ""
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
                },
                student: {
                    address: "",
                    email: "",
                    telno: "",
                    user_id: "",
                    username: "",
                }
            },
            ischeck: false,
        }
    },
    computed: {
        isstudent() {
            return this.$store.state.user.usertype === '学生';
        },
        checkStudent() {
            // 是编辑状态
            if(!this.ischeck) {
                // 并且是学生身份
                if(this.isstudent) {
                    return 1; // 是学生在编辑
                } else {
                    return 2; // 是教师或者管理在编辑
                }
            } else {
                return 0; // 在查看
            }
        }
    },
    mounted() {
        this.ischeck = this.$route.params.isCheck === 'ischeck' ? true :false;
        this.initProjectInfo();
    },
    watch:{
        // 监听路由变化
        $route(newValue, oldValue){
            this.ischeck = this.$route.params.isCheck === 'ischeck' ? true :false;
        }
    },
    methods: {
        // 初始化信息
        initProjectInfo() {
            let params = {
                report_id: this.$route.params.reportId,
            }
            axios
            .post('/api/projectReport/queryReportById',params)
            .then(res => {
                if(res.data.code === 200) {
                    this.form.report = res.data.data.report || [];
                    this.form.project = res.data.data.project || [];
                    this.form.team = res.data.data.team || [];
                    this.form.classes = res.data.data.classes || [];
                    this.form.teacher = res.data.data.teacher || [];
                    this.form.student = res.data.data.student || [];
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
            let params = {}
            // 如果是学生，那么需要提交日期以及时间
            // 如果是教师，并且评语内容不为空，那么修改审核状态
            if(this.isstudent && this.form.report.report_status === '已审核') {
                this.$message({
                    type: 'warning',
                    message: `已经审核过的日报不能修改!`
                });
            } else if(this.isstudent && this.form.report.report_status === '未审核') {
                params = {
                    form: {
                        ...this.form.report,
                        report_date: moment().format('YYYY-MM-DD'),
                        report_time: moment().format('HH:mm:ss'),
                    },
                    usertype: this.$store.state.user.usertype
                }
                this.updateReport(params);
            } else {
                if(this.form.report.report_comment) {
                    this.form.report.report_status = "已审核"
                }
                params = {
                    form: {
                        ...this.form.report,
                    },
                    usertype: this.$store.state.user.usertype
                }
                this.updateReport(params);
            }
           
        },
        updateReport(params) {
            axios
            .post('/api/projectReport/updateReport',params)
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
            this.$router.push(`/projectReportDetail/${this.$route.params.reportId}/isedit`);
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
.form-tip {
    border-bottom: 4px solid #409EFF;
}
</style>

