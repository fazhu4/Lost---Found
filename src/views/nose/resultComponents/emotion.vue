<template>
  <div ref="chartContainer" style="height: 110%; width: 100%"></div>
</template>

<script setup>
import { onMounted, ref, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  emotionArrays: {
    type: Object,
    required: true, // 如果需要，可以指定是否必需
  },
})

const emotionList = ref()

watch(
  () => props.emotionArrays,
  (newValue) => {
    if (newValue) {
      emotionList.value = newValue
    }
  },
  {
    immediate: true,
  },
)

const chartContainer = ref(null)

onMounted(() => {
  const myChart = echarts.init(chartContainer.value)

  // 七种情绪数据，value值与num百分比对应
  const emotionData = emotionList.value

  // 准备图表数据
  const emotions = emotionData.map((item) => item.type)
  const values = emotionData.map((item) => item.value)

  // Chart options
  const option = {
    backgroundColor: 'transparent',
    grid: {
      left: '0%',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      backgroundColor: 'rgba(204, 204, 204, 0.7)',
      borderColor: 'transparent',
      borderWidth: 1,
      padding: [6, 15],
      textStyle: {
        color: 'rgba(255, 255, 255, 1)',
        fontSize: 14,
        fontWeight: 'bold',
      },
      position: function (point, params, dom, rect, size) {
        // 将提示框定位到柱子的左上方
        return [point[0] - size.contentSize[0] / 2, point[1] - size.contentSize[1]]
      },
      formatter: (params) => {
        const dataItem = emotionData.find((item) => item.type === params[0].name)
        return `
        <div style="font-size: 14px;">
          占比: ${dataItem.num}
        </div>
      `
      },
    },
    legend: {
      show: false,
    },
    xAxis: {
      type: 'category',
      data: emotions,
      axisLine: {
        lineStyle: {
          color: '#ccc',
        },
      },
      axisLabel: {
        textStyle: {
          align: 'center',
          color: 'rgba(255, 255, 255, 1)',
          fontSize: 14,
          fontWeight: 500,
        },
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      show: true,
      splitLine: {
        show: false,
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(42, 130, 228, 1)' },
            { offset: 0.5, color: 'rgba(0, 186, 173, 1)' },
            { offset: 1, color: 'rgba(67, 207, 124, 1)' },
          ]),
          width: 6,
        },
      },
      axisLabel: {
        show: false,
      },
      axisPointer: {
        lineStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(42, 130, 228, 1)' },
              { offset: 0.5, color: 'rgba(0, 186, 173, 1)' },
              { offset: 1, color: 'rgba(67, 207, 124, 1)' },
            ],
            global: false,
          },
          width: 2,
        },
      },
    },
    series: [
      {
        name: 'line',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 18,
        itemStyle: {
          color: 'rgba(0, 186, 173, 1)',
          borderColor: '#fff',
          borderWidth: 5,
          lineStyle: {
            color: 'lightblue',
          },
        },
        data: values,
      },
      {
        name: 'bar',
        type: 'bar',
        barGap: '-100%',
        barWidth: 15,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(105, 155, 255, 0.01)' },
            { offset: 1, color: 'rgba(105, 255, 237, 1)' },
          ]),
        },
        z: -12,
        data: values,
      },
    ],
  }

  myChart.setOption(option)

  const handleResize = () => {
    myChart.resize()
  }
  window.addEventListener('resize', handleResize)

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    myChart.dispose()
  })
})
</script>
<style>
#container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
