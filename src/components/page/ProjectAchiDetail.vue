<template>
    <div class="wrap">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-file"></i>项目成果/项目成果详细信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container formCon">
            <div class="form-box">
                
                <el-form ref="form" :model="form" label-width="100px" size="mini">
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
                                <el-input v-model="form.delivery.title" :disabled="ischeck"></el-input>
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
                    <div class="form-hr">
                        <span class="form-tip">成果文件</span>
                        <hr>
                    </div>
                    <!-- 项目文件提交  -->
                    <el-upload
                        class="upload-demo"
                        ref="upload"
                        name="uploadFile"
                        action="/api/projectAchi/saveAchifile"
                        multiple
                        :limit="3"
                        :on-exceed="handleExceed"
                        :data="upLoadData"
                        :on-remove="handleRemove" 
                        :file-list="fileList"
                        :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary"  :disabled="ischeck">选取文件</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload"  :disabled="ischeck">上传到服务器</el-button>
                        <div v-if="this.fileList.length > 0" style="display:inline-block; float: right;">
                            <el-button slot="trigger" size="small" type="danger"  @click="deleteAllFile"  :disabled="ischeck">全部删除</el-button>
                            <el-button slot="trigger" size="small" type="primary"  @click="downloadFinishFile"  :disabled="ischeck">下载附件</el-button>
                        </div>
                    </el-upload>
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
                    </el-row >
                    <el-row v-if="!isstudent">
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
                    <el-form-item class="footSubmit" size="medium" v-if="isstudent && ischeck">
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
                delivery: {
                    project_id: '',
                    user_id: '',
                    delivery_id: '',
                    title: '',
                    submit_date: '',
                    submit_time: ''
                },
                project: {
                    project_id: "",
                    project_name: "",
                    project_content: "",
                    target: "",
                    deadline: ""
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
            fileList: [],
        }
    },
    computed: {
        isstudent() {
            return this.$store.state.user.usertype === '学生';
        },
        // 文件上传时额外带上的参数
        upLoadData:function(){
            return {
                delivery_id: this.form.delivery.delivery_id,
                file_submit_time: moment().format('HH:mm:ss'),
                file_submit_date: moment().format('YYYY-MM-DD'),
            };
        }
    },
    mounted() {
        this.ischeck = this.$route.params.isCheck === 'ischeck' ? true :false;
        this.initProjectInfo();
        this.initFileList();
    },
    watch:{
        // 监听路由变化
        $route(newValue, oldValue){
            this.ischeck = this.$route.params.isCheck === 'ischeck' ? true :false;
        },
    },
    methods: {
        // 初始化信息
        initProjectInfo() {
            let params = {
                delivery_id: this.$route.params.deliveryId,
            }
            axios
            .post('/api/projectAchi/queryprojectAchiDetil',params)
            .then(res => {
                if(res.data.code === 200) {
                    this.form.delivery = res.data.data.delivery || [];
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
        initFileList() {
            let params = {
                delivery_id: this.$route.params.deliveryId,
            }
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
        // 确认修改
        onSubmit() {
            let params = {}
            // 只有学生可以修改（成果名称）
            // 只有在截止日期之前可以修改
            if(this.isstudent) { 
                if(util.diffStrTime(moment().format('YYYY-MM-DD'),this.form.project.deadline)) {
                    params = {
                        form: {
                            ...this.form.delivery,
                            submit_date: moment().format('YYYY-MM-DD'),
                            submit_time: moment().format('HH:mm:ss'),
                        },
                    }
                    this.updateReport(params);
                } else {
                    this.$message({
                        type: 'error',
                        message: `已经超过截止日期，不能修改项目信息`
                    });
                }
            } else {
                this.$message({
                    type: 'error',
                    message: `您不能修改项目成果的内容`
                });
            }
        },
        updateReport(params) {
            axios
            .post('/api/projectAchi/updateprojectAchi',params)
            .then(res => {
                if(res.data.code === 200) {
                    this.$message({
                        message: `修改成功`,
                        type: 'success'
                    });
                    this.initProjectInfo();
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
            this.$router.push(`/projectAchiDetail/${this.$route.params.deliveryId}/isedit`);
        },
        // 文件操作
        // 多文件上传超出提示
        handleExceed(files, fileList) {
            this.$message.warning(`The limit is 3, you selected ${files.length} files this time, add up to ${files.length + fileList.length} totally`);
        },
        // 删除接口
        deleteFileAxios(url,params,type) {
            axios
            .post(url,params)
            .then(res => {
                if(res.data.code === 200) {
                    this.$message({
                        message: `删除成功`,
                        type: 'success'
                    });
                    if(type === 'all') {
                        this.fileList = []
                    } else {
                        console.log(params.filename);
                    }
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
        // 删除单个文件操作
        handleRemove(file, fileList) {
            console.log(file, fileList);
            console.log(this.form.delivery.delivery_id);
            let url = '/api/projectAchi/deleteAchifile';
            let params = {
                delivery_id: this.$route.params.deliveryId,
                filename: file.name,
                filepath: file.path
            }
            this.deleteFileAxios(url,params,'only');
        },
        // 删除所有文件
        deleteAllFile() {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let url = '/api/projectAchi/deleteAllAchifile';
                let params = {
                    delivery_id: this.$route.params.deliveryId,
                }
                this.deleteFileAxios(url,params,'all');
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        // 上传文件操作
        submitUpload() {
            console.log('上传文件时，传递而外参数');
            console.log(this.upLoadData);
            if(util.diffStrTime(moment().format('YYYY-MM-DD'),this.form.project.deadline)){
                this.$refs.upload.submit();
            } else {
                this.$message({
                    type: 'error',
                    message: `已经超过截止日期，不能修改项目信息`
                });
            }
        },
        // 文件下载
        downloadFinishFile() {
            console.log('下载材料');
            for (let i = 0; i < this.fileList.length; i++) {
                let iframe = document.createElement("iframe");
                iframe.style.display = "none";

                iframe.src =
                "/api/projectAchi/download?filepath=" +
                this.fileList[i].path +
                "&filename=" +
                this.fileList[i].name;

                iframe.onload = function() {
                    document.body.removeChild(iframe);
                };
                document.body.appendChild(iframe);
            }
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

