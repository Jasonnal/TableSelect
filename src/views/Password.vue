<template>
  <el-card style="width: 50%">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" style="padding-right: 20px">
      <el-form-item label="原始密码" prop="password">
        <el-input show-password v-model="form.password" placeholder="请输入旧密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input show-password v-model="form.newPassword" placeholder="请输入新密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input show-password v-model="form.confirmPassword" placeholder="请确认新密码"></el-input>
      </el-form-item>
      <div style="text-align: center; margin-bottom: 20px">
        <el-button type="primary" @click="update">确 认</el-button>
      </div>
    </el-form>
  </el-card>
</template>

<script>
import CryptoJS from "crypto-js";

export default {
  data() {

    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请确认密码'))
      } else if (value !== this.form.newPassword) {
        callback(new Error('确认密码错误'))
      } else {
        callback()
      }
    }
    return {
      user: JSON.parse(localStorage.getItem('honey-user') || '{}'),
      form: {
        password: "",
        newPassword: "",
        confirmPassword: "",
      },
      rules: {
        password: [
          {required: true, message: '请输入旧密码', trigger: 'blur'},
        ],
        newPassword: [
          {required: true, message: '请输入新密码', trigger: 'blur'},
        ],
        confirmPassword: [
          {validator:validatePassword , required:'true', trigger: 'blur'},
        ],
      }
    };
  },
  methods: {
    encryptPassword(password) {
      return CryptoJS.MD5(password).toString();
    },
    update() {

      this.$refs.formRef.validate((valid) => {
        console.log(valid)
        if (valid) {

          this.user.password = this.form.newPassword
          // 对密码进行MD5加密
          const encryptedPassword = this.encryptPassword(this.user.password);
          const userToLogin = {
            ...this.user,
            password: encryptedPassword
          };
          //TODO:验证通过后推送数据到数据库 狗屎代码其他controller里面也能显示
          this.$request.put('/user/resetpsw', userToLogin).then(res => {
            if (res.code === '200') {
              this.$message.success("修改成功")
              localStorage.removeItem('honey-user')
              this.$router.push('/login')
            } else {
              this.$message.error(res.msg)
            }
          })


        }
      })


    },
  }
};
</script>

<style>
/deep/ .el-form-item__label {
  font-weight: bold;
}
</style>