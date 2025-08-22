<script lang="ts" setup>
import * as echarts from 'echarts'
import 'echarts-wordCloud'
const chartRef = ref(null) // 创建一个 ref，用于引用图表容器
import { ref, onMounted, watch, onUnmounted } from 'vue' // 添加了onUnmounted

const props = defineProps({
  wordArrays: {
    type: Array,
    required: true,
  },
})

const arrayList = ref()
let myChart = null // 添加这行保存图表实例

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

// 添加resize处理函数
const handleResize = () => {
  if (myChart) {
    myChart.resize()
  }
}

onMounted(() => {
  const maskImage = new Image()
  maskImage.src = '/src/assets/index/b2.png'

  const option = {
    title: {
      x: 'center',
      textStyle: {
        fontSize: 23,
      },
    },
    backgroundColor: 'transparent',
    series: [
      {
        type: 'wordCloud',
        shape: 'rect',
        keepAspect: false,
        maskImage: null,
        left: 'center',
        top: 'center',
        width: '250px',
        height: '250px',
        right: null,
        bottom: null,
        sizeRange: [10, 60],
        rotationRange: [-30, 30],
        rotationStep: 1,
        gridSize: 6,
        drawOutOfBound: false,
        shrinkToFit: false,
        layoutAnimation: true,
        itemStyle: {
          normal: {
            borderColor: '#ff0000',
            borderWidth: 2,
            borderRadius: 100,
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        textStyle: {
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
          color: 'rgba(56, 135, 224, 1)',
        },
        emphasis: {
          focus: 'self',
          textStyle: {
            textShadowBlur: 10,
            textShadowColor: '#333',
          },
        },
        data: arrayList.value,
      },
    ],
  }

  maskImage.onload = () => {
    if (chartRef.value) {
      myChart = echarts.init(chartRef.value) // 保存实例到变量
      myChart.setOption(option)

      // 添加窗口resize监听
      window.addEventListener('resize', handleResize)
    }
  }
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
  <!-- 模板部分完全保持不变 -->
  <div ref="chartRef" style="width: 77%; height: 67%" id="container"></div>
</template>

<style>
/* 样式部分完全保持不变 */
#container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: 36px;
  margin-top: 26px;
  border-radius: 30px;
  overflow: hidden;
}
</style>
