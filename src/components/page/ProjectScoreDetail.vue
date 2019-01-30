<template>
    <div class="wrap">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-file"></i>项目成绩/项目详细信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container formCon">
            <div class="form-box">
                
                <el-form ref="form" :model="form" label-width="100px" size="mini">
                    <!-- 项目小组成员信息 -->
                    <div class="form-hr">
                        <span class="form-tip">{{this.isstudent ? '项目个人成绩' : '项目小组成员信息'}}</span>
                        <hr>
                    </div>
                     <el-row v-for="(item,index) in form.teamMembers" :key="index">
                        <el-col :span="24">
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="学生ID">
                                        <el-input v-model="item.user_id" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="学生姓名">
                                        <el-input v-model="item.username" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="24">
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="项目ID">
                                         <el-input v-model="item.project_id" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="平时成绩">
                                        <el-input v-model="item.usual_performance" :disabled="isSubmit" @change="handleNum(index,'usual_performance',item.usual_performance)"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="24" style="marginBottom: 20px">
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="期末成绩">
                                        <el-input v-model="item.project_score" :disabled="isSubmit" @change="handleNum(index,'project_score',item.project_score)"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="最终成绩">
                                        <el-input v-model="item.final_score" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-col>
                           
                    </el-row>   
                    <el-row>
                        <el-col :span="12" :offset="12">
                             <el-button
                                style="display:inline-block; float: right;"
                                v-if="!isstudent"
                                :disabled="isSubmit"
                                size="small"
                                type="primary"
                                @click="handleScore()">提交</el-button>
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
                teamMembers:[]
            },
            fileList: [],
            ischeck: false,
        }
    },
    computed: {
        isstudent() {
            return this.$store.state.user.usertype === '学生';
        },
        isSubmit() {
            let date = moment().format('YYYY-MM-DD');
            let proDate = this.form.project.deadline;
            // 是编辑
            if(!this.ischeck) {
                // 没有超过日期
                if(util.diffStrTime(date,proDate)) {
                   return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        }

    },
    mounted() {
        this.ischeck = this.$route.params.isCheck === 'ischeck' ? true :false;
        this.initProjectInfo();
    },
    watch:{

    },
    methods: {
        // 初始化信息
        initProjectInfo() {
            let params = {
                team_id: this.$route.params.teamId,
                user_id: this.$store.state.user.user_id,
                usertype: this.$store.state.user.usertype,
            }
            axios
            .post('/api/projectScore/queryProjectScoreDetail',params)
            .then(res => {
                if(res.data.code === 200) {
                    this.form.course = res.data.data.course || [];
                    this.form.project = res.data.data.project || [];
                    this.form.team = res.data.data.team || [];
                    this.form.delivery = res.data.data.delivery || [];
                    this.form.teamMembers = res.data.data.teamMembers || [];
                    let params = {
                        delivery_id: this.form.delivery.delivery_id,
                    }
                    if(this.form.delivery.delivery_id) {
                        this.initFileList(params);
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
        handleNum(index,temp,value){
            if(parseInt(value) >= 0 && parseInt(value) <= 100) {
                let project_score = this.form.teamMembers[index].project_score;
                let usual_performance = this.form.teamMembers[index].usual_performance;
                let ratio_usual = this.form.course.ratio_usual;
                let ratio_project = this.form.course.ratio_project;
                if(project_score && usual_performance) {
                    this.form.teamMembers[index].final_score = project_score * ratio_project + usual_performance * ratio_usual;
                }
            } else {
                this.$message({
                    message: '输入的数值不正确',
                    type: 'warning'
                });
            }
        },
        handleScore() {
            let params = {
                studentList: this.form.teamMembers
            }
            axios
            .post('/api/projectScore/updateScore',params)
            .then(res => {
                if(res.data.code === 200) {
                    console.log(res);
                    this.$message({
                        type: 'success',
                        message: `修改成功`
                    });
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

