<script setup>
import { ref, onMounted, watch, computed, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  lists: {
    type: Object,
    required: true,
  },
})

const trustDatas = ref()
const textDatas = ref()
const imgDatas = ref()
const chart = ref(null)
let myChart = null

// 获取当前图表容器的尺寸
const getChartSize = () => {
  if (!chart.value) return { width: 0, height: 0 }
  return {
    width: chart.value.offsetWidth,
    height: chart.value.offsetHeight,
  }
}

// 根据图表大小计算标题字体大小
const getTitleFontSize = () => {
  const size = getChartSize()
  // 根据宽度或高度中的较小值计算字体大小
  const baseSize = Math.min(size.width, size.height) * 0.07 // 调整这个系数以获得最佳效果
  return Math.max(12, Math.min(24, baseSize)) // 限制最小12px，最大24px
}

const handleResize = () => {
  if (myChart) {
    const fontSize = getTitleFontSize()
    const option = myChart.getOption()

    // 更新标题样式
    option.title[0].textStyle = option.title[0].textStyle || {}
    option.title[0].textStyle.fontSize = fontSize

    myChart.setOption(option)
    myChart.resize()
  }
}

const trafficWay = computed(() => {
  const validData = [
    { value: trustDatas.value, name: '可信度' },
    { value: imgDatas.value, name: '图像真实度' },
    { value: textDatas.value, name: '文本因子' },
  ].filter((item) => item.value !== null && !isNaN(item.value))

  const sum = validData.reduce((total, item) => total + Number(item.value), 0)

  return validData.map((item) => ({
    name: item.name,
    value: sum === 0 ? 0 : Math.round((Number(item.value) / sum) * 1000),
  }))
})

watch(
  () => props.lists,
  (newValue) => {
    if (newValue) {
      trustDatas.value = newValue.reliability
      textDatas.value = newValue.text_factor
      imgDatas.value = newValue.image_factor
    }
  },
  { immediate: true },
)

onMounted(() => {
  myChart = echarts.init(chart.value)
  const color = ['rgba(67, 207, 124, 1)', 'rgba(0, 121, 250, 0.7)', 'rgba(0, 250, 246, 0.7)']

  const data2 = []
  for (let i = 0; i < 5; i++) {
    data2.push(
      {
        value: 20,
        itemStyle: { color: 'rgba(67, 207, 124, 1)' },
      },
      {
        value: 1,
        itemStyle: { color: 'rgba(0, 0, 0, 0)' },
      },
    )
  }

  watch(
    trafficWay,
    (newVal) => {
      const data = newVal.map((item, i) => ({
        value: item.value,
        name: item.name,
        itemStyle: {
          color: color[i],
          borderColor: color[i],
          borderWidth: 5,
          shadowBlur: 20,
          shadowColor: color[i],
        },
        label: {
          show: true,
          position: 'outer',
          alignTo: 'none',
          distanceToLabelLine: 1,
          formatter: (params) => {
            const name = params.name
            const percent = params.percent
            const wrappedName = name.replace(/(.{2})/g, '$1\n')
            return `${wrappedName}${percent}%`
          },
          textStyle: {
            color: '#fff',
            fontSize: 12,
            width: 85,
            overflow: 'break',
          },
        },
        labelLine: {
          show: true,
          lineStyle: { color: color[i] },
        },
      }))

      const option = {
        color: color,
        title: {
          text: '识别结果',
          top: '45%',
          left: '37%',
          textStyle: {
            color: '#fff',
            fontSize: getTitleFontSize(), // 初始字体大小
            fontWeight: '400',
          },
        },
        series: [
          {
            type: 'pie',
            radius: ['78%', '75%'],
            center: ['49%', '50%'],
            data: data,
          },
          {
            type: 'pie',
            radius: ['60%', '63%'],
            center: ['49%', '50%'],
            hoverAnimation: false,
            label: { show: false },
            labelLine: { show: false },
            data: data2,
          },
        ],
      }

      myChart.setOption(option)
      handleResize()
    },
    { immediate: true },
  )

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (myChart) {
    myChart.dispose()
  }
})
</script>

<template>
  <div id="container">
    <div ref="chart" style="width: 100%; height: 100%"></div>
  </div>
</template>

<style>
#container {
  height: 100%;
  width: 130%;
  display: flex;
  align-items: center;
}
</style>
