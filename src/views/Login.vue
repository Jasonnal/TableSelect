<template>
  <div class="login-container">
    <div
        style="
        display: flex;
        background-color: white;
        width: 50%;
        border-radius: 5px;
        overflow: hidden;
      "
    >
      <div style="flex: 1">
        <img src="@/assets/images/image1.png" alt="" style="width: 100%"/>
      </div>
      <div
          style="
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        "
      >
        <el-form :model="user" style="width: 80%" :rules="rules" ref="loginRef">
          <div
              style="
              font-size: 20px;
              font-weight: bold;
              text-align: center;
              margin-bottom: 20px;
            "
          >
            欢迎登录教室管理系统
          </div>
          <el-form-item prop="username">
            <el-input
                prefix-icon="el-icon-user"
                size="medium"
                placeholder="请输入账号"
                v-model="user.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
                prefix-icon="el-icon-lock"
                size="medium"
                show-password
                placeholder="请输入密码"
                v-model="user.password"
            ></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <div style="display: flex">
              <el-input
                  placeholder="请输入验证码"
                  prefix-icon="el-icon-circle-check"
                  size="medium"
                  style="flex: 1"
                  v-model="user.code"
              ></el-input>
              <div style="flex: 1; height: 36px">
                <valid-code @update:value="getCode"/>
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 100%" @click="login"
            >登 录
            </el-button
            >
          </el-form-item>
          <div style="display: flex">
            <div style="flex: 1">
              还没有账号？请
              <span
                  style="color: #0f9876; cursor: pointer"
                  @click="$router.push('/register')"
              >注册</span
              >
            </div>
            <div style="flex: 1; text-align: right">
              <span style="color: #0f9876; cursor: pointer" @click="handleForgetPass">忘记密码</span>
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <el-dialog title="忘记密码" :visible.sync="forgetPassDialogVis" width="30%">
      <el-form :model="forgetUserForm" label-width="80px" style="padding-right: 20px">
        <el-form-item label="用户名">
          <el-input v-model="forgetUserForm.username" autocomplete="off" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="forgetUserForm.phone" autocomplete="off" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="forgetPassDialogVis = false">取 消</el-button>
        <el-button type="primary" @click="resetPassword">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ValidCode from '@/views/ValidCode'

