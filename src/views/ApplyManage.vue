<template>
  <div>
    <el-table :data="reservationList" stripe>
      <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
      <el-table-column prop="name" label="教室名"></el-table-column>
      <el-table-column prop="username" label="预约人"></el-table-column>
      <el-table-column prop="day" label="预约日期">
        <template v-slot="scope">
          {{ formatDate(scope.row.day) }}
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间"></el-table-column>
      <el-table-column prop="endTime" label="结束时间"></el-table-column>
      <el-table-column prop="status" label="预约状态">
        <template v-slot="{ row }">
          {{ getStatusText(row.status) }}
        </template>
      </el-table-column>
      <el-table-column label="使用状态">
        <template v-slot="{ row }">
          {{ getUsageText(row) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="scope">
          <el-button size="mini" type="danger" v-if="canCancel(scope.row)" @click="cancelReservation(scope.row)">
            取消预约
          </el-button>
          <el-button size="mini" type="success" v-if="canRepair(scope.row)" @click="openRepair(scope.row)"
                     :disabled="isDisabled(scope.row)">我要报修
          </el-button>
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
    <el-dialog title="我要报修" :visible.sync="repairVisible" width="30%">
      <el-form :model="repairForm" label-width="80px" style="padding-right: 20px" ref="formRef">
        <el-form-item label="报修内容" prop="comment">
          <el-input v-model="repairForm.comment" placeholder="请输入报修内容"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirmRepair">确定</el-button>
          <el-button @click="cancelRepair">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      reservationList: [], // 从后端获取的预约数据
      user: JSON.parse(localStorage.getItem('honey-user') || '{}'), // 当前用户信息
      pageNum: 1,   // 当前的页码
      pageSize: 5,  // 每页显示的个数
      total: 0,
      repairVisible: false, //报修提示框
      repairForm: {
        comment: "",
      },
      repair: {
        comment: '',
        repairedTime: '',
        repairStatus: 0,
        bid: '',
      },
    };
  },
  created() {
    this.fetchReservations(1);
  },
  methods: {
    fetchReservations(pageNum) {
      if (pageNum) this.pageNum = pageNum
      // 从后端 API 获取预约数据并填充 reservationList
      this.$request.get("/book/selectApply", {
        params: {
          uid: this.user.id, // 向后端传递当前用户的 ID，用于查询该用户的预约记录
          pageNum: this.pageNum,
          pageSize: this.pageSize

        }
      }).then(res => {
        if (res.code === '200') {
          this.reservationList = res.data.records;
          this.total = res.data.total
        }
      });
    },
    //判断是否可以取消
    canCancel(reservation) {
      const currentTime = new Date(); // 当前时间
      const reservationDateTime = new Date(`${this.formatDate(reservation.day)}T${this.formatTime(reservation.endTime)}`); // 预约的具体日期和时间
      //必须是当前时间早于预约时间的预约结束时间
      return reservationDateTime > currentTime && (reservation.status === 1 || reservation.status === 2);
    },
    //判断是否可以报修 必须预约时间已过且status==2
    canRepair(reservation) {
      const currentTime = new Date(); // 当前时间
      const reservationDateTime = new Date(`${this.formatDate(reservation.day)}T${this.formatTime(reservation.endTime)}`); // 预约的具体日期和时间
      //必须是当前时间早于预约时间的预约结束时间
      return reservationDateTime < currentTime && (reservation.status === 2);
    },
    confirmRepair() {

      this.repair.uid = this.user.id
      this.repair.comment = this.repairForm.comment
      this.repair.repairedTime = ''
      this.repair.repairStatus = 1
      this.$request.post('/repair/add', this.repair).then(ans => {
        if (ans.code === '200') {
          this.$message.success("报修成功，请等待管理员处理");
          this.repairForm.comment = ''
          this.repairVisible = false
          this.fetchReservations(this.pageNum)
        }
      })


    },
    //关闭弹框

    cancelRepair() {
      this.repairVisible = false;
      this.repairForm = {};
    },
    openRepair(row) {
      this.repairVisible = true
      this.repair.bid = row.bid
    },
    cancelReservation(row) {
      const requestData = {
        uid: row.uid,
        cid: row.cid,
        startTime: row.startTime,
        day: this.formatDate(row.day),
        status: 0 // 审批通过的状态值
      };
      // 取消预约操作
      this.$confirm('确定取消预约吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 向后端发送取消预约的请求
        this.$request.put('/book/update', requestData).then(res => {
          if (res.code === '200') {
            this.$message.success('取消预约成功');
            // 刷新预约记录列表
            this.fetchReservations(1);
          } else {
            this.$message.error('取消预约失败：' + res.msg);
          }
        });
      }).catch(() => {
        this.$message.info('已取消取消操作');
      });
    },
    handleCurrentChange(pageNum) {
      this.fetchReservations(pageNum)
    },
    getStatusText(status) {
      // 根据预约状态的数字返回对应的文字
      switch (status) {
        case 0:
          return '已取消';
        case 1:
          return '待审核';
        case 2:
          return '审核通过';
        case 3:
          return '审核不通过';
      }
    },
    getUsageText(row) {
      const currentTime = new Date(); // 当前时间
      const reservationStartTime = new Date(`${this.formatDate(row.day)}T${this.formatTime(row.startTime)}`); // 预约的开始时间
      const reservationEndTime = new Date(`${this.formatDate(row.day)}T${this.formatTime(row.endTime)}`); // 预约的结束时间
      if (row.status === 3) {
        return '审核不通过';
      } else if (row.status === 0) {
        return '已取消';
      } else if (row.status === 1) {
        if (currentTime >= reservationEndTime) {
          return '已过期'
        } else {
          return '待审核'
        }
      } else {
        if (currentTime >= reservationEndTime) {
          return '已过期'
        } else if (currentTime < reservationStartTime) {
          return '待使用'
        } else {
          return '使用中'
        }

      }
    },
    formatDate(dateArray) {
      // 将日期数组转换为 ISO 8601 格式的字符串
      const year = dateArray[0];
      const month = dateArray[1] < 10 ? '0' + dateArray[1] : dateArray[1];
      const day = dateArray[2] < 10 ? '0' + dateArray[2] : dateArray[2];
      return `${year}-${month}-${day}`;
    },
    formatTime(time) {
      const hours = time; // 获取小时数
      const minutes = 0; // 获取分钟数
      const formattedHours = hours < 10 ? '0' + hours : hours;
      const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
      return `${formattedHours}:${formattedMinutes}`;
    },
    isDisabled(row) {
      if (row.repairStatus != 0) {
        return true
      }
      return false
    }
  }
};
</script>

<style scoped>
/* 自定义样式 */
</style>
