<template>
    <div class="wrap">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-file"></i> 项目组/项目组详细信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container formCon">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="100px" size="mini">
                    <div class="form-hr">
                        <span class="form-tip">学生信息</span>
                        <hr>
                    </div>
                    <el-row v-for="(item,index) in form.studentList" :key="index">
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
                                    <el-form-item label="学院">
                                         <el-input v-model="item.college_id" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="专业">
                                        <el-input v-model="item.major_id" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="24">
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="班级">
                                        <el-input v-model="item.aclass_id" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="删除成员">
                                        <el-button type="danger" :disabled="ischeck" @click="handleDelete(item)">删除</el-button>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-col>         
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-button class="form-add"  size="medium" type="primary" :disabled="ischeck" @click="handleAdd">添加项目成员</el-button>  
                        </el-col>
                    </el-row>

                    <div class="form-hr">
                        <span class="form-tip">团队信息</span>
                        <hr>
                    </div>
                    <!-- team -->
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="项目组ID">
                                <el-input v-model="form.team.team_id" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="项目组名称">
                                <el-input v-model="form.team.team_name"  :disabled="ischeck"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                         <el-col :span="12">
                            <el-form-item label="课程ID">
                                <el-select
                                    v-model="form.team.course_id"
                                    :disabled="ischeck"
                                    clearable
                                    @change="handleCourseChange(form.team.course_id,'course')"
                                    @clear="handleClear(form.team.course_id,'course')">
                                        <el-option 
                                            v-for="item in course_id"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                            :disabled="item.disabled">
                                        </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="教学班级ID">
                                <!-- 用练级的select下拉框 -->
                                <el-select
                                    v-model="form.team.class_id"
                                    :disabled="isSelectCouserId"
                                    clearable
                                    @change="handleCourseChange(form.team.class_id,'class')"
                                    @clear="handleClear(form.team.class_id,'class')">
                                        <el-option 
                                            v-for="item in class_id"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                            :disabled="item.disabled">
                                        </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="负责人ID">
                                 <el-select
                                    v-model="form.team.user_id"
                                    :disabled="isSelectClassId"
                                    clearable
                                    @change="handleCourseChange(form.team.user_id,'student')"
                                    @clear="handleClear(form.team.user_id,'student')">
                                        <el-option 
                                            v-for="item in user_id"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                            :disabled="item.disabled">
                                        </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="项目ID">
                                <el-select
                                    v-model="form.team.project_id"
                                    :disabled="isSelectCouserId"
                                    clearable
                                    @change="handleCourseChange(form.team.project_id,'project')"
                                    @clear="handleClear(form.team.project_id,'project')">
                                        <el-option 
                                            v-for="item in project_id"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                            :disabled="item.disabled">
                                        </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <div class="form-hr">
                        <span class="form-tip">班级信息</span>
                        <hr>
                    </div>
                    <!-- classes -->
                    <el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="班级ID">
                                    <el-input v-model="form._class.class_id" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="班级名称">
                                    <el-input v-model="form._class.class_name" disabled></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-row>
                    <el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="课程ID">
                                    <el-input v-model="form._class.course_id" disabled ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="教师ID">
                                    <el-input v-model="form._class.user_id" disabled ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="班级状态">
                                <el-input v-model="form._class.status" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <div class="form-hr">
                        <span class="form-tip">项目信息</span>
                        <hr>
                    </div>
                    <el-row>
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
                    </el-row>
                    <el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="项目内容">
                                    <el-input type="textarea" v-model="form.project.project_content" disabled ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="项目目标">
                                    <el-input type="textarea" v-model="form.project.target" disabled ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="课程ID">
                                <el-input v-model="form.project.course_id" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="项目状态">
                                <el-input v-model="form.project.status" disabled></el-input>
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
    name: 'ProjectTeamDetail',
    data() {
        return {
            form: {
                team: {
                    team_id: '',
                    team_name: '',
                    course_id:'',
                    class_id: '',
                    user_id: '',
                    project_id: '',
                },
                _class: {
                    class_id: "",
                    class_name: "",
                    course_id: "",
                    user_id: "",
                    status: "",
                },
                studentList: [],
                project: {
                    project_id:"",
                    project_name:"",
                    project_content:"",
                    target:"",
                    course_id:"",
                    status:"",
                    deadline: ""
                }
                
            },
            course_id:[],
            class_id: [],
            user_id:[],
            project_id:[],
            isSelectCouserId: true,
            isSelectClassId: true,
            ischeck: false,
        }
    },
    mounted() {
        this.ischeck = this.$route.params.isCheck === 'ischeck' ? true :false;
        this.initTeamInfo();
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
                            this.course_id.push({
                                value: item.course_id,
                                label: item.course_id,
                                disabled: item.status === '可用'?false:true
                            })
                        })
                    }
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
        queryStuByClassID(params) {
            axios
            .post("/api/classInfo/queryStuByClassId",params)
            .then(res => {
                if(res.data.code === 200) {
                    this.isSelectClassId = false;
                    res.data.data.studentId.map((item) => {
                        this.user_id.push({
                            value: item.user_id,
                            label: item.user_id,
                        });
                    })
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
        queryProByCourseID(params) {
            axios
            .post("/api/projectInfo/queryProByCourseID",params)
            .then(res => {
                if(res.data.code === 200) {
                       this.isSelectCouserId = false;
                    
                    res.data.data.projectIdList.map((item) => {
                        this.project_id.push({
                            value: item.project_id,
                            label: item.project_id,
                            disabled: item.is_choose === '可选'?false:true
                        });
                    })
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
        queryClassByCourseID(params) {
            axios
            .post("/api/classInfo/queryAllByCourse",params)
            .then(res => {
                if(res.data.code === 200) {
                    this.isSelectCouserId = false;
                    
                    res.data.data.classId.map((item) => {
                        this.class_id.push({
                            value: item.class_id,
                            label: item.class_id,
                            disabled: item.status === '可用'?false:true
                        });
                    })
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
        updateClassInfo(params) {
            axios
            .post('/api/classInfo/queryById',params)
            .then(res => {
                if(res.data.code === 200) {
                    // console.log(res);
                    let _class = res.data.data._class[0] || {};
                    this.form._class = _class;
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
        updateProjectInfo(params) {
            axios
            .post('/api/projectInfo/queryById',params)
            .then(res => {
                if(res.data.code === 200) {
                    // console.log(res);
                    let project = res.data.data.project[0] || {};
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
        // 下拉框修改内容
        handleCourseChange(val,type) {
            console.log(val,type)
            if(type === 'course') {
                this.class_id = [];
                this.project_id = [];
                this.user_id = [];
            }
            if(val && type === 'course') {
                let params = {
                    course_id: val
                };
                this.queryProByCourseID(params);
                this.queryClassByCourseID(params);
            } else if(val && type === 'class') {
                let params = {
                    class_id: val
                };
                this.updateClassInfo(params);
                this.queryStuByClassID(params);
            }
            else if(val && type === 'project') {
                let params = {
                    project_id: val
                };
                this.updateProjectInfo(params);
            }
        },
        handleClear(val) {},
        // 初始化信息
        initTeamInfo() {
            let params = {
                team_id: this.$route.params.teamId
            }
            axios
            .post('/api/projectTeam/queryById',params)
            .then(res => {
                if(res.data.code === 200) {
                    // console.log(res);
                    let team = res.data.data.team[0] || {};
                    let _class = res.data.data._class[0] || {};
                    let project = res.data.data.project[0] || {};
                    let studentList = res.data.data.studentList || [];
                    this.form.team = team;
                    this.form._class = _class;
                    this.form.project = project;
                    this.form.studentList = studentList;
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
        // 确认修改
        onSubmit() {
            let params = {
                form: {
                   ...this.form.team
                }
            }
            console.log(params);
            axios
            .post('/api/projectTeam/updateProjectTeamInfo',params)
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
            this.$router.push(`/projectTeamDetail/${this.$route.params.teamId}/isedit`);   
        },
        // 删除成员
        handleDelete(val) {
            if(val.user_id !== this.form.team.user_id) {
                let params = {
                    team_id: this.$route.params.teamId,
                    user_id: val.user_id
                }
                axios
                .post('/api/projectTeam/deleteTeamMember', params)
                .then(res => {
                    if(res.data.code === 200) {
                        // console.log(res);
                        this.initTeamInfo();
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
            } else {
                this.$message({
                    message: `不可以删除负责人`,
                    type: 'error'
                });
            }
            
        },
        // 添加成员
        handleAdd() {
            this.$prompt('请输入学生ID', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                let params = {
                    team_id: this.$route.params.teamId,
                    user_id: value
                }
                axios
                .post("/api/projectTeam/insertTeamMember",params)
                .then(res => {
                    if(res.data.code === 200) {
                        // console.log(res);
                        this.initTeamInfo();
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
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });       
            });
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
.form-add {
    float: right;
}
.form-tip {
    border-bottom: 4px solid #409EFF;
}
</style>

