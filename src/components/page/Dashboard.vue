<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-row>
                    <el-col>
                        <el-card shadow="hover" class="mgb20">
                            <div class="user-info">    
                                <img src="http://localhost:4000/uploads/fileDemo/1.jpg-1548640481348.jpg" class="user-avator" alt="点击头像修改个人信息" @click="handleUser">
                                <div class="user-info-cont">
                                    <div>{{userInfo.usertype}}</div>
                                </div>
                            </div>
                            <el-row>
                                <el-col :span="12" class="user-info-list">
                                    用户：{{userInfo.user_id}}
                                </el-col>
                                <el-col :span="12" class="user-info-list">
                                    用户姓名：{{userInfo.username}}
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12" class="user-info-list">
                                    邮箱：{{userInfo.email}}
                                </el-col>
                                <el-col :span="12" class="user-info-list">
                                    电话：{{userInfo.telno}}
                                </el-col>
                            </el-row>
                             <el-row>
                                <el-col :span="12" class="user-info-list">
                                    地址：{{userInfo.address}}
                                </el-col>
                            </el-row>
                        </el-card>
                        <el-card shadow="hover">
                            <div slot="header" class="clearfix">
                                <span>个人技能</span>
                                <el-button style="float: right; padding: 3px 0" type="text" @click="handleSkill">修改</el-button>
                            </div>
                            {{skillList[0].skill_name}}
                            <el-progress :percentage="skillList[0].skill_num" color="#42b983"></el-progress>
                            {{skillList[1].skill_name}}
                            <el-progress :percentage="skillList[1].skill_num" color="#f1e05a"></el-progress>
                            {{skillList[2].skill_name}}
                            <el-progress :percentage="skillList[2].skill_num"></el-progress>
                            {{skillList[3].skill_name}}
                            <el-progress :percentage="skillList[3].skill_num" color="#f56c6c"></el-progress>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-view grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{totalNum.userNum}}</div>
                                    <div>总用户量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-message grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{totalNum.projectNum}}</div>
                                    <div>总项目量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{totalNum.achiNum}}</div>
                                    <div>项目收藏量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>

                <el-card shadow="hover" :body-style="{ height: '304px'}">
                    <div slot="header" class="clearfix">
                        <span>优秀项目介绍</span>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <el-dialog title="修改个人信息" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="姓名" :label-width="formLabelWidth">
                    <el-input v-model="form.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input v-model="form.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" :label-width="formLabelWidth">
                    <el-input v-model="form.telno" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="地址" :label-width="formLabelWidth">
                    <el-input v-model="form.address" autocomplete="off"></el-input>
                </el-form-item>

                <el-row v-if="isstudent">
                    <el-form-item label="学院" :label-width="formLabelWidth">
                        <el-select v-model="form.student.college_id" placeholder="请选择活动区域">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="学院" :label-width="formLabelWidth">
                        <el-select v-model="form.student.major_id" placeholder="请选择活动区域">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="学院" :label-width="formLabelWidth">
                        <el-select v-model="form.student.aclass_id" placeholder="请选择活动区域">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                </el-row>

                <el-row v-if="isteacher">
                    <el-form-item label="性别" :label-width="formLabelWidth">
                        <el-radio-group v-model="form.teacher.sex">
                            <el-radio :label="1">男</el-radio>
                            <el-radio :label="2">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="职称" :label-width="formLabelWidth">
                        <el-input v-model="form.teacher.job_title" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="学历" :label-width="formLabelWidth">
                        <el-input v-model="form.teacher.education" autocomplete="off"></el-input>
                    </el-form-item>
                </el-row>

                <el-form-item label="地址" :label-width="formLabelWidth">
                    <el-input v-model="form.address" autocomplete="off"></el-input>
                </el-form-item>
                
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'dashboard',
        data() {
            return {
                form: {
                    username:'',
                    email: '',
                    telno: '',
                    address: '',
                    teacher: {
                        sex: '',
                        job_title: '',
                        education: ''
                    },
                    student: {
                        college_id: '',
                        major_id: '',
                        aclass_id: ''
                    },
                },
                dialogFormVisible: false,
                formLabelWidth: '120px',
                totalNum: {
                    userNum: '1234',
                    projectNum: '5000',
                    achiNum: '321',
                },
                skillList: [
                    {
                        skill_name: 'Vue',
                        skill_num: 57.2
                    },
                    {
                        skill_name: 'JavaScript',
                        skill_num: 29.8
                    },
                    {
                        skill_name: 'CSS',
                        skill_num: 11.9
                    },
                    {
                        skill_name: 'HTML',
                        skill_num: 1.1
                    }
                ],
                userInfo: {
                   usertype: '教师',
                   user_id: '10000000',
                   username: '石兴民000',
                   email: '2099@qq.com',
                   telno: '13487850087',
                   address: '浙江省杭州市西湖区'
                }
            }
        },
        computed: {
            isstudent() {
                return this.$store.state.user.usertype === '学生';
            },
            isteacher() {
                return this.$store.state.user.usertype === '教师';
            },
            isadmin() {
                return this.$store.state.user.usertype === '管理员';
            }
        },
        methods: {
            handleUser() {
                console.log('修改个人信息');
                this.dialogFormVisible = true;            
            },
            handleSkill() {
                console.log('修改个人技能')
            },
            handleSubmit() {
                console.log('提交个人信息')
            }
        }
    }

</script>


<style scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 12px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

</style>
