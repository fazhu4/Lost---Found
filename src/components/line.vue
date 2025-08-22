<script setup>
import * as echarts from 'echarts'
import axios from 'axios'
import { ref, onMounted, onUnmounted } from 'vue' // 添加了onUnmounted

const props = defineProps({
  datas: {
    type: Array,
    required: true,
  },
})
const line = ref(null)
let myChart = null // 添加这行保存图表实例

// 添加resize处理函数
const handleResize = () => {
  if (myChart) {
    myChart.resize()
  }
}

onMounted(() => {
  const dom = line.value
  myChart = echarts.init(dom) // 保存实例到变量

  const option = {
    backgroundColor: 'transparent',
    color: ['rgba(0, 190, 161, 0.4)'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
      },
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '5%',
      top: '5%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: ['1', '2', '3', '4', '5', '6', '7', '8'],
        boundaryGap: false,
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        min: 0,
        max: 100,
        interval: 10,
        axisLabel: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: '热度变化',
        type: 'line',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
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
        symbol: 'none',
        data: props.datas,
      },
    ],
  }

  myChart.setOption(option)

  // 添加窗口resize监听
  window.addEventListener('resize', handleResize)
})

// 添加onUnmounted生命周期钩子
onUnmounted(() => {
  // 移除resize监听
  window.removeEventListener('resize', handleResize)
  // 销毁图表实例
  if (myChart) {
    myChart.dispose()
  }
})
</script>

<template>
  <div id="line" ref="line" style="width: 100%; height: 100%"></div>
</template>

<style lang="scss" scoped>
#line {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
