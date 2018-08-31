<template>
    <div class="mainLogin">
        <div class="loginTitle">{{loginTitle}}</div>
        <el-form v-show="loginType === 1" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="账号" prop="name">
                <el-input
                    placeholder="请输入账号"
                    v-model="ruleForm.name"
                    auto-complet="off"
                >
                </el-input>
            </el-form-item>
            <el-form-item label="密码" prop="passwd">
                <el-input
                    v-model="ruleForm.passwd"
                    placeholder="请输入密码"
                    type="password"
                    auto-complet="off"
                ></el-input>
            </el-form-item>
            <span class="forgetThePassword" @click="forgetThePassword">忘记密码？</span>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">登陆</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
            <span>没有账号? 注册一个</span>
        </el-form>
        <el-form v-show="loginType === 2" :model="register" :rules="rules" ref="register" label-width="100px" class="demo-ruleForm">
            <el-form-item label="账号" prop="name">
                <el-input auto-complet="off" v-model="register.name"></el-input>
            </el-form-item>
            <el-form-item auto-complet="off" label="密码" prop="passwd">
                <el-input v-model="register.passwd"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input auto-complet="off" v-model="register.email"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('register')">注册</el-button>
                <el-button @click="resetForm('register')">重置</el-button>
            </el-form-item>
        </el-form>
        <el-form v-show="loginType === 3" :model="changePasswordEmail" :rules="rules" ref="changePasswordEmail" label-width="100px" class="demo-ruleForm">
            <el-form-item label="账号" prop="name">
                <el-input auto-complet="off" v-model="changePasswordEmail.name"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input auto-complet="off" :disabled="sendOutLoading" v-model="changePasswordEmail.email" style="width: 80%"></el-input>
                <el-button @click="handleSendOut('changePasswordEmail')" :disabled="sendOutLoading">发送</el-button>
            </el-form-item>
            <el-form-item label="邮箱验证码" prop="emailCaptcha">
                <el-input auto-complet="off" v-model="changePasswordEmail.emailCaptcha"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('changePasswordEmail')">修改密码</el-button>
                <el-button @click="resetForm('changePasswordEmail')">重置</el-button>
            </el-form-item>
        </el-form>
        <el-form v-show="loginType === 4" :model="changePassword" :rules="rules" ref="changePassword" label-width="100px" class="demo-ruleForm">
            <el-form-item label="新密码" prop="newPasswd">
                <el-input auto-complet="off" v-model="changePassword.newPasswd"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPasswd">
                <el-input auto-complet="off" v-model="changePassword.confirmPasswd"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('changePassword')">确定</el-button>
                <el-button @click="resetForm('changePassword')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: 'Login',
        data () {
            return {
                loginType: 1,
                ruleForm: {
                    name: '',
                    passwd: ''
                },
                changePasswordEmail: {
                    name: '',
                    email: '',
                    emailCaptcha: ''
                },
                register: {
                    name: '',
                    passwd: '',
                    email: ''
                },
                changePassword: {
                    newPasswd: '',
                    confirmPasswd: ''
                },
                loginTitle: '登陆界面',
                sendOutLoading: false,
                rules: {
                    name: [
                        { required: true, message: '请输入账号', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    passwd: [
                        { required: true, message: '密码不能为空', trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '邮箱不能为空', trigger: 'blur' },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }

                    ],
                    emailCaptcha: [
                        { required: true, message: '邮箱验证码不能为空', trigger: 'blur' }
                    ]
                }
            };
        },
        created () {

        },
        methods: {
            // 忘记密码
            forgetThePassword () {
                this.loginType = 3;
                this.loginTitle = '修改密码';
            },
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log(this.ruleForm);
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm (formName) {
                this.$refs[formName].resetFields();
                this.sendOutLoading = false;
            },
            handleSendOut (formName) {
                this.$refs[formName].validateField('email', (valid) => {
                    if (!valid) {
                        this.sendOutLoading = true;
                    }
                });
            }
        }
    };
</script>

<style scope lang="less">
    .mainLogin{
        width: 500px;
        margin: 0 auto;
        margin-top: 200px;
        position: relative;
        .loginTitle{
            font-size: 40px;
            margin-bottom: 50px;
        }
        .forgetThePassword{
            position: absolute;
            bottom: 85px;
            right: 0;
            color: #409eff;
            font-size: 12px;
            cursor: pointer;
        }
    }
</style>
