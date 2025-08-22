<script setup>
import * as echarts from 'echarts'
import 'echarts-wordCloud'
import { ref, onMounted, watch, computed, onUnmounted } from 'vue'

const props = defineProps({
  circleArray: {
    type: Array,
    required: true,
  },
})

const circleRef = ref(null)
let myChart = null

const colors = [
  'rgba(56, 135, 224, 1)',
  'rgba(88, 142, 204, 1)',
  'rgba(123, 171, 227, 1)',
  'rgba(56, 222, 224, 1)',
  'rgba(56, 222, 224, 1)',
  'rgba(67, 207, 124, 1)',
]

// 1. 确保能正确获取图表容器尺寸
const getChartSize = () => {
  if (!circleRef.value) return { width: 300, height: 300 }
  return {
    width: circleRef.value.clientWidth,
    height: circleRef.value.clientHeight,
  }
}

// 2. 更精确的字体大小计算
const getTitleFontSize = () => {
  const size = getChartSize()
  // 基于容器高度计算更准确
  const baseSize = size.height * 0.06
  return Math.max(14, Math.min(24, baseSize))
}

// 3. 构建完整的图表配置
const getChartOption = () => {
  return {
    title: {
      text: '谣言识别',
      textStyle: {
        fontSize: getTitleFontSize(),
        fontWeight: 400,
        color: 'rgba(255, 255, 255, 1)',
      },
      left: 'center',
      top: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => `${params.marker}${params.data.legendname}<br/>占比：${params.percent}`,
    },
    series: [
      {
        name: '谣言识别',
        type: 'pie',
        radius: ['58%', '76%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderWidth: 0,
          borderColor: 'transparent',
          shadowBlur: 20,
          shadowColor: 'rgba(85, 169, 224, 1)',
        },
        label: { show: false },
        labelLine: { show: false },
        data: m2R2Data.value,
      },
    ],
  }
}

const m2R2Data = computed(() => {
  if (!props.circleArray?.length) return []
  const total = props.circleArray.reduce((sum, item) => sum + item.num, 0)
  return props.circleArray.map((item, index) => ({
    value: item.num,
    percent: ((item.num / total) * 100).toFixed(2) + '%',
    legendname: item.category,
    name: `${item.category} ${((item.num / total) * 100).toFixed(2)}%`,
    itemStyle: { color: colors[index % colors.length] },
  }))
})

// 4. 确保resize处理正确
const handleResize = () => {
  if (myChart) {
    myChart.setOption(getChartOption(), true) // 强制更新所有配置
    myChart.resize()
  }
}

// 5. 使用防抖优化性能
let resizeTimer = null
const debouncedResize = () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(handleResize, 100)
}

watch(
  () => props.circleArray,
  () => {
    if (myChart) {
      myChart.setOption(getChartOption())
    }
  },
  { immediate: true },
)

onMounted(() => {
  myChart = echarts.init(circleRef.value)
  myChart.setOption(getChartOption())
  window.addEventListener('resize', debouncedResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', debouncedResize)
  if (myChart) {
    myChart.dispose()
    myChart = null
  }
})
</script>

<template>
  <div id="circle" ref="circleRef" style="width: 82%; height: 77%; margin-left: 8%"></div>
</template>
s
<style>
#circle {
  height: 100%;
  width: 100%;
  position: relative; /* 确保尺寸计算准确 */
  overflow: hidden; /* 防止内容溢出影响尺寸 */
}
</style>
