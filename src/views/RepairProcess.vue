<template>
  <div>
    <el-table :data="reservationList" stripe>
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
      <el-table-column label="操作" align="center">
        <template v-slot="scope">
          <el-button size="mini" type="success" @click="processRepair(scope.row)"
                     :disabled="isDisabled(scope.row)">处理
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
      this.$request.get("/repair/selectAllApply", {
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
    handleCurrentChange(pageNum) {
      this.fetchReservations(pageNum)
    },
    getStatusText(repairStatus) {
      if (repairStatus === 1) {
        return "待处理"
      } else if (repairStatus === 2) {
        return "已处理"
      }
    },
    isDisabled(row) {
      if (row.repairStatus === 1) {
        return false
      } else {
        return true;
      }
    },
    processRepair(row) {
      this.$request.put("/repair/process", {
        id: row.rid,
        repairStatus: 2
      }).then(res => {
        if (res.code === "200") {
          this.fetchReservations(this.pageNum);
          this.$message.success("已处理，等待派工")
        }
      })
      this.$request.put("/room/update", {
        id: row.cid,
        open: false,
      }).then(res => {
        if (res.code === "200") {

        }
      })
      this.$request.put("/repair/repairProcess/" + row.cid).then(res => {
        if (res.code ==="200") {
        }

      })
    }


  }
};
</script>

<style scoped>
/* 自定义样式 */
</style>
