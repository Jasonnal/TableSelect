<template>
  <div>
    <div>
      <el-input style="width: 200px" placeholder="查询教室名" v-model="name"></el-input>
      <el-input style="width: 200px; margin: 0 5px" placeholder="查询教室类型" v-model="type"></el-input>
      <el-button type="primary" @click="load(1)">查询</el-button>
      <el-button type="info" @click="reset">重置</el-button>
    </div>
    <div style="margin: 10px 0">
      <el-button type="primary" plain @click="handleAdd">新增</el-button>
      <el-button type="danger" plain @click="delBatch">批量删除</el-button>
    </div>
    <el-table :data="tableData" stripe :header-cell-style="{ backgroundColor: 'aliceblue', color: '#666' }"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
      <el-table-column prop="name" label="教室名"></el-table-column>
      <el-table-column prop="capacity" label="教室容量"></el-table-column>
      <el-table-column prop="type" label="教室类型"></el-table-column>
      <el-table-column prop="location" label="教室位置"></el-table-column>
      <el-table-column prop="description" label="教室描述"></el-table-column>
      <el-table-column label="是否公开">
        <template v-slot="scope">
          <el-switch v-model="scope.row.open" @change="changeOpen(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="教室图片">
        <template v-slot="scope">
          <div style="display: flex; align-items: center">
            <el-image style="width: 50px; height: 50px; border-radius: 50%" v-if="scope.row.image"
                      :src="scope.row.image" :preview-src-list="[scope.row.image]"></el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template v-slot="scope">
          <el-button size="mini" type="primary" plain @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" plain @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin: 10px 0">
      <el-pagination
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="total">
      </el-pagination>
    </div>
    <el-dialog title="教室信息" :visible.sync="roomVisible" width="30%">
      <el-form :model="form" label-width="80px" style="padding-right: 20px" :rules="rules" ref="formRef">
        <el-form-item label="教室名" prop="name">
          <el-input v-model="form.name" placeholder="教室名"></el-input>
        </el-form-item>
        <el-form-item label="教室容量" prop="capacity">
          <el-input v-model="form.capacity" placeholder="容量"></el-input>
        </el-form-item>
        <el-form-item label="教室类型" prop="type">
          <el-input v-model="form.type" placeholder="类型"></el-input>
        </el-form-item>
        <el-form-item label="教室位置" prop="location">
          <el-input v-model="form.location" placeholder="位置"></el-input>
        </el-form-item>
        <el-form-item label="教室描述" prop="description">
          <el-input type="textarea" v-model="form.description" placeholder="描述"></el-input>
        </el-form-item>
        <el-form-item label="教室图片">
          <el-upload
              class="upload-demo"
              :action="$baseUrl + '/file/upload'"
              :headers="{ token: user.token }"
              :file-list="fileList"
              list-type="picture"
              :on-success="handleImageSuccess"

          >
            <el-button type="primary">上传图片</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roomVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
export default {
  data() {
    return {
      fileList: [], //照片列表
      tableData: [], //表格里的数据
      form: {}, //对话框的form
      pageNum: 1,   // 当前的页码
      pageSize: 5,  // 每页显示的个数
      total: 0,
      roomVisible: false,
      ids: [], //批量删除的id合集
      name: '',
      type: '',
      user: JSON.parse(localStorage.getItem('honey-user') || '{}'),
      rules: {
        name: [
          {required: true, message: '请输入教室名', trigger: 'blur'},
        ]
      },
    };
  },
  created() {
    this.load()
  },
  methods: {
    handleEdit(row) {
      this.fileList = []
      this.form = JSON.parse(JSON.stringify(row))
      this.roomVisible = true
    },
    sendSaveRequest() {
      this.$request({
        url: this.form.id ? '/room/update' : '/room/add',
        method: this.form.id ? 'PUT' : 'POST',
        data: this.form
      }).then(res => {
        if (res.code === '200') {
          this.$message.success("保存成功")
          this.load(1)
          this.roomVisible = false
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    save() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$request({
            url: this.form.id ? '/room/update' : '/room/add',
            method: this.form.id ? 'PUT' : 'POST',
            data: this.form
          }).then(res => {
            if (res.code === '200') {
              this.$message.success("保存成功")
              this.load(1)
              this.roomVisible = false
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    del(id) {
      this.$confirm('您确认删除吗？', '确认删除', {type: "warning"}).then(response => {
        this.$request.delete('/room/delete/' + id).then(res => {
          if (res.code === '200') {   // 表示操作成功
            this.$message.success('操作成功')
            this.load(1)
          } else {
            this.$message.error(res.msg)  // 弹出错误的信息
          }
        })
      }).catch(() => {
      })
    },

    load(pageNum) {
      if (pageNum) this.pageNum = pageNum
      this.$request.get('/room/selectByPage', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          name: this.name,
          type: this.type
        }
      }).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    //开启关闭教室的状态 关闭时取消这个教室未来的预约 开启时可以被用户看到和预约
    changeOpen(form) {
      this.form = JSON.parse(JSON.stringify(form))
      this.sendSaveRequest()
      if(!form.open){
        this.changeClose(form.id)
      }
    },
    changeClose(cid) {
      console.log(cid)
      this.$request.put("/repair/repairProcess/"+ cid).then(res => {
        if (res.code === '200') {
          console.log("更新成功")
        }
      })
    },

    reset() {
      this.name = ''
      this.type = ''
      this.load()
    },
    handleSelectionChange(rows) {
      this.ids = rows.map(v => v.id)
    },
    handleCurrentChange(pageNum) {
      this.load(pageNum)
    },
    handleImageSuccess(response, file, fileList) {
      // 解析上传文件的路径，获取文件名
      const path = response.data;
      const parts = path.split('/');
      const fileName = parts[parts.length - 1];

      // 构建文件对象，包含文件名和完整路径
      const fileObject = {
        name: fileName,
        url: path
      };

      // 将文件对象添加到文件列表中
      this.fileList.push(fileObject);
      this.form.image = response.data
    },
    handleAdd() {
      this.fileList = []
      this.form = {}
      this.roomVisible = true
    },
    delBatch() {
      if (!this.ids.length) {
        this.$message.warning("请选择数据")
        return
      }
      this.$confirm('您确认删除这些数据吗?', '确认删除', {type: "warning"}).then(response => {
        this.$request.delete('/room/delete/batch', {data: this.ids}).then(res => {
          if (res.code === '200') {   // 表示操作成功
            this.$message.success('操作成功')
            this.load(1)
          } else {
            this.$message.error(res.msg)  // 弹出错误的信息
          }
        })
      }).catch(() => {
      })
    }
  },
};
</script>

<style>
</style>