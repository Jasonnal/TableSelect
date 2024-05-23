<template>
  <div>
    <el-table :data="reservationList" stripe :cell-style="{fontSize:'20px'}">
      <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
      <el-table-column prop="name" label="教室名"></el-table-column>
      <el-table-column prop="username" label="报修人"></el-table-column>
      <el-table-column prop="repairedTime" label="报修日期"></el-table-column>
      <el-table-column prop="repairedComment" label="报修描述"></el-table-column>
      <el-table-column prop="repairStatus" label="维修状态">
        <template v-slot="{ row }">
          {{ getStatusText(row.repairStatus) }}
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
      reservationList: [], // 从后端获取的预约数据
      user: JSON.parse(localStorage.getItem('honey-user') || '{}'), // 当前用户信息
      pageNum: 1,   // 当前的页码
      pageSize: 5,  // 每页显示的个数
      total: 0,
    };
  },
  created() {
    this.fetchReservations(1);
  },
  methods: {
    fetchReservations(pageNum) {
      if (pageNum) this.pageNum = pageNum
      // 从后端 API 获取预约数据并填充 reservationList
      this.$request.get("/repair/selectApply", {
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
    handleCurrentChange(pageNum) {
      this.fetchReservations(pageNum)
    },
    getStatusText(repairStatus) {
      if( repairStatus === 1){
        return "待处理"
      } else if(repairStatus === 2){
        return "已处理"
      }
    }


  }
};
</script>

<style scoped>
/* 自定义样式 */
</style>
