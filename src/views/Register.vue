<template>
  <div class="register-container">
    <div style="display: flex; background-color: white; width: 50%; border-radius: 5px; overflow: hidden">
      <div style="flex: 1">
        <img src="@/assets/images/register.png" alt="" style="width: 100%">
      </div>
      <div style="flex: 1; display: flex; align-items: center; justify-content: center">
        <el-form :model="user" style="width: 80%" :rules="rules" ref="registerRef">
          <div style="font-size: 20px; font-weight: bold; text-align: center; margin-bottom: 20px">欢迎注册教室管理系统</div>
          <el-form-item prop="username">
            <el-input prefix-icon="el-icon-user" size="medium" placeholder="请输入账号" v-model="user.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input prefix-icon="el-icon-lock" size="medium" show-password placeholder="请输入密码" v-model="user.password"></el-input>
          </el-form-item>
          <el-form-item prop="confirmPass">
            <el-input prefix-icon="el-icon-lock" size="medium" show-password placeholder="请确认密码" v-model="user.confirmPass"></el-input>
          </el-form-item>
          <el-form prop="role">
            <el-radio-group v-model="user.role">
              <el-radio label="学生"></el-radio>
              <el-radio label="教师"></el-radio>
            </el-radio-group>
          </el-form>
          <el-form-item>
            <el-button type="info" style="width: 100%" @click="register">注 册</el-button>
          </el-form-item>
          <div style="display: flex">
            <div style="flex: 1">已经有账号了？请 <span style="color: #6e77f2; cursor: pointer" @click="$router.push('/login')">登录</span></div>
          </div>
        </el-form>
      </div>
    </div>

  </div>
</template>

<script>
import CryptoJS from 'crypto-js';

export default {
  name: "Register",
  data() {
    // 验证码校验
    const validatePassword = (rule, confirmPass, callback) => {
      if (confirmPass === '') {
        callback(new Error('请确认密码'));
      } else if (confirmPass !== this.user.password) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    };
    return {
      user: {
        username: '',
        password: '',
        confirmPass: '',
        role: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        role: [
          { required: true, message: '请选择角色', trigger: 'blur' },
        ],
        confirmPass: [
          { validator: validatePassword, trigger: 'blur' }
        ],
      }
    };
  },
  methods: {
    encryptPassword(password) {
      return CryptoJS.MD5(password).toString();
    },
    register() {
      this.$refs['registerRef'].validate((valid) => {
        if (valid) {
          // Encrypt the password before sending
          this.user.password = this.encryptPassword(this.user.password);
          this.user.confirmPass = this.encryptPassword(this.user.confirmPass);

          // 验证通过
          this.$request.post('/register', this.user).then(res => {
            if (res.code === '200') {
              this.$router.push('/login');
              this.$message.success('注册成功');
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    }
  }
}
</script>


<style scoped>
.register-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to right, #65C9FF, #3EACE5, #0085CC, #005C99, #003366); /* 渐变色背景 */
  animation: changeBackground 15s infinite alternate; /* 应用动画 */
}

@keyframes changeBackground {
  0% {
    background: linear-gradient(to right, #65C9FF, #3EACE5, #0085CC, #005C99, #003366);
  }
  25% {
    background: linear-gradient(to right, #3EACE5, #0085CC, #005C99, #003366, #65C9FF);
  }
  50% {
    background: linear-gradient(to right, #0085CC, #005C99, #003366, #65C9FF, #3EACE5);
  }
  75% {
    background: linear-gradient(to right, #005C99, #003366, #65C9FF, #3EACE5, #0085CC);
  }
  100% {
    background: linear-gradient(to right, #003366, #65C9FF, #3EACE5, #0085CC, #005C99);
  }
}
</style>