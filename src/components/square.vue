<script lang="ts" setup>
import { ref, onMounted, watch, nextTick, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import 'echarts-wordCloud'

const listValue = [
  { name: '微博', value: 38 }, // 头部平台（高）
  { name: '腾讯', value: 22 }, // 头部平台（高）
  { name: '小红书', value: 12 }, // 中高部平台
  { name: '知乎', value: 28 }, // 中部平台
  { name: '网易', value: 35 }, // 中低部平台
  { name: '百度', value: 18 }, // 低部平台
  { name: '今日头条', value: 32 }, // 尾部平台（低）
  { name: '搜狐', value: 10 }, // 尾部平台（最低）
]

const chartRef = ref(null)
let myChart = null

// 添加resize处理函数
const handleResize = () => {
  if (myChart) {
    myChart.resize()
  }
}

// 定义颜色数组
const colors = [
  'rgba(56, 135, 224, 1)', // 蓝色系
  'rgba(88, 142, 204, 1)', // 蓝青色
  'rgba(123, 171, 227, 1)', // 浅蓝色
  'rgba(56, 222, 224, 1)', // 青色
  'rgba(56, 224, 182, 1)', // 蓝绿色
  'rgba(67, 207, 124, 1)', // 绿色
  'rgba(51, 236, 198, 1)',
  'rgba(78, 198, 140, 1)',
]

// 创建 option 对象
const getOption = (data) => {
  return {
    color: colors,
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        return `<div
              style="
                width: 228px;
                height: 89px;
                opacity: 1;
                border-radius: 8px;
                background: rgba(60, 66, 84, 0.5);
                border: 1px solid rgba(60, 66, 84, 1);
                padding: 10px 10px 10px 10px;
              "
            >
              <div style="min-width: 208px; height: 17px; font-size: 14px; font-weight: 500; color: rgba(255, 255, 255, 1)">
               ${params.name}
              </div>
              <div style="width: 100%; height: 44px; font-size: 16px; color: rgba(255, 255, 255, 1);display: flex;align-items:center;
                  justify-content: center;">
               ${params.value}
              </div>
            </div>`
      },
      backgroundColor: 'rgba(0, 0, 0, 0)',
      borderColor: 'rgba(0, 0, 0, 0)',
      borderWidth: 0,
      padding: 0,
    },
    legend: {
      data: data.map((item) => item.name),
      icon: 'rect',
      top: 10,
      right: '6%',
      itemGap: 20,
      itemWidth: 12,
      itemHeight: 8,
    },
    grid: {
      left: '6%',
      right: '3%',
      top: '16%',
      bottom: 35,
    },
    xAxis: {
      type: 'category',
      data: data.map((item) => item.name),
      axisTick: { alignWithLabel: true },
      axisLine: { show: false },
      axisLabel: {
        color: 'rgba(255, 255, 255, 1)',
        fontSize: 12,
        interval: 0,
        margin: 20,
        align: 'center',
      },
      emphasis: {
        axisLabel: {
          color: 'rgba(42, 130, 228, 1)',
        },
      },
    },
    yAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: 'rgba(255, 255, 255, 1)', fontSize: 14, margin: 2 },
      splitLine: { show: false, lineStyle: { type: 'dashed' } },
    },
    series: [
      {
        name: '谣言数据',
        type: 'bar',
        barWidth: '30%',
        itemStyle: {
          normal: {
            color: function (params) {
              return colors[params.dataIndex % colors.length]
            },
            shadowColor: 'rgba(0, 0, 0, 0)',
            shadowBlur: 0,
            borderRadius: 5,
            borderWidth: 0,
          },
          emphasis: {
            shadowColor: 'rgba(85, 169, 224, 1)',
            shadowBlur: 20,
          },
        },
        label: {
          show: false,
          position: 'top',
        },
        data: data.map((item) => item.value),
      },
    ],
  }
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  myChart = echarts.init(chartRef.value)
  updateChart()

  // 添加窗口resize监听
  window.addEventListener('resize', handleResize)
}

// 更新图表数据
const updateChart = () => {
  if (!myChart || !listValue) return

  const option = getOption(listValue)
  myChart.setOption(option, true)
}

// 监听props.list变化
// watch(
//   () => props.list,
//   (newVal) => {
//     if (newVal && newVal.length) {
//       updateChart()
//     }
//   },
//   { deep: true },
// )

onMounted(() => {
  updateChart()
  nextTick(() => {
    initChart()
  })
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
  <div ref="chartRef" id="regional" style="margin-left: 35px; margin-top: 39px; height: 69%; width: 86%"></div>
</template>

<style>
#regional {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}
</style>
