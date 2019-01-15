<template>
    <div class="login-wrap">
        <div class="ms-title">后台管理系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <p style="font-size:12px;line-height:30px;color:#999;">Tips : 上下分别是用户名和密码</p>
            </el-form>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    data: function(){
        return {
            ruleForm: {
                username: '',
                password: ''
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        ...mapActions(['Login','GetPermission']),
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let params = {
                        ...this.ruleForm
                    }
                    // 获取登陆信息 （Login是store的接口）
                    this.Login(params).then(() => {
                        this.$notify.success({
                            title: '登录成功',
                            message: '欢迎光临'
                        })
                        this.$router.push('/');
                    }).catch(error => {
                        this.$notify.error({
                            title: '登录失败',
                            message: '用户名或者密码错误'
                        })
                        console.log(error);
                    });
                } else {
                    console.log('错误提交');
                    return false;
                }
            });
        }
    }
}
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:160px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
</style>