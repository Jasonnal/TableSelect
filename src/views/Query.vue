<!--<template>-->
<!--  <div>-->
<!--    <el-row :gutter="10">-->
<!--      <el-col :span="12">-->
<!--        <el-card>-->
<!--          &lt;!&ndash; 时间粒度选择按钮 &ndash;&gt;-->
<!--          <el-radio-group v-model="timeGranularity" @change="fetchChartData">-->
<!--            <el-radio-button label="daily">每日</el-radio-button>-->
<!--            <el-radio-button label="weekly">每周</el-radio-button>-->
<!--            <el-radio-button label="monthly">每月</el-radio-button>-->
<!--          </el-radio-group>-->

<!--          &lt;!&ndash; 教室选择下拉菜单 &ndash;&gt;-->
<!--          <el-select v-model="selectedRoom" @change="fetchChartData" placeholder="请选择教室">-->
<!--            <el-option v-for="room in rooms" :key="room" :value="room" :label="room"></el-option>-->
<!--          </el-select>-->
<!--          <div ref="lineChart" style="width: 100%; height: 400px;"></div>-->
<!--        </el-card>-->
<!--      </el-col>-->
<!--      <el-col :span="12">-->
<!--        <el-card>-->

<!--        </el-card>-->
<!--      </el-col>-->
<!--    </el-row>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import * as echarts from 'echarts';-->

<!--export default {-->
<!--  data() {-->
<!--    return {-->
<!--      selectedRoom: '', // 选择的教室-->
<!--      timeGranularity: 'daily', // 时间粒度，默认为每日-->
<!--      rooms: ['教室1', '教室2', '教室3'], // 教室列表-->
<!--      chart: null // ECharts 实例-->
<!--    };-->
<!--  },-->
<!--  mounted() {-->
<!--    // 初始化 ECharts 图表-->
<!--    this.chart = echarts.init(this.$refs.lineChart);-->
<!--    // 获取初始数据-->
<!--    this.fetchChartData();-->
<!--  },-->
<!--  methods: {-->
<!--    // 发送请求获取统计数据，并更新图表内容-->
<!--    fetchChartData() {-->
<!--      // 根据选择的时间粒度和教室向后端发送请求获取相应统计数据-->
<!--      // 这里的代码仅作为示例，实际需要根据后端接口进行修改-->
<!--      const data = this.generateMockData(); // 模拟数据-->
<!--      this.updateChart(data);-->
<!--    },-->
<!--    // 更新图表内容-->
<!--    updateChart(data) {-->
<!--      const option = {-->
<!--        title: {-->
<!--          text: '教室使用时长统计'-->
<!--        },-->
<!--        tooltip: {},-->
<!--        xAxis: {-->
<!--          type: 'category',-->
<!--          data: data.dates-->
<!--        },-->
<!--        yAxis: {-->
<!--          type: 'value'-->
<!--        },-->
<!--        series: [{-->
<!--          type: 'line',-->
<!--          data: data.durations-->
<!--        }]-->
<!--      };-->
<!--      this.chart.setOption(option);-->
<!--    },-->
<!--    // 生成模拟数据（仅作为示例）-->
<!--    generateMockData() {-->
<!--      // 根据选择的时间粒度生成模拟数据-->
<!--      let dates, durations;-->
<!--      if (this.timeGranularity === 'daily') {-->
<!--        dates = ['2022-04-01', '2022-04-02', '2022-04-03','2022-04-01', '2022-04-02', '2022-04-03','2022-04-01', '2022-04-02', '2022-04-03','2022-04-03','2022-04-01', '2022-04-02', '2022-04-03','2022-04-03','2022-04-01', '2022-04-02', '2022-04-03','2022-04-03','2022-04-01', '2022-04-02', '2022-04-03','2022-04-03','2022-04-01', '2022-04-02', '2022-04-03'];-->
<!--        durations = [120, 180, 150];-->
<!--      } else if (this.timeGranularity === 'weekly') {-->
<!--        dates = ['Week 1', 'Week 2', 'Week 3'];-->
<!--        durations = [200, 250, 300];-->
<!--      } else if (this.timeGranularity === 'monthly') {-->
<!--        dates = ['Jan', 'Feb', 'Mar'];-->
<!--        durations = [300, 350, 400];-->
<!--      }-->
<!--      return { dates, durations };-->
<!--    }-->
<!--  }-->
<!--};-->
<!--</script>-->
