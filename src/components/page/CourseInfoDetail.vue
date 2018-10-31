<template>
    <div class="wrap">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-read"></i> 课程信息/课程详细信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container formCon">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px" size="mini">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="课程ID">
                                <el-input v-model="form.course_id" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="课程名称">
                                <el-input v-model="form.course_name" :disabled="ischeck"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="学年">
                                <el-input v-model="form.year" :disabled="ischeck"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="学期">
                                 <el-select v-model="form.term" :disabled="ischeck">
                                    <el-option label="第1学期" value="第1学期"></el-option>
                                    <el-option label="第2学期" value="第2学期"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="学时">
                                <el-input v-model="form.hours" :disabled="ischeck"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="年级">
                                <el-input v-model="form.grade" :disabled="ischeck"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="学院">
                                <el-select v-model="form.college_id" 
                                placeholder="请选择学院" 
                                :disabled="ischeck"
                                @change="handleSelectChange(form.college_id,'college')"
                                @clear="handleClear('college')">
                                    <el-option v-for="item in college"
                                        :key = "item.college_id"
                                        :label = "item.college_id"
                                        :value = "item.college_id"
                                        :disabled="item.status==='可用'?false:true">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="专业">
                                <el-select v-model="form.major_id" 
                                placeholder="请选择专业" 
                                :disabled="isMajorSelect || ischeck"
                                @change="handleSelectChange(form.major_id,'major')"
                                @clear="handleClear('major')">
                                    <el-option v-for="item in major"
                                        :key="item.major_id"
                                        :label="item.major_id"
                                        :value="item.major_id"
                                        :disabled="item.status==='可用'?false:true">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="平时成绩">
                                <el-input v-model="form.ratio_usual" :disabled="ischeck"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="期末成绩">
                                <el-input v-model="form.ratio_project" :disabled="ischeck"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="课程状态">
                                <el-input v-model="form.status" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="状态">
                                <el-button type="danger" :disabled="ischeck" @click="handleDelete">{{ form.status == '可用' ? '禁用' : '启用'}}</el-button>
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
        this.initCollege();
    },
    watch:{
        // 监听路由变化
        $route(newValue, oldValue){
            this.ischeck = this.$route.params.isCheck === 'ischeck' ? true :false;
        }
    },
    methods: {
        // mysql中获取数据初始化信息接口
        initCollege() {
            axios
            .get('/api/basicInfo/queryCollege')
            .then(res => {
                if(res.data.code === 200){
                    this.college = res.data.data || [];
                    // console.log(this.college);
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
        initMajor(college) {
            let collegeId = {
                collegeId: college
            };
            axios
            .post('/api/basicInfo/queryMajor',collegeId)
            .then(res => {
                if(res.data.code === 200){
                    this.major = res.data.data;
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
        handleSelectChange(value,type){
            switch (type) {
                case "college":
                    this.initMajor(value);
                    this.isMajorSelect = false;
                    break;
            }
        },
        handleClear(type) {
            if (type == "college") {
                this.isMajorSelect = true;
            }
        },
        // 初始化信息
        initUserInfo() {
            let params = {
                course_id: this.$route.params.courseId
            }
            axios
            .post('/api/courseInfo/queryCourseById',params)
            .then(res => {
                if(res.data.code === 200) {
                    let course = res.data.data.course[0];
                    this.form = course;
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
                   ...this.form
                }
            }
            console.log(params);
            axios
            .post('/api/courseInfo/updateCourseInfo',params)
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
            this.$router.push(`/courseInfo/${this.$route.params.courseId}/isedit`);
        },
        // 修改状态
        handleDelete() {
            let status = this.form.status === '可用' ? '不可用' : '可用';
            let course_id = this.$route.params.courseId;
            let params = {
                status: status,
                course_id: course_id
            }
            axios
            .post('/api/courseInfo/updateCourseStatus', params)
            .then(res => {
                if(res.data.code === 200) {
                    // console.log(res)
                    // 前端修改用户状态
                     this.form.status = this.form.status === '可用' ? '不可用' : '可用';
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

