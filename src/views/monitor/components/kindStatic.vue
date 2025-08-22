<template>
  <div id="container" ref="chartContainer" style="height: 100%; width: 100%"></div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const chartContainer = ref(null)
let myChart = null

// 初始化图表
const initChart = () => {
  if (!chartContainer.value) return

  myChart = echarts.init(chartContainer.value)

  // 示例数据（12个月） - 保持原始数值不变
  const monthlyData = [1680, 1440, 2892, 2128, 652, 1424, 1872, 2128, 2708, 3420, 1740, 2608]

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      backgroundColor: 'rgba(0,38,77,0.8)',
      borderColor: '#23FEE8',
      borderWidth: 1,
      padding: [6, 15],
      textStyle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
      },
      formatter: (params) => {
        return `
          <div style="font-size: 14px;">
            ${params[0].name}<br />
            数值: ${params[0].value}
          </div>
        `
      },
    },
    grid: {
      left: '2%',
      right: '2%',
      bottom: '5%',
      top: 30,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      axisTick: {
        alignWithLabel: true,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: true,
        color: 'rgba(255, 255, 255, 1)',
        fontSize: 12,
        interval: 0,
        margin: 20,
      },
    },
    yAxis: {
      min: 0,
      max: 4000, // 仅修改这一行，将最大值设为100
      splitNumber: 5,
      type: 'value',
      axisLine: {
        show: false,
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: '#003969',
          type: 'solid',
        },
      },
      axisLabel: {
        show: true,
        color: 'rgba(255, 255, 255, 1)',
        fontSize: 12,
        formatter: function (value) {
          if (value >= 1000) {
            return value / 1000 + 'k'
          }
          return value
        },
        margin: 20,
      },
    },
    series: {
      type: 'bar',
      barWidth: 12,
      data: monthlyData,
      z: 2,
      itemStyle: {
        opacity: 0.8,
        color: 'rgba(30, 117, 255, 1)',
        barBorderRadius: [8, 8, 8, 8],
      },
      emphasis: {
        itemStyle: {
          color: '#00FFE0',
          shadowBlur: 10,
          shadowColor: 'rgba(0, 255, 224, 0.5)',
        },
      },
    },
  }

  myChart.setOption(option)

  // 强制重置位置
  setTimeout(() => {
    myChart.resize()
  }, 0)
}

onMounted(() => {
  initChart()

  // 窗口变化时也刷新图表
  window.addEventListener('resize', () => {
    if (myChart) {
      myChart.resize()
    }
  })
})

onUnmounted(() => {
  // 清理监听器和图表实例
  window.removeEventListener('resize', () => {})
  if (myChart) {
    myChart.dispose()
  }
})
</script>

<style scoped>
#container {
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
</style>
