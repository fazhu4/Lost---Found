<script setup>
import * as echarts from 'echarts'
import axios from 'axios'
import { ref, onMounted } from 'vue'

onMounted(() => {
  const dom = document.getElementById('line')
  const myChart = echarts.init(dom)

  const data = new Array(8).fill(null).map(() => {
    return {
      value: Math.ceil(Math.random() * 600) + 100,
    }
  })

  const option = {
    backgroundColor: '#0D2038',
    color: ['rgba(0, 190, 161, 0.4)'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line', // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: ['1', '2', '3', '4', '5', '6', '7', '8'],
        boundaryGap: false,
        axisTick: {
          show: false, // 不显示坐标轴刻度线
        },
        splitLine: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          show: false, // 不显示Y轴线
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          show: false, // 不显示Y轴标签
        },
        axisLine: {
          show: false, // 不显示Y轴线
        },
        splitLine: {
          show: false, // 不显示Y轴线
        },
      },
    ],
    series: [
      {
        name: '收入统计',
        type: 'line',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line', // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        lineStyle: {
          width: 3,
          shadowColor: 'rgba(14, 223, 255, 1)',
          shadowBlur: 20,
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              3,
              [
                {
                  offset: 0,
                  color: 'rgba(25, 224, 121, 0.80)',
                },
                {
                  offset: 0.2,
                  color: 'rgba(25, 224, 121, 0)',
                },
              ],
              false,
            ),
          },
        },
        data: [9, 40, 30, 42, 30, 25, 43, 15],
      },
    ],
  }

  myChart.setOption(option)
})
</script>

<template>
  <div id="line" style="width: 100%; height: 400px"></div>
</template>

<style lang="scss" scoped>
#line {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
