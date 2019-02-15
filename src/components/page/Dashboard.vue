<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-row>
                    <el-col>
                        <el-card shadow="hover" class="mgb20">
                            <div class="user-info"> 
                                <!-- 头像 -->
                                <img :src='userInfo.imgUrl' class="user-avator" alt="点击头像修改个人信息" @click="handleUser">
                                <div class="user-info-cont">
                                    <div>{{userInfo.user_type_name}}</div>
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
                            <div  slot="header" class="clearfix">
                                <span>热门技能</span>
                                <el-button v-if="isadmin" style="float: right; padding: 3px 0" type="text" @click="handleSkill">修改</el-button>
                            </div>
                            <div v-for="(item,index) in skillList" :key='index'>
                                {{item.skill_name}}
                                <el-progress :percentage="item.skill_num" :color='skillColor[index % 4]'></el-progress>
                            </div>
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
                                    <div class="grid-num">{{totalNum.allNum}}</div>
                                    <div>总项目量</div>
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
                                    <div>完成项目量</div>
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

                <el-card shadow="hover" :body-style="{ padding: '0px' }">
                    <div slot="header" class="clearfix" >
                        <span>优秀项目介绍</span>
                        <img class="image" src='/static/img/bg1.jpg'>
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
                <el-form-item label="原密码" :label-width="formLabelWidth">
                    <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="新密码" :label-width="formLabelWidth">
                    <el-input type="password" v-model="passwordOne" autocomplete="off" ></el-input>
                </el-form-item>
                <el-form-item label="重复新密码" :label-width="formLabelWidth">
                    <el-input type="password" v-model="passwordTwo" autocomplete="off"></el-input>
                </el-form-item>

                <el-row v-if="isstudent">
                    <el-form-item label="学院" :label-width="formLabelWidth">
                        <el-select v-model="form.college_id" 
                        placeholder="请选择学院" 
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
                    <el-form-item label="专业" :label-width="formLabelWidth">
                        <el-select v-model="form.major_id" 
                        placeholder="请选择专业" 
                        :disabled="isMajorSelect"
                        @change="handleSelectChange(form.major_id,'major')"
                        @clear="handleClear('major')">
                            <el-option v-for="item in major"
                                :key = "item.major_id"
                                :label = "item.major_id"
                                :value = "item.major_id"
                                :disabled="item.status==='可用'?false:true">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="行政班级" :label-width="formLabelWidth">
                        <el-select v-model="form.aclass_id" 
                        placeholder="请选择行政班级" 
                        :disabled="isAdclassSelect"
                        @change="handleSelectChange(form.aclass_id,'adclass')"
                        @clear="handleClear('adclass')">
                            <el-option v-for="item in adclass"
                                :key = "item.aclass_id"
                                :label = "item.aclass_id"
                                :value = "item.aclass_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-row>

                <el-row v-if="isteacher">
                    <el-form-item label="性别" :label-width="formLabelWidth">
                        <el-radio-group v-model="form.sex">
                            <el-radio :label="1">男</el-radio>
                            <el-radio :label="2">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="职称" :label-width="formLabelWidth">
                        <el-input v-model="form.job_title" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="学历" :label-width="formLabelWidth">
                        <el-input v-model="form.education" autocomplete="off"></el-input>
                    </el-form-item>
                </el-row>

                <el-form-item label="头像" :label-width="formLabelWidth">
                    <el-upload
                        ref="upload"
                        name="uploadFile"
                        class="avatar-uploader"
                        action="/api/projectAchi/saveUserImgfile"
                        :data="upLoadData"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="userInfo.imgUrl" :src="userInfo.imgUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmit">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="热门技能" :visible.sync="dialogSkillVisible">
            <div v-for="(item,index) in skillList" :key='index' :label-width="formLabelWidth">
                <span>{{item.skill_name}}</span>
                <el-slider  v-model="item.skill_num"  show-input></el-slider>
            </div>
            <el-dialog
                width="30%"
                title="内层 Dialog"
                :visible.sync="innerVisible"
                append-to-body>
                 <el-form :model="skillitem">
                    <el-form-item label="技能名称" :label-width="formLabelWidth">
                        <el-input v-model="skillitem.skill_name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="技能占比" :label-width="formLabelWidth">
                        <el-input v-model="skillitem.skill_num" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="innerVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleInnerAdd">确 定</el-button>
                </div>
            </el-dialog>
            <el-button :label-width="formLabelWidth" style="float: right; margin: 30px 0;" @click="handleSkillAdd"  type="success" circle>添加</el-button>
          
            <div slot="footer" class="dialog-footer" style="margin: 60px 0 30px 0;">
                <el-button @click="dialogSkillVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmitSkill">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import axios from '../../utils/axiosHttp.js';
    export default {
        name: 'dashboard',
        data() {
            return {
                // 优秀团队
                projectTeamImgs: [
                    '/static/img/bg1.jpg',
                    '/static/img/bg2.jpg',
                    '/static/img/bg3.jpg'
                ],
                // 个人修改
                form: {
                    username:'',
                    email: '',
                    telno: '',
                    address: '',
                    imgUrl: '',
                    password: '',
                    sex: '',
                    job_title: '',
                    education: '',
                    college_id: '',
                    major_id: '',
                    aclass_id: ''
                },
                college: [],
                major:[],
                adclass:[],
                isMajorSelect: true,
                isAdclassSelect: true,
                dialogFormVisible: false,
                imgBase: 'http://localhost:4000/uploads/userImgDemo/',
                imgUrlAct:'img.jpg-1550195866033.jpg',
                passwordOne: '',
                passwordTwo: '',

                // 项目数据总和
                totalNum: {
                    allNum: '1234',
                    projectNum: '5000',
                    achiNum: '321',
                },
                // 优秀技能
                dialogSkillVisible: false,
                innerVisible: false,
                skillitem: {
                    skill_name: '',
                    skill_num: 0,
                },
                skillList: [],
                skillColor: [ "#42b983","#f1e05a","#f56c6c","8e71c7"],
                // 个人展示
                userInfo: {
                    user_type_name: '',
                    user_id: '',
                    username: '',
                    email: '',
                    telno: '',
                    address: '',
                    imgUrl: ''
                },

                formLabelWidth: '120px',
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
            },
            // 文件上传时额外带上的参数
            upLoadData:function(){
                return {
                    user_id: this.$store.state.user.user_id
                };
            }
        },
        mounted() {
            // 初始化用户信息
            this.initUserInfo();
            // 初始化学院信息
            this.initCollege();
            // 初始化热门技能
            this.initSkill();
            // 初始化项目综合数据
            this.initTotalNum();
        },
        watch: {},
        methods: {
            initTotalNum() {
                axios
                .get('/api/userInfo/queryTotalNum')
                .then(res => {
                    if(res.data.code === 200){
                        console.log(res);
                        this.totalNum.allNum = res.data.data.allNum[0].number;
                        this.totalNum.projectNum = res.data.data.projectNum[0].number;
                        this.totalNum.achiNum = res.data.data.achiNum[0].number;

                    }  else {
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
            // 初始化用户信息
            initUserInfo() {
                let params = {
                    user_id: this.$store.state.user.user_id,
                    usertype: this.$store.state.user.usertype
                }
                axios
                .post('/api/userInfo/queryByIdForTeaStu',params)
                .then(res => {
                    if(res.data.code === 200) {
                        // 个人中心的
                        this.userInfo = {
                            ...res.data.data[0]
                        }
                        Object.keys(this.userInfo).map(key => {
                            if(this.userInfo[key] === null) {
                                this.userInfo[key] = ''
                            }
                        });
                        this.userInfo.imgUrl = this.imgBase + res.data.data[0].imgUrl;
                       
                        // 修改个人信息界面
                        this.form = {
                            ...res.data.data[0]
                        } 
                        Object.keys(this.form).map(key => {
                            if(this.form[key] === null) {
                                this.form[key] = ''
                            }
                        });
                        this.form.sex = this.form.sex === '男' ? 1 :2; 
                        this.form.imgUrl = this.imgBase + res.data.data[0].imgUrl;
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
            // 学院专业学校
            initCollege() {
                axios
                .get('/api/basicInfo/queryCollege')
                .then(res => {
                    if(res.data.code === 200){
                        this.college = res.data.data || [];
                    }  else {
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
            initMajor(college) {
                let collegeId = {
                    collegeId: college
                };
                axios
                .post('/api/basicInfo/queryMajor',collegeId)
                .then(res => {
                    if(res.data.code === 200){
                        this.major = res.data.data || [];
                    }  else {
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
            initAdclass(major) {
                let majorId = {
                    majorId: major
                };
                axios
                .post('/api/basicInfo/queryAdClass',majorId)
                .then(res => {
                    if(res.data.code === 200){
                        this.adclass = res.data.data || [];
                    }  else {
                        this.$message({
                            type: 'warning',
                            message: `数据库操作失败错误代码${res.data.code}`
                        });
                    }
                })
                .catch(err => {
                    console.log(err)
                    this.$message({
                        message: `链接发生错误`,
                        type: 'error'
                    });
                })
            },
            handleSelectChange(value,type) {
                switch (type) {
                    case "college":
                        this.initMajor(value);
                        this.isMajorSelect = false;
                        break;
                    case "major":
                        this.initAdclass(value);
                        this.isAdclassSelect = false;
                        break;
                    break;
                }
            },
            handleClear(type) {
                if (type == "college") {
                    this.isMajorSelect = true;
                } else if (type == "major") {
                    this.isAdclassSelect = true;
                }
            },

            // 初始化skill
            initSkill() {
                axios
                .get('/api/userInfo/querySkill')
                .then(res => {
                    if(res.data.code === 200) {               
                        this.skillList = res.data.data;
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
            handleSkill() {
                console.log('打开外层dialog')
                this.dialogSkillVisible = true;
            },
            handleSkillAdd() {
                console.log('打开内层dialog')
                this.skillitem = {
                    skill_name: '',
                    skill_num: 0,
                }
                this.innerVisible = true;
            },
            handleInnerAdd() {
                this.innerVisible = false;
                let count = this.skillList.length;
                if(this.skillList) {
                    this.skillList.map(item => {
                        if(item.skill_name === this.skillitem.skill_name) {
                            this.$message.error('不可以添加已经存在的信息')
                        } else {
                            count--;
                        }
                    })
                    if(count === 0) {
                        this.skillitem.skill_num = parseFloat(this.skillitem.skill_num)
                        this.skillList.push(this.skillitem);
                    } else {
                        this.skillitem = {
                            skill_name: '',
                            skill_num: 0,
                        }
                    }
                }
            },
            handleSubmitSkill() {
                axios
                .post('/api/userInfo/insertUpdateSkill',this.skillList)
                .then(res => {
                    if(res.data.code === 200) {
                        this.dialogSkillVisible = false;
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

            // 个人信息修改
            handleUser() {
                this.dialogFormVisible = true;            
            },
            handleSubmit() {
                if(this.passwordOne !== this.passwordTwo) {
                    // console.log('两次输入的新密码不一致')
                    this.$message.error('两次输入的新密码不一致,请重新输入');
                } else {
                    // 截取最后的img内容
                    var str = this.form.imgUrl;
                    var index = str.lastIndexOf("\/");  
                    str  = str.substring(index + 1, str.length);
                    this.form.imgUrl = str;
                    if(this.passwordTwo !== '') {
                        this.form.password = this.passwordTwo
                    }

                    if(this.form.sex) {
                        this.form.sex = this.form.sex === 1 ? '男' : '女'
                    }
                    
                    let params = {
                        form: this.form,
                        user_id: this.$store.state.user.user_id,
                        usertype: this.$store.state.user.usertype
                    }
                    axios
                    .post('/api/userInfo/updateByIdForTeaStu',params)
                    .then(res => {
                        if(res.data.code === 200) {
                            // 个人中心的
                            this.dialogFormVisible = false; 
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
            },
            // 上传头像
            handleAvatarSuccess(res, file) {
                this.imgUrlAct = res.data;
                this.userInfo.imgUrl = this.imgBase + this.imgUrlAct;
                this.form.imgUrl = this.imgBase + this.imgUrlAct;
                this.initUserInfo();
            },
            beforeAvatarUpload(file) {

                const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPGOrPNG) {
                    this.$message.error('上传头像图片只能是 JPG 或者 PNG格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPGOrPNG && isLt2M;
            }
        }
    }

</script>


<style scoped>
   
    .image {
        width: 100%;
        margin: 20px 0;
        display: block;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
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
