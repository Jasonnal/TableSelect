<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div>
          <el-card>
            <WeekCharts />
          </el-card>
        </div>
      </el-col>
      <el-col :span="12">
        <div>
          <el-card>
            <MonthCharts />
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <div>
          <el-card>
            <TypeCharts />
          </el-card>
        </div>
      </el-col>
      <el-col :span="16">
        <div>
          <el-card>
            <HourCharts />
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import WeekCharts from "@/views/charts/WeekCharts";
import MonthCharts from "@/views/charts/MonthCharts";
import TypeCharts from "@/views/charts/TypeCharts";
import HourCharts from "@/views/charts/HourCharts";
export default {
  components: {
    WeekCharts, // 注册子组件
    MonthCharts,
    TypeCharts,
    HourCharts
  }

}
</script>

<style>

</style>