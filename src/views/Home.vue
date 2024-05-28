<template>
  <!--  row代表行-->
  <el-row>
    <el-col :span="8">
      <el-card class="box-card">
        <div class="user">
          <img :src="user.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" alt=""/>
          <div class="userinfo">
            <p class="name">{{ userInfo.name }}</p>
            <p class="access">{{ userInfo.role }}</p>
          </div>
        </div>
      </el-card>
      <el-card style="margin-top: 20px; height: 735px">
        <h1 style="text-align: center">当前时段教室预约情况</h1>
        <el-table :data="tableData" style="width: 100%" :cell-style="{fontSize:'20px'}">
          <el-table-column prop="name" label="教室名"></el-table-column>
          <el-table-column prop="status" label="预约状态">
            <template v-slot="{ row }">
              {{ getStatusText(row.status) }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="16">
      <div class="num">
        <el-card
            v-for="item in countData"
            :key="item.name"
            :body-style="{ display: 'flex' ,padding: 0}"
        >
          <i
              class="icon"
              :class="`el-icon-${item.icon}`"
              :style="{ background: item.color }"
          ></i>
          <div class="detail">
            <p class="price">{{ item.value }}</p>
            <p class="desc">{{ item.name }}</p>
          </div>
        </el-card>
      </div>
      <!--      装填可视化模块-->
      <div class="charts">
        <el-card style="margin-left: 20px">
          <el-select v-model="selectedRoom" @change="fetchChartData" placeholder="请选择教室">
            <el-option v-for="room in rooms" :key="room" :value="room" :label="room"></el-option>
          </el-select>
          <div ref="pieChart" style="height: 400px;"></div>
          <div ref="lineChart" style="height: 400px;"></div>
        </el-card>
      </div>

    </el-col>
  </el-row>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem('honey-user') || '{}'),
      typeCharts: 'line',
      fileList: [],
      userInfo: null,
      tableData: [],
      countData: [
        {
          name: "今日预约数量",
          value: 0,
          icon: "success",
          color: "#2ec7c9",
        },
        {
          name: "当前空闲教室数",
          value: 0,
          icon: "star-on",
          color: "#ffb980",
        },
        {
          name: "教室总数",
          value: 0,
          icon: "takeaway-box",
          color: "#5ab1ef",
        },

      ],
      selectedRoom: '教三A101',//选中的要查询的教室
      rooms: ['教三A101'],//从后端获取教室列表
      pieChart: null, //饼图
      lineChart: null, //最近预约
      totalSlots: 12, // 总的可预约时段
      bookedSlots: 0, // 当日预定成功的时段数量
      roomBookings:[],//近七日预约情况

    };
  },
  created() {
    this.getUserInfoFromLocalStorage();
    this.getApplyCount();
    this.getFreeRoomCount();
    this.getTimeTable();
    this.getRoomList();

  },
  mounted() {   // 页面加载完成之后触发
    this.pieChart = echarts.init(this.$refs.pieChart);
    this.lineChart=echarts.init(this.$refs.lineChart)
    if (!this.user.id) {   // 当前的浏览器没有用户信息
      this.$router.push('/login')
    } else {
      this.fetchChartData(); // 页面加载时默认加载数据
    }

  },
  methods: {
    //获取图表的数据

    //获取教室名列表
    getRoomList() {
      this.$request.get('/room/getAllRoom').then(res => {
        if (res.code === '200') {
          this.rooms = res.data
          this.countData[2].value = res.data.length;
        }
      })
    },
    getUserInfoFromLocalStorage() {
      const storedUserInfo = localStorage.getItem('honey-user');
      if (storedUserInfo) {
        try {
          this.userInfo = JSON.parse(storedUserInfo);
        } catch (error) {
          console.error('解析用户信息时出错:', error);
        }
      } else {
        // 用户信息不存在于localStorage中，可以重定向到登录页面或进行其他处理  
        console.log('用户信息不存在于localStorage中');
      }
    },
    getApplyCount() {
      this.$request.get('/book/applyCount').then(res => {
        if (res.code === "200") { // 这里应该判断 res 的状态码而不是 res 本身
          // 更新 countData 中的对应项
          this.countData[0].value = res.data;
        }
      }).catch(error => {
        console.error('获取预约数量失败:', error);
      });
    },
    getFreeRoomCount() {
      this.$request.get('/book/freeRoomCount').then(res => {
        if (res.code === "200") { // 这里应该判断 res 的状态码而不是 res 本身
          // 更新 countData 中的对应项
          this.countData[1].value = res.data;
        }
      }).catch(error => {
        console.error('获取空闲教室失败:', error);
      });
    },
    //更新当前展示时间段状态的表格
    getTimeTable() {
      this.$request.get('/book/timereserve').then(res => {
        if (res.code === '200') {
          this.tableData = res.data
        }
      })
    },
    getStatusText(status) {
      switch (status) {
        case 1:
          return '待审核';
        case 2:
          return '使用中'
        default:
          return '空闲'
      }
    },
    fetchChartData(){
      this.$request.get('/book/selectPie',{
        params: {
          name: this.selectedRoom
        }
      }).then(res=>{
        if(res.code==='200'){
          this.bookedSlots=res.data
          this.updatePieChart();
        } else {
          console.error('Error fetching data:')
        }
      });
      this.$request.get('/book/selectLine',{
        params: {
          name: this.selectedRoom
        }
      }).then(res=>{
        if(res.code==='200'){
          this.roomBookings=res.data
          this.updateLineChart();
        } else {
          console.error('Error fetching data:')
        }
      });

    },
    updatePieChart() {
      const option = {
        title: {
          text: `${this.selectedRoom} 当日已有预约时段占比`,
          subtext: '总时段：' + this.totalSlots,
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            name: '预定时段',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              {value: this.bookedSlots, name: '预定成功'},
              {value: this.totalSlots - this.bookedSlots, name: '未预定'},
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      this.pieChart.setOption(option);
    },
    updateLineChart(){

      const xAxisData = this.roomBookings.map(booking => booking.bookingDay);
      const seriesData = this.roomBookings.map(booking => booking.bookingCount);
      const option={
        title: {
          text: `${this.selectedRoom} 过去七天的预约数量`,
          left: 'center'
        },
        xAxis: {
          type: 'category',
          data: xAxisData
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: seriesData,
          type: 'line'
        }]
      }
      this.lineChart.setOption(option)
    }

  },


};
</script>

<style lang="less" scoped>
.user {
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;

  img {
    width: 150px;
    margin-right: 40px;
    height: 150px;
    border-radius: 50%;
  }

  .userinfo {
    .name {
      font-size: 32px;
      margin-bottom: 10px;
    }

    .access {
      color: #999999;
    }
  }
}

.login-info {
  p {
    line-height: 28px;
    font-size: 14px;
    color: #999999;

    span {
      color: #666666;
      margin-left: 60px;
    }
  }
}

.num {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-left: 20px;

  .icon {
    width: 80px;
    height: 80px;
    font-size: 30px;
    text-align: center;
    line-height: 80px;
    color: #fff;
  }

  .detail {
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .price {
      font-size: 30px;
      margin-bottom: 10px;
      line-height: 30px;
      height: 30px;
      text-align: center;
    }

    .desc {
      font-size: 14px;
      color: #999;
      text-align: center;
    }
  }

  .el-card {
    width: 32%;
    margin-bottom: 20px;
  }
}
</style>