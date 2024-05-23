<template>
  <div>
    <div>
      <el-input style="width: 200px" placeholder="查询教室名" v-model="name"></el-input>
      <el-input style="width: 200px; margin: 0 5px" placeholder="查询教室类型" v-model="type"></el-input>
      <el-button type="primary" @click="load(1)">查询</el-button>
      <el-button type="info" @click="reset">重置</el-button>
    </div>
    <el-table :data="tableData" stripe :header-cell-style="{ backgroundColor: 'aliceblue', color: '#666' }" :cell-style="{fontSize:'20px'}">
      <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
      <el-table-column prop="name" label="教室名"></el-table-column>
      <el-table-column prop="capacity" label="教室容量"></el-table-column>
      <el-table-column prop="typeName" label="教室类型"></el-table-column>
      <el-table-column prop="location" label="教室位置"></el-table-column>
      <!-- TODO 删除了教室状态，把教室状态存储在预定表里 -->
      <el-table-column prop="description" label="教室描述" show-overflow-tooltip></el-table-column>
      <el-table-column label="教室图片">
        <template v-slot="scope">
          <div style="display: flex; align-items: center">
            <el-image style="width: 50px; height: 50px; border-radius: 50%" v-if="scope.row.image"
                      :src="scope.row.image" :preview-src-list="[scope.row.image]"></el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template v-slot="scope">
          <el-button size="mini" type="primary" plain @click="reserveRoom(scope.row.name)">预约</el-button>
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
    <el-dialog title="教室预约" :visible.sync="formVisible" width="30%">
      <el-form :model="form" label-width="80px" style="padding-right: 20px" ref="formRef">
        <el-form-item label="选择日期">
          <el-date-picker v-model="form.selectedDate" type="date" placeholder="请选择预约日期"
                          @change="handleDateChange"
                          :picker-options="pickerOptions" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <div class="time-slots">
            <el-button v-for="timeSlot in filteredTimeSlots" :key="timeSlot"
                       :class="{ 'booked': isTimeSlotBooked(timeSlot), 'selected': form.selectedTimeSlot === timeSlot }"
                       @click="toggleTimeSlot(timeSlot)" :disabled="isTimeSlotBooked(timeSlot)"> {{ timeSlot }}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="申请原因" prop="comment">
          <el-input v-model="form.comment" placeholder="请输入申请理由"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirmReservation">确定</el-button>
          <el-button @click="cancelReservationForm">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //用这个对象存储预约信息向后端请求 添加预约信息
      reservation: {
        uid: 0,
        cid: 0,
        startTime: 0,
        endTime: 0,
        day: '',
        status: 1,
        createdAt: '',
        updatedAt: '',
        comment: '',
      },
      form: {
        selectedDate: '', // 选择的日期
        selectedTimeSlot: '', // 选择的时间段
        comment: '',
      },
      currentDate: new Date().toISOString().split('T')[0], // 获取当前日期
      user: JSON.parse(localStorage.getItem('honey-user') || '{}'),
      formVisible: false, // 控制预约表单显示
      name: '', //查询中教室的教室名
      type: '',
      selectedRoom: '', //当前选中的教室名
      roomId: 1,
      tableData: [],
      pageNum: 1,   // 当前的页码
      pageSize: 5,  // 每页显示的个数
      total: 0,
      timeSlots: ["08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00", "13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00","17:00 - 18:00","18:00 - 19:00","19:00 - 20:00"],
      bookedTimeSlots: [], // 已被预约的时间段 从booking表中查出来从后端获取这个数据把后端传过来的数据已经被预约的存到这个数组里
      pickerOptions: {
        disabledDate(time) {
          // 获取今天的开始时间
          const now = new Date();
          now.setHours(0, 0, 0, 0); // 设置为 00:00:00
          // 计算一周后的日期
          const end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 一周后的日期
          return time.getTime() < now.getTime() || time.getTime() > end.getTime(); // 只能选择从今天开始，一周内的日期
        }

      }
    };
  },
  created() {
    this.load(1)
  },
  methods: {
    //刷新当前表格的信息 实现分页查询
    load(pageNum) {
      if (pageNum) this.pageNum = pageNum
      this.$request.get('/room/selectFree', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          name: this.name,
          type: this.type
        }
      }).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    //用来向后端发请求 查找已经被预约的时间段 发给后端的参数为教室名和日期 status 0:空闲 1:预约中 2:预约成功 3:预约失败 0和1的时候可以预约
    //当日期组件变化时，刷新当前预约信息
    handleDateChange() {
      this.bookedTimeSlots = [];
      let date=this.form.selectedDate
      this.refreshBookingInfo(date, this.selectedRoom);

    },
    //刷信组件信息
    refreshBookingInfo(date, name) {
      // console.log(date)
      this.$request.get('/book/has', {
        params: {
          roomName: name,
          day: date
        }
      }).then(res => {

        if (res.data && res.data.length > 0) {
          res.data.forEach(booking => {
            let datePickerDate = new Date(this.form.selectedDate);
            let y = datePickerDate.getFullYear();
            let m = datePickerDate.getMonth() + 1;
            let d = datePickerDate.getDate();

            if (booking.day && y === booking.day[0] && m === booking.day[1] && d === booking.day[2]) {
              // 获取预约记录的开始时间和结束时间
              const startTime = booking.startTime < 10 ? `0${booking.startTime}` : booking.startTime;
              const endTime = booking.endTime < 10 ? `0${booking.endTime}` : booking.endTime;

              // 构造时间段字符串并添加到 bookedTimeSlots 数组中
              const timeSlot = `${startTime}:00 - ${endTime}:00`;
              this.bookedTimeSlots.push(timeSlot);
            }
          });
        } else {
          // 当数据为空时的处理逻辑
          this.bookedTimeSlots = []; // 设置为空数组或者其他处理逻辑
        }
      })

    },
    //重置按钮功能
    reset() {
      this.name = ""
      this.type = ""
      this.load(1)
    },
    //分页界面加载
    handleCurrentChange(pageNum) {
      this.load(pageNum)
    },
    reserveRoom(row) {
      // 打开预约表单，并设置默认教室名
      this.formVisible = true;
      this.selectedRoom = row;
    },

    //点击按钮时设置时间段把表格里的时间段设置成当前时间段
    toggleTimeSlot(timeSlot) {
      // 切换时间段
      this.form.selectedTimeSlot = this.form.selectedTimeSlot === timeSlot ? '' : timeSlot;
    },
    //由于打开时其实已经进行了教室的查询我们可以直接进行预约了
    confirmReservation() {
      // 确认预约逻辑
      if (!this.form.selectedDate || !this.form.selectedTimeSlot) {
        this.$message.error('请选择日期和时间段');
        return;
      }

      // const selectedDateTime = `${this.form.selectedDate} ${this.form.selectedTimeSlot}`;
      // 现在你可以使用 selectedDateTime 变量来访问所选的日期和时间段了
      const userId = this.user.id;
      const [startTime, endTime] = this.form.selectedTimeSlot.split(' - ');
      const startHour = startTime.split(':')[0]; //当前表单中的起始时间
      const endHour = endTime.split(':')[0]; //当前表单中的截止日期
      //TODO 我需要教室的ID查看当前日期这个教室是否被预约
      //通过教室名查询到教室id
      this.$request.get('/room/getId', {
        params: {
          name: this.selectedRoom
        }
      }).then(res => {
        // 在回调函数中执行后续的逻辑，确保获取到教室 ID 后再进行赋值操作
        this.roomId = res.data;
        // 将赋值操作放在回调函数中
        this.reservation.uid = userId;
        this.reservation.cid = this.roomId;
        this.reservation.day = this.form.selectedDate;
        this.reservation.startTime = startHour;
        this.reservation.endTime = endHour;
        this.reservation.comment=this.form.comment
        this.$request.post('/book/reserve', this.reservation).then(ans => {
          if (ans.code === '200') {
            this.$message.success("请求预约成功，请等待管理员审核");
            this.form.selectedDate = ''; // 清空选择的日期
            this.form.selectedTimeSlot = ''; // 清空选择的时间段
            this.form.comment=''
            this.formVisible = false;
          }
        });
      });


    },
    cancelReservationForm() {
      // 取消预约表单显示
      this.formVisible = false;
      // 清空表单数据
      this.form = {};
    },
    isTimeSlotBooked(timeSlot) {
      // 检查时间段是否已预约
      return this.bookedTimeSlots.includes(timeSlot);
    }
  },
  computed: {
    filteredTimeSlots() {
      // 获取当前时间的小时和分钟
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      // 根据当前时间过滤已被预约的时间段
      if (!this.form.selectedDate) return [];
      return this.timeSlots.filter(timeSlot => {
        const [startTime, endTime] = timeSlot.split(' - ');
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);

        // 检查日期是否与当前日期相同
        const selectedDate = new Date(this.form.selectedDate);
        const currentDate = new Date();
        const isCurrentDate = selectedDate.getDate() === currentDate.getDate() &&
            selectedDate.getMonth() === currentDate.getMonth() &&
            selectedDate.getFullYear() === currentDate.getFullYear();

        // 如果选定的日期等于当前日期，则只显示当前时间之后的时间段
        if (isCurrentDate && (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute))) {
          return true; // 时间在当前时间之后，保留该时间段
        } else if (!isCurrentDate) {
          return true; // 如果选定的日期不是当前日期，则保留所有时间段
        } else {
          return false; // 其他情况过滤掉该时间段
        }
      });
    }
  }

};
</script>

<style scoped>
.booked {
  background-color: #ff00d5;
}

.selected {
  background-color: lightblue;
}

.time-slots {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.el-button+.el-button, .el-checkbox.is-bordered+.el-checkbox.is-bordered{
  margin-left: 0;
}
.el-tooltip__popper{ max-width:300px !important; }

</style>
