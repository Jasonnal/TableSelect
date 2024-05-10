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
      this.$request.get('/book/countByHour').then(res => {
        if (res.code === "200") {
          this.chartData = res.data
          this.updateChart()
        } else {
          console.error('error fetch data')
        }
      })
    },
    updateChart() {

      const option = {
        title: {
          text: '预约记录创建时间小时统计',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          data: this.chartData.map(item => item.hourRange),
          axisLabel: {
            rotate: 45, // 旋转 x 轴标签，使其更容易阅读
            fontSize: 12 // 调整 x 轴标签的字体大小
          },
        },
        yAxis: {
          type: 'value',
        },
        series: [{
          data: this.chartData.map(item => item.bookingCount),
          type: 'line',
        }],
      }
      this.chart.setOption(option)
    },

  }
}
</script>
<style>
</style>
