<template>
  <div ref="chart" style="width: 100%; height: 400px; padding: 0 10px "></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return {
      chartData: []
    };
  },
  mounted() {
    this.chart = echarts.init(this.$refs.chart)
    this.fetchChartData();
  },
  methods: {
    fetchChartData() {
      this.$request.get('/book/countByWeek').then(res => {
        if (res.code === "200") {
          this.chartData = res.data
          this.updateChart()
        } else {
          console.error('error fetch data')
        }
      })
    },
    updateChart() {
      let xAxisData = [];
      let seriesData = [];
      this.chartData.forEach(item => {
        xAxisData.push(item.weekday);
        seriesData.push(item.bookingsCount);
      });
      const option = {
        title: {
          text: '每日预约量统计', // 设置标题文本
          left: 'center' // 标题位置
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
          axisLabel: {
            rotate: 45, // 旋转 x 轴标签，使其更容易阅读
            fontSize: 12 // 调整 x 轴标签的字体大小
          },
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: seriesData,
          type: 'bar'
        }],
        // 启用缩放功能
        dataZoom: [{
          type: 'slider', // 缩放类型为滑动条
          start: 0, // 缩放范围的起始百分比
          end: 100 // 缩放范围的结束百分比
        }]
      }
      this.chart.setOption(option)
    },

  }
}
</script>
<style>
</style>
