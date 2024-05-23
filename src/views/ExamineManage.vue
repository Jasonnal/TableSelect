<template>
  <div>
    <el-table :data="reservationList" stripe :cell-style="{fontSize:'20px'}">
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="name" label="教室名" align="center"></el-table-column>
      <el-table-column prop="username" label="预约人" align="center"></el-table-column>
      <el-table-column prop="role" label="预约角色" align="center"></el-table-column>
      <el-table-column prop="day" label="预约日期" align="center">
        <template v-slot="scope">
          {{ formatDate(scope.row.day) }}
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间" align="center" width="60"></el-table-column>
      <el-table-column prop="endTime" label="结束时间" align="center"></el-table-column>
      <el-table-column prop="comment" label="预约理由" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="scope">
          <div style="display: flex; justify-content: space-around;">
            <el-button size="mini" type="primary" @click="approveReservation(scope.row)">审核通过</el-button>
            <el-button size="mini" type="danger" @click="rejectReservation(scope.row)">审核拒绝</el-button>
          </div>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      reservationList: [], // 替换为从后端获取的实际预约数据
      pageNum: 1,   // 当前的页码
      pageSize: 5,  // 每页显示的个数
      total: 0,
    };
  },
  created() {
    this.fetchReservations(1);
  },
  methods: {

    //查询的条件是应该是当前booking表中日期大于当前日期，status为1 查询的结果返回教室名，预约人的姓名，预约日期，时间段
    fetchReservations(pageNum) {
      // 从后端 API 获取预约数据并填充 reservationList
      if (pageNum) this.pageNum = pageNum
      this.$request.get('/book/selectAll', {
        params: {
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
    approveReservation(row) {
      const requestData = {
        uid: row.uid,
        cid: row.cid,
        startTime: row.startTime,
        day: this.formatDate(row.day),
        status: 2 // 审批通过的状态值
      };
      this.$confirm('您确认批准该预约吗?', '确认', {type: "warning"}).then(response => {
        this.$request.put("/book/update", requestData).then(res => {
          // 处理响应结果
          if (res.code === '200') {
            this.$message.success('审批通过成功！');
            this.fetchReservations(1)
            // 刷新预约列表或者其他操作
          } else {
            this.$message.error('审批通过失败：' + res.msg);
          }
        })
      })


    },
    rejectReservation(row) {
      // console.log(row)
      const requestData = {
        uid: row.uid,
        cid: row.cid,
        startTime: row.startTime,
        day: this.formatDate(row.day),
        status: 3 // 拒绝的状态码为3
      };
      this.$confirm('您确认拒绝该预约吗?', '确认', {type: "warning"}).then(response => {
        this.$request.put("/book/update", requestData).then(res => {
          // 处理响应结果
          if (res.code === '200') {
            this.$message.success('拒绝！');
            this.fetchReservations(1)
            // 刷新预约列表或者其他操作
          } else {
            this.$message.error('拒绝失败：' + res.msg);
          }
        })
      })
    },
    handleCurrentChange(pageNum) {
      this.fetchReservations(pageNum)

    },
    formatDate(dateArray) {
      // 将日期数组转换为 ISO 8601 格式的字符串
      const year = dateArray[0];
      const month = dateArray[1] < 10 ? '0' + dateArray[1] : dateArray[1];
      const day = dateArray[2] < 10 ? '0' + dateArray[2] : dateArray[2];
      return `${year}-${month}-${day}`;
    }
  },


};
</script>

<style scoped>
/* 在这里添加自定义样式 */
</style>
