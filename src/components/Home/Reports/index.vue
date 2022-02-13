<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <div id="chart"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import _ from 'lodash'
export default {
  name: 'Reports',
  data() {
    return {
      reportsData: {},
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  methods: {
    lineChart() {
      const myCharts = echarts.init(document.getElementById('chart'))
      this.$api.reports.getReports().then((res) => {
        if (!this.$fn.error) return
        const result = _.merge(res.data, this.options)
        this.reportsData = result
        myCharts.setOption(this.reportsData)
      })
    }
  },
  created() {},
  mounted() {
    this.lineChart()
  }
}
</script>

<style  scoped>
#chart {
  width: 800px;
  height: 400px;
}
</style>
