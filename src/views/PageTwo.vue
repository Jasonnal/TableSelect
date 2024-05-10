<!--<template>-->
<!--  <div>-->
<!--    <el-row :gutter="10">-->
<!--      <el-col :span="12">-->
<!--        <el-card>-->
<!--          &lt;!&ndash; 图表类型选择按钮 &ndash;&gt;-->
<!--          <el-radio-group v-model="chartType" @change="fetchChartData">-->
<!--            <el-radio-button label="line">折线图</el-radio-button>-->
<!--            <el-radio-button label="pie">饼图</el-radio-button>-->
<!--          </el-radio-group>-->

<!--          &lt;!&ndash; 教室选择下拉菜单 &ndash;&gt;-->
<!--          <el-select v-model="selectedRoom" @change="fetchChartData" placeholder="请选择教室">-->
<!--            <el-option v-for="room in rooms" :key="room" :value="room" :label="room"></el-option>-->
<!--          </el-select>-->
<!--          <div ref="chart" style="width: 100%; height: 400px;"></div>-->
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
<!--      chartType: 'line', // 图表类型，默认为折线图-->
<!--      rooms: ['教室1', '教室2', '教室3'], // 教室列表-->
<!--      chart: null // ECharts 实例-->
<!--    };-->
<!--  },-->
<!--  mounted() {-->
<!--    // 初始化 ECharts 图表-->
<!--    this.chart = echarts.init(this.$refs.chart);-->
<!--    // 获取初始数据-->
<!--    this.fetchChartData();-->
<!--    this.getRoomList();-->
<!--  },-->
<!--  methods: {-->
<!--    // 发送请求获取统计数据，并更新图表内容-->
<!--    fetchChartData() {-->
<!--      if (this.chartType === 'pie') {-->
<!--        // 请求饼图数据-->
<!--        const pieData = this.generatePieData(); // 假设这是饼图数据的生成方法-->
<!--        this.updatePieChart(pieData);-->
<!--      }-->
<!--    },-->
<!--    getRoomList() {-->
<!--      this.$request.get('/room/getAllRoom').then(res => {-->
<!--        if (res.code === '200') {-->
<!--          this.rooms = res.data-->
<!--        }-->
<!--      })-->
<!--    },-->
<!--    // 更新饼图内容-->
<!--    updatePieChart(data) {-->
<!--      const option = {-->
<!--        title: {-->
<!--          text: '教室当日使用情况统计',-->
<!--          left: 'center'-->
<!--        },-->
<!--        tooltip: {-->
<!--          trigger: 'item',-->
<!--          formatter: '{a} <br/>{b}: {c} ({d}%)'-->
<!--        },-->
<!--        series: [-->
<!--          {-->
<!--            name: '使用情况',-->
<!--            type: 'pie',-->
<!--            radius: ['40%', '60%'],-->
<!--            avoidLabelOverlap: false,-->
<!--            label: {-->
<!--              show: false,-->
<!--              position: 'center'-->
<!--            },-->
<!--            emphasis: {-->
<!--              label: {-->
<!--                show: true,-->
<!--                fontSize: '30',-->
<!--                fontWeight: 'bold'-->
<!--              }-->
<!--            },-->
<!--            labelLine: {-->
<!--              show: false-->
<!--            },-->
<!--            data: data // 饼图数据-->
<!--          }-->
<!--        ]-->
<!--      };-->
<!--      this.chart.setOption(option);-->
<!--    },-->



<!--    generatePieData() {-->
<!--      // 假设这是饼图数据的生成方法-->
<!--      this.$request.get('/book/selectPie', {-->
<!--        params: {-->
<!--          name: this.selectedRoom-->
<!--        }-->
<!--      }).then(res => {-->
<!--        if (res.code === '200') {-->
<!--          return [-->
<!--            {value: res.data, name: '已预约'},-->
<!--            {value: 12 - res.data, name: '未预约'},-->
<!--          ];-->
<!--        }-->
<!--      })-->


<!--    },-->

<!--  }-->
<!--};-->
<!--</script>-->
