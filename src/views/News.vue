<template>
  <div style="display: flex; margin: 15px 0">
    <el-card style="width: 50%; margin-right: 10px">
      <div style="margin-bottom: 15px; font-size: 20px; font-weight: bold">系统公告</div>
      <el-timeline style="padding: 0">
        <el-timeline-item v-for="item in notices" :key="item.id" :timestamp="item.time" placement="top">
          <el-card>
            <h4>{{ item.title }}</h4>
            <p>{{ item.content }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>

  </div>
</template>

<script>
export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem('honey-user') || '{}'),
      notices: [],
      activeName: '0'
    }
  },
  created() {
    this.loadNotice()
  },
  methods: {
    loadNotice() {
      this.$request.get('/notice/selectUserData').then(res => {
        this.notices = res.data
      })
    }
  }
}
</script>

<style>

</style>