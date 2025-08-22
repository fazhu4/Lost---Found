<template>
  <div style="width: 100%; height: 100%" id="container" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import 'echarts-wordCloud'

const chartContainer = ref(null)
let myChart = null

const props = defineProps({
  wordArrays: {
    type: Array,
    required: true,
  },
})

const arrayList = ref()

watch(
  () => props.wordArrays,
  (newValue) => {
    if (newValue) {
      arrayList.value = newValue
    }
  },
  {
    immediate: true,
  },
)

// 修正数据：确保所有 value 是数字类型
const JosnList = [
  { name: 'Jay', value: 1000 },
  { name: 'Nancy', value: 950 },
  { name: '生活', value: 900 },
  { name: '供热', value: 880 },
  { name: '供气', value: 850 },
  { name: '用水', value: 800 },
  { name: '供水', value: 780 },
  { name: '交通', value: 750 },
  { name: '城市', value: 720 },
  { name: '环境', value: 700 },
  { name: '房产', value: 680 },
  { name: '城建', value: 650 },
  { name: '社保', value: 620 },
  { name: '教育', value: 600 },
  { name: '安全', value: 580 },
  { name: '公交', value: 550 },
  { name: '出租', value: 520 },
  { name: '环卫', value: 500 },
  { name: '资源', value: 480 },
  { name: '粉尘', value: 450 },
  { name: '噪音', value: 420 },
  { name: '土地', value: 400 },
  { name: '物业', value: 380 },
  { name: '医疗', value: 350 },
  { name: '占道', value: 320 },
  { name: '农村', value: 300 },
  { name: '供电', value: 280 },
  { name: '房屋', value: 250 },
  { name: '空气', value: 220 },
  { name: '文化', value: 200 },
  { name: '拆迁', value: 180 },
  { name: '设施', value: 150 },
  { name: '燃气', value: 120 },
  { name: '执法', value: 100 },
  { name: '设备', value: 90 },
  { name: '政务', value: 80 },
  { name: '县区', value: 70 },
  { name: '经济', value: 60 },
  { name: '纠纷', value: 50 },
  { name: '监督', value: 40 },
  { name: '建设', value: 30 },
  { name: '开发', value: 20 },
  { name: '宏观', value: 15 },
  { name: '管理', value: 10 },
]

const baseColors = [
  'rgba(56, 135, 224, 1)', // 蓝色系
  'rgba(88, 142, 204, 1)', // 蓝青色
  'rgba(123, 171, 227, 1)', // 浅蓝色
  'rgba(56, 222, 224, 1)', // 青色
  'rgba(56, 224, 182, 1)', // 蓝绿色
  'rgba(67, 207, 124, 1)', // 绿色
]

const getRandomColor = () => {
  return baseColors[Math.floor(Math.random() * baseColors.length)]
}

const initChart = () => {
  if (!chartContainer.value) return

  myChart = echarts.init(chartContainer.value)

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      show: true,
      formatter: function (params) {
        return `${params.name}: ${params.value}`
      },
    },
    series: [
      {
        type: 'wordCloud',
        data: JosnList,
        gridSize: 4, // 更密集的网格
        drawOutOfBound: false,
        shrinkToFit: true, // 自动缩小以适应
        layoutAnimation: true,
        sizeRange: [12, 55],
        rotationRange: [-90, 90],
        rotationStep: 90,
        textPadding: 0,
        textStyle: {
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
          color: getRandomColor,
        },
        emphasis: {
          focus: 'self',
          textStyle: {
            shadowBlur: 10,
            shadowColor: '#333',
          },
        },
        data: arrayList.value,
      },
    ],
  }

  myChart.setOption(option)

  myChart.on('click', function (params) {
    window.open('https://www.baidu.com/s?wd=' + encodeURIComponent(params.name))
  })
}

const resizeChart = () => {
  if (myChart) {
    myChart.resize()
  }
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', resizeChart)
})

onBeforeUnmount(() => {
  if (myChart) {
    myChart.dispose()
    myChart = null
  }
  window.removeEventListener('resize', resizeChart)
})
</script>

<style scoped>
#container {
  display: flex;
  justify-content: center;
  margin-top: 26px;
  border-radius: 30px;
  overflow: hidden;
  margin-left: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* 添加阴影增强视觉效果 */
}
</style>
