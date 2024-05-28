<template>
  <div>
    <div class="center-container">
      <el-card style="width: 30%">
        <el-form :model="user" label-width="80px" style="padding-right: 20px">
          <div style="margin: 15px; text-align: center">
            <el-upload
                class="avatar-uploader"
                :action="$baseUrl + '/file/upload'"
                :headers="{ token: user.token }"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
            >
              <img v-if="user.avatar" :src="user.avatar" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="user.username" placeholder="用户名" disabled></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="user.name" placeholder="姓名"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="user.phone" placeholder="电话"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="user.email" placeholder="邮箱"></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input type="textarea" v-model="user.address" placeholder="地址"></el-input>
          </el-form-item>
          <div style="text-align: center; margin-bottom: 20px">
            <el-button type="primary" @click="update">保 存</el-button>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem('honey-user') || '{}'),
    };
  },
  methods: {
    update() {
      // 保存当前的用户信息到数据库
      this.$message.success('保存成功')
      this.$request.put('/user/update', this.user).then(res => {
        if (res.code === '200') {
          // 成功更新


          // 更新浏览器缓存里的用户信息
          localStorage.setItem('honey-user', JSON.stringify(this.user))
          location.reload();
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleAvatarSuccess(response, file, fileList) {
      // 把user的头像属性换成上传的图片的链接
      this.user.avatar = response.data
    },
  }

};
</script>

<style scoped>
/deep/.el-form-item__label {
  font-weight: bold;
}
/deep/.el-upload {
  border-radius: 50%;
}
/deep/.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
}
/deep/.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border-radius: 50%;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
  border-radius: 50%;
}
.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 占据整个视口的高度 */
  margin: 0;
  padding: 0;
  box-sizing: border-box; /* 确保内边距和边框不会增加元素的总宽度和高度 */
}
</style>