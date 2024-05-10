<template>
  <div ref="chart" style="width: 100%; height: 400px; padding: 0 10px "></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return {
      classroomData: []
    };
  },
  mounted() {
    this.chart = echarts.init(this.$refs.chart)
    this.fetchChartData();
  },
  methods: {
    fetchChartData() {
      this.$request.get('/room/getBookingTypeCount').then(res => {
        if (res.code === "200") {
          this.classroomData = res.data
          this.updateChart()
        } else {
          console.error('error fetch data')
        }
      })
    },
    updateChart() {

      const option = {
        title: {
          text: '预约数量分教室类型统计', // 设置标题文本
          left: 'center' // 标题位置
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: this.classroomData.map(item => item.type)
        },
        series: [
          {
            name: '预约数量',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: this.classroomData.map(item => ({
              name: item.type,
              value: item.bookingsCount
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      this.chart.setOption(option)
    },

  }
}
</script>
<style>
</style>