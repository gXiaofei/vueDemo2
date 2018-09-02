<template>
  <div class="mainLogin">
    <div class="loginTitle">{{ loginTitle }}</div>
    <el-form
      v-show="loginType === 1"
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm">
      <el-form-item
        label="账号"
        prop="name">
        <el-input
          v-model="ruleForm.name"
          placeholder="请输入账号"
          auto-complet="off"
        />
      </el-form-item>
      <el-form-item
        label="密码"
        prop="passwd">
        <el-input
          v-model="ruleForm.passwd"
          placeholder="请输入密码"
          type="password"
          auto-complet="off"
        />
      </el-form-item>
      <el-form-item
        v-if="isSubmitErr"
        label="验证码"
        prop="captcha">
        <el-row>
          <el-col :span="15">
            <el-input
              v-model="ruleForm.captcha"
              placeholder="验证码"
              auto-complet="off"
            />
          </el-col>
          <span
            @click="resetCaptcha"
            v-html="captchaImg"/>
        </el-row>
      </el-form-item>
      <el-form-item style="position: relative">
        <span
          class="forgetThePassword"
          @click="forgetThePassword">忘记密码？</span>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')">登陆</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
      <span
        class="register"
        @click="registerAccount">没有账号? 注册一个</span>
    </el-form>
    <el-form
      v-show="loginType === 2"
      ref="register"
      :model="register"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm">
      <el-form-item
        label="账号"
        prop="name">
        <el-input
          v-model="register.name"
          auto-complet="off"
          @blur="nameBlur('register')"/>
      </el-form-item>
      <el-form-item
        label="密码"
        prop="passwd">
        <el-input
          v-model="register.passwd"
          auto-complet="off"
          type="password"/>
      </el-form-item>
      <el-form-item
        label="确认密码"
        prop="confirmPasswd">
        <el-input
          v-model="register.confirmPasswd"
          auto-complet="off"
          type="password"/>
      </el-form-item>
      <el-form-item
        label="邮箱"
        prop="email">
        <el-input
          v-model="register.email"
          auto-complet="off"/>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('register')">注册</el-button>
        <el-button @click="resetForm('register')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form
      v-show="loginType === 3"
      ref="changePasswordEmail"
      :model="changePasswordEmail"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm">
      <el-form-item
        label="账号"
        prop="name">
        <el-input
          :disabled="sendOutLoading"
          v-model="changePasswordEmail.name"
          auto-complet="off"/>
      </el-form-item>
      <el-form-item
        label="邮箱"
        prop="email">
        <el-input
          :disabled="sendOutLoading"
          v-model="changePasswordEmail.email"
          auto-complet="off"
          style="width: 80%"/>
        <el-button
          :disabled="sendOutLoading"
          @click="handleSendOut('changePasswordEmail')">发送</el-button>
      </el-form-item>
      <el-form-item
        label="邮箱验证码"
        prop="emailCaptcha">
        <el-input
          v-model="changePasswordEmail.emailCaptcha"
          auto-complet="off"/>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('changePasswordEmail')">修改密码</el-button>
        <el-button @click="resetForm('changePasswordEmail')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form
      v-show="loginType === 4"
      ref="changePassword"
      :model="changePassword"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm">
      <el-form-item
        label="新密码"
        prop="newPasswd">
        <el-input
          v-model="changePassword.newPasswd"
          type="password"
          auto-complet="off"/>
      </el-form-item>
      <el-form-item
        label="确认密码"
        prop="confirmPasswd">
        <el-input
          v-model="changePassword.confirmPasswd"
          type="password"
          auto-complet="off"/>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('changePassword')">确定</el-button>
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
            var changePasswords = (rule, value, callback) => {
                if (this.isPasswdSame) {
                    if (this.changePassword.newPasswd !== this.changePassword.confirmPasswd) {
                        callback(new Error('密码与确认密码不一致'));
                    }
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
            var nameOrEmail = (rule, value, callback) => {
                if (this.isNameOrEmail) {
                    callback(new Error('账号或邮箱不正确'));
                }
                callback();
            };
            var emailCaptcha = (rule, value, callback) => {
                if (this.isEmailCaptcha) {
                    callback(new Error('邮箱验证码不正确'));
                }
                callback();
            };
            var notOldPasswd = (rule, value, callback) => {
                if (this.isNotOldPasswd) {
                    callback(new Error('不能与原来密码相同'));
                }
                callback();
            };
            return {
                loginType: 1, // 1 登陆  2 注册  3 发送邮箱 4 修改密码
                isSubmitErr: false, // 登陆是否错误
                usernameStatus: false, // 账号是否被注册
                isCaptchaErr: false, // 验证码是否错误
                isNameOrPasswdErr: false, // 账号或者密码是否错误
                isNameOrEmail: false, // 账户或email是否错误
                isEmailCaptcha: false, // email验证码是否正确
                isPasswdSame: false, // 修改密码两次密码不能一致
                isNotOldPasswd: false, //
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
                        { validator: accountRules, trigger: 'blur' },
                        { validator: nameOrEmail, trigger: 'blur' }
                    ],
                    passwd: [
                        { required: true, message: '密码不能为空', trigger: 'blur' }
                        // { validator: confirmPasswd, trigger: 'blur' }
                    ],
                    newPasswd: [
                        { required: true, message: '密码不能为空', trigger: 'blur' }
                        // { validator: confirmPasswd, trigger: 'blur' }
                    ],
                    confirmPasswd: [
                        { required: true, message: '确认密码不能为空', trigger: 'blur' },
                        { validator: confirmPasswd, trigger: 'blur' },
                        { validator: changePasswords, trigger: 'blur' },
                        { validator: notOldPasswd, trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '邮箱不能为空', trigger: 'blur' },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }

                    ],
                    emailCaptcha: [
                        { required: true, message: '邮箱验证码不能为空', trigger: 'blur' },
                        { validator: emailCaptcha, trigger: 'blur' }
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
                                    this.$Cookie.set('info', {
                                        username: this.ruleForm.name,
                                        password: this.ruleForm.passwd
                                    });
                                    // 登陆成功 跳转首页
                                    this.$router.push({path: '/index'});
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
                                    setTimeout(() => {
                                        this.loginTitle = '登陆界面';
                                        this.loginType = 1;
                                    }, 500);
                                }
                            }, err => {
                                console.log(err);
                            });
                        } else if (formName === 'changePasswordEmail') {
                            this.$axios.post('/login/changeEmailPasswd', {
                                emailCaptcha: this.changePasswordEmail.emailCaptcha
                            }).then(res => {
                                if (res.data.status) {
                                    this.loginType = 4;
                                } else {
                                    this.isEmailCaptcha = true;
                                    this.$refs[formName].validateField('emailCaptcha');
                                    this.isEmailCaptcha = false;
                                }
                                console.log(res.data.status);
                            }, err => {
                                console.log(err);
                            });
                        } else if (formName === 'changePassword') {
                            this.isPasswdSame = true;
                            this.$refs[formName].validateField('confirmPasswd', (valid) => {
                                if (!valid) {
                                    this.$axios.post('/login/changePasswd', {
                                        // username: this.changePasswordEmail.name,
                                        username: 'admin',
                                        password: this.changePassword.newPasswd
                                    }).then(res => {
                                        if (res.data.status) {
                                            this.$message({
                                                message: '修改成功',
                                                type: 'success'
                                            });
                                            setTimeout(() => {
                                                this.loginType = 1;
                                            }, 500);
                                        } else {
                                            this.isNotOldPasswd = true;
                                            this.$refs[formName].validateField('confirmPasswd');
                                            this.isNotOldPasswd = false;
                                        }
                                    }, err => {
                                        console.log(err);
                                    });
                                }
                            });
                            this.isPasswdSame = false;
                        }
                    } else {
                        if (formName === 'ruleForm') {
                            // 登陆一次失败，需要填写验证码
                            this.resetCaptcha();
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
                    if (!valid) {
                        this.$refs[formName].validateField('name', (valid) => {
                            if (!valid) {
                                this.$axios.post('/login/email', {
                                    username: this.changePasswordEmail.name,
                                    email: this.changePasswordEmail.email
                                }).then(res => {
                                    if (!res.data.status) {
                                        this.isNameOrEmail = true;
                                        this.$refs[formName].validateField('name');
                                        this.isNameOrEmail = false;
                                    } else {
                                        this.$message({
                                            message: '发送成功',
                                            type: 'success'
                                        });
                                        this.sendOutLoading = true;
                                    }
                                }, err => {
                                    console.log(err);
                                });
                            }
                        });
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
        // background: url('../../../static/img/bg.jpg') no-repeat;
        // background-size: contain;
        width: 500px;
        margin: 0 auto;
        padding-top: 200px;
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
