<template>
    <div class="wrap">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-file"></i> 项目案例库信息/项目详细信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container formCon">
            <div class="form-box">
                
                <el-form ref="form" :model="form" label-width="80px" size="mini">
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
                                <el-input v-model="form.project.project_name" :disabled="ischeck"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="项目内容">
                                <el-input type="textarea" :maxlength="500" v-model="form.project.project_content" :disabled="ischeck"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="项目目标">
                                <el-input type="textarea"  :maxlength="100" v-model="form.project.target" :disabled="ischeck"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="课程ID">
                                <el-select
                                    v-model="form.project.course_id"
                                    :disabled="ischeck"
                                    clearable
                                    @change="handleCourseChange(form.project.course_id)"
                                    @clear="handleClear(form.project.course_id)">
                                        <el-option 
                                            v-for="item in college_id"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                            :disabled="item.disabled">
                                        </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                         <el-col :span="12">
                            <el-form-item label="是否可选">
                                <el-input  v-model="form.project.is_choose" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="项目状态">
                                <el-input v-model="form.project.status" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="状态">
                                <el-button type="danger" :disabled="ischeck || form.project.is_choose === '不可选'?true:false" @click="handleDelete">{{ form.project.status == '可用' ? '禁用' : '启用'}}</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    
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
    name: 'ProjectInfoDetail',
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
                project: {
                    project_id: "",
                    project_name: "",
                    project_content: "",
                    target: "",
                    course_id: "",
                    status:"",
                    is_choose:""
                },    
            },
            college_id: [],
            ischeck: false,
        }
    },
    mounted() {
        this.ischeck = this.$route.params.isCheck === 'ischeck' ? true :false;
        this.initProjectInfo();
        this.initCourseInfo();
    },
    watch:{
        // 监听路由变化
        $route(newValue, oldValue){
            this.ischeck = this.$route.params.isCheck === 'ischeck' ? true :false;
        }
    },
    methods: {
         // 初始化课程id下拉框
        initCourseInfo() {
            axios
            .get('/api/courseInfo/queryAll')
            .then(res => {
                if(res.data.code === 200) {
                    if(res.data.data.courseList) {
                        res.data.data.courseList.map((item) => {
                            this.college_id.push({
                                value: item.course_id,
                                label: item.course_id,
                                disabled: item.status === '可用'?false:true
                            })
                        })
                    }
                    // this.valueLabelMap.course_id = res.data.data.courseList || []
                } else {
                    this.$message({
                        type: 'warning',
                        message: `数据库操作失败错误代码${res.data.code}`
                    });
                }
            })
            .catch(err => {
                console.log(err);
                this.$message({
                    message: `链接发生错误`,
                    type: 'error'
                });
            })
        },
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
        handleClear(val) {},
        // 初始化信息
        initProjectInfo() {
            let params = {
                project_id: this.$route.params.projectId
            }
            axios
            .post('/api/projectInfo/queryById',params)
            .then(res => {
                if(res.data.code === 200) {
                    // console.log(res);
                    let project = res.data.data.project[0] || {};
                    let course = res.data.data.course[0] || {};
                    this.form.course = course;
                    this.form.project = project;
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
                   ...this.form.project
                }
            }
            axios
            .post('/api/projectInfo/updateProjectInfo',params)
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
            this.$router.push(`/projectDetailInfo/${this.$route.params.project_id}/isedit`);
        },
        // 修改状态
        handleDelete() {
            let status = this.form.project.status === '可用' ? '不可用' : '可用';
            let projectId = this.$route.params.projectId;
            let params = {
                status: status,
                project_id: projectId
            }
            axios
            .post('/api/projectInfo/updateProjectStatus', params)
            .then(res => {
                if(res.data.code === 200) {
                    // console.log(res)
                    // 前端修改用户状态
                    this.form.project.status = this.form.project.status === '可用' ? '不可用' : '可用';
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
.form-tip {
    border-bottom: 4px solid #409EFF;
}
</style>