export default {
  name: "Login",
  components: {
    ValidCode
  },
  data() {
    // 验证码校验
    const validateCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else if (value.toLowerCase() !== this.code) {
        callback(new Error('验证码错误'))
      } else {
        callback()
      }
    }

    return {
      forgetUserForm: {}, //忘记密码表单信息
      forgetPassDialogVis: false,
      code: '',  // 验证码组件传递过来的code
      user: {
        code: '',   // 表单里用户输入的code 验证码
        username: '',
        password: ''
      },
      menuData1: [
        {
          path: "/",
          name: "home",
          label: "首页",
          icon: "s-home",
          url: "Home/Home",
        },
        {
          path: "/roomtype",
          name: "roomtype",
          label: "教室类型管理",
          icon: "video-play",
          url: "RoomType/RoomType",
        },
        {
          path: "/roomdata",
          name: "roomdata",
          label: "教室信息管理",
          icon: "video-play",
          url: "RoomManage/RoomManage",
        },
        {
          path: "/user",
          name: "user",
          label: "用户管理",
          icon: "user",
          url: "UserManage/UserManage",
        },
        // {
        //   path: "/bookmanage",
        //   name: "bookmanage",
        //   label: "教室预约",
        //   icon: "help",
        //   url: "BookManage/BookManage",
        // },
        {
          path: "/examine",
          name: "examine",
          label: "审核管理",
          icon: "success",
          url: "Examine/Examine",
        },
        // {
        //   path: "/apply",
        //   name: "apply",
        //   label: "申请记录",
        //   icon: "circle-plus-outline",
        //   url: "Apply/Apply",
        // },
        {
          path: "/notice",
          name: "notice",
          label: "公告管理",
          icon: "edit",
          url: "Notice/Notice",
        },
        // {
        //   path: "/repairApply",
        //   name: "repairApply",
        //   label: "报修记录",
        //   icon: "circle-plus-outline",
        //   url: "RepairApply/RepairApply",
        // },
        {
          path: "/repairProcess",
          name: "repairProcess",
          label: "报修处理",
          icon: "circle-plus-outline",
          url: "RepairApply/RepairApply",
        },
        {
          path: "/dataCount",
          name: "dataCount",
          label: "数据统计",
          icon: "circle-plus-outline",
          url: "DataCount/DataCount",
        },
        {
          label: "其他",
          icon: "location",
          children: [
            {
              path: "/pageone",
              name: "page1",
              label: "页1",
              icon: "setting",
              url: "Other/PageOne",
            },
            {
              path: "/pagetwo",
              name: "page2",
              label: "页2",
              icon: "setting",
              url: "Other/PageTwo",
            },
          ],
        },
      ],
      menuData2: [
        {
          path: "/",
          name: "home",
          label: "首页",
          icon: "s-home",
          url: "Home/Home",
        },
        {
          path: "/bookmanage",
          name: "bookmanage",
          label: "教室预约",
          icon: "help",
          url: "BookManage/BookManage",
        },
        // {
        //   path: "/query",
        //   name: "query",
        //   label: "教室查询",
        //   icon: "user",
        //   url: "Query/Query",
        // },
        {
          path: "/apply",
          name: "apply",
          label: "申请记录",
          icon: "circle-plus-outline",
          url: "Apply/Apply",
        },
        {
          path: "/repairApply",
          name: "repairApply",
          label: "报修记录",
          icon: "circle-plus-outline",
          url: "RepairApply/RepairApply",
        },
        {
          path: "/news",
          name: "news",
          label: "公告信息",
          icon: "date",
          url: "News/News",
        },
        {
          label: "其他",
          icon: "location",
          children: [
            {
              path: "/pageone",
              name: "page1",
              label: "页1",
              icon: "setting",
              url: "Other/PageOne",
            },
            {
              path: "/pagetwo",
              name: "page2",
              label: "页2",
              icon: "setting",
              url: "Other/PageTwo",
            },
          ],
        },
      ],
      rules: {
        username: [
          {required: true, message: '请输入账号', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
        ],
        code: [
          {validator: validateCode, trigger: 'blur'}
        ],
      }
    }
  },
  created() {

  },
  methods: {

    //初始化表单
    handleForgetPass() {
      this.forgetUserForm = {}
      this.forgetPassDialogVis = true

    },

    resetPassword() {
      this.$request.put("/password", this.forgetUserForm).then(res => {
        if(res.code==="200"){
          this.$message.success("重置成功")
          this.forgetPassDialogVis=false
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getCode(code) {
      this.code = code.toLowerCase()
    },
    login() {
      this.$refs['loginRef'].validate((valid) => {
        if (valid) {
          // 验证通过
          this.$request.post('/login', this.user).then(res => {
            if (res.code === '200') {
              if (res.data.role === "管理员") {
                this.$store.commit('setMenu', this.menuData1)
              } else {
                this.$store.commit('setMenu', this.menuData2)
              }
              //解决点击两下跳转的bug
              // this.$router.push('/home')
              location.reload();
              this.$message.success('登录成功')
              localStorage.setItem("honey-user", JSON.stringify(res.data))  // 存储用户数据
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to right, #FFA500, #FF1493); /* 初始渐变色背景 */
  animation: changeBackground 10s infinite alternate; /* 应用动画 */
}

@keyframes changeBackground {
  0% {
    background: linear-gradient(to right, #FFA500, #FF1493);
  }
  50% {
    background: linear-gradient(to right, #FF1493, #FFA500);
  }
  100% {
    background: linear-gradient(to right, #FFA500, #FF1493);
  }
}
</style>