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
            <el-form-item v-if="isSubmitErr" label="验证码" prop="captcha">
                <el-row>
                    <el-col :span="15">
                        <el-input
                            v-model="ruleForm.captcha"
                            placeholder="验证码"
                            auto-complet="off"
                        ></el-input>
                    </el-col>
                    <span @click="resetCaptcha" v-html="captchaImg"></span>
                </el-row>
            </el-form-item>
            <el-form-item style="position: relative">
                <span class="forgetThePassword" @click="forgetThePassword">忘记密码？</span>
                <el-button type="primary" @click="submitForm('ruleForm')">登陆</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
            <span class="register" @click="registerAccount">没有账号? 注册一个</span>
        </el-form>
        <el-form v-show="loginType === 2" :model="register" :rules="rules" ref="register" label-width="100px" class="demo-ruleForm">
            <el-form-item label="账号" prop="name">
                <el-input @blur="nameBlur('register')" auto-complet="off" v-model="register.name"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="passwd">
                <el-input auto-complet="off" type="password" v-model="register.passwd"></el-input>
            </el-form-item>
            <el-form-item  label="确认密码" prop="confirmPasswd">
                <el-input auto-complet="off" type="password" v-model="register.confirmPasswd"></el-input>
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
            var confirmPasswd = (rule, value, callback) => {
                if (this.register.passwd !== this.register.confirmPasswd) {
                    callback(new Error('密码与确认密码不一致'));
                }
                callback();
            };
            var captchaRules = (rule, value, callback) => {
                if (this.isCaptchaErr) {
                    callback(new Error('验证码不正确'));
                }
                callback();
            };
            var accountRules = (rule, value, callback) => {
                if (this.usernameStatus) {
                    callback(new Error('账号已被注册'));
                }
                if (this.isNameOrPasswdErr) {
                    callback(new Error('账号或者密码不正确'));
                }
                callback();
            };
            return {
                loginType: 1, // 1 登陆  2 注册  3 发送邮箱 4 修改密码
                isSubmitErr: false, // 登陆是否错误
                usernameStatus: false, // 账号是否被注册
                isCaptchaErr: false, // 验证码是否错误
                isNameOrPasswdErr: false, // 账号或者密码是否错误
                captchaImg: '',
                ruleForm: {
                    name: '',
                    passwd: '',
                    captcha: ''
                },
                changePasswordEmail: {
                    name: '',
                    email: '',
                    emailCaptcha: ''
                },
                register: {
                    name: '',
                    passwd: '',
                    confirmPasswd: '',
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
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
                        { validator: accountRules, trigger: 'blur' }
                    ],
                    passwd: [
                        { required: true, message: '密码不能为空', trigger: 'blur' }
                        // { validator: confirmPasswd, trigger: 'blur' }
                    ],
                    confirmPasswd: [
                        { required: true, message: '确认密码不能为空', trigger: 'blur' },
                        { validator: confirmPasswd, trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '邮箱不能为空', trigger: 'blur' },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }

                    ],
                    emailCaptcha: [
                        { required: true, message: '邮箱验证码不能为空', trigger: 'blur' }
                    ],
                    captcha: [
                        { required: true, message: '验证码不能为空', trigger: 'blur' },
                        { validator: captchaRules, trigger: 'blur' }
                    ]
                }
            };
        },
        created () {

        },
        methods: {
            // 验证账号是否被注册
            nameBlur (formName) {
                this.$refs[formName].validateField('name', (valid) => {
                    if (!valid) {
                        this.$axios.post('/login/getUsername', {
                            username: this.register.name
                        }).then(res => {
                            if (res.data && res.data.message === 0) {
                                this.usernameStatus = true;
                                this.$refs[formName].validateField('name');
                                this.usernameStatus = false;
                            }
                        }, err => {
                            console.log(err);
                        });
                    }
                });
            },
            // 忘记密码
            forgetThePassword () {
                this.loginType = 3;
                this.loginTitle = '修改密码';
            },
            // 注册
            registerAccount () {
                this.loginType = 2;
                this.loginTitle = '注册';
            },
            //
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (formName === 'ruleForm') {
                            this.$axios.post('/login', {
                                username: this.ruleForm.name,
                                password: this.ruleForm.passwd,
                                isSubmitErr: this.isSubmitErr,
                                captcha: this.ruleForm.captcha
                            }).then(res => {
                                if (res.data.status) {
                                    this.isCaptchaErr = false;
                                    this.isNameOrPasswdErr = false;
                                } else {
                                    this.isSubmitErr = true;
                                    this.resetCaptcha();
                                    if (res.data.message === '验证码不正确') {
                                        this.isCaptchaErr = true;
                                        this.$refs[formName].validateField('captcha');
                                        this.isCaptchaErr = false;
                                        return;
                                    }
                                    if (res.data.message === '账户或者密码不正确') {
                                        this.isNameOrPasswdErr = true;
                                        this.$refs[formName].validateField('name');
                                        this.isNameOrPasswdErr = false;
                                    }
                                }
                                console.log(res);
                            }, err => {
                                console.log(err);
                            });
                        } else if (formName === 'register') {
                            this.$axios.post('/login/register', {
                                name: this.register.name,
                                password: this.register.passwd,
                                confirmPasswd: this.register.confirmPasswd,
                                email: this.register.email
                            }).then(res => {
                                if (res.data.message === 1) {
                                    this.$message({
                                        message: '注册成功',
                                        type: 'success'
                                    });
                                    this.loginType = 1;
                                }
                            }, err => {
                                console.log(err);
                            });
                        }
                    } else {
                        if (formName === 'ruleForm') {
                            // 登陆一次失败，需要填写验证码
                            this.$axios.get('/login/captcha').then(res => {
                                this.captchaImg = res.data.img;
                            }, err => {
                                console.log(err);
                            });
                        }
                        return false;
                    }
                });
            },
            // 重置
            resetForm (formName) {
                this.$refs[formName].resetFields();
                this.sendOutLoading = false;
            },
            // 修改密码发送邮箱
            handleSendOut (formName) {
                this.$refs[formName].validateField('email', (valid) => {
                    debugger;
                    if (!valid) {
                        this.sendOutLoading = true;
                    }
                });
            },
            // 刷新验证码
            resetCaptcha () {
                this.$axios.get('/login/captcha').then(res => {
                    this.captchaImg = res.data.img;
                }, err => {
                    console.log(err);
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
            bottom: 25px;
            right: 0;
            color: #409eff;
            font-size: 12px;
            cursor: pointer;
        }
        .register{
            position: absolute;
            bottom: -20px;
            left: 20px;
            color: #409eff;
            font-size: 12px;
            cursor: pointer;
        }
    }
</style>
