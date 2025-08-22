<script setup>
import * as echarts from 'echarts'
import axios from 'axios'
import { onMounted, onUnmounted, ref } from 'vue'
import chinaGeoJSON from '@/assets/中华人民共和国 (2).json'
import 'echarts-gl' //3D地图插件
const props = defineProps({
  datas: {
    type: Array,
    required: true,
  },
})

let myChart = null // 添加这行保存图表实例

const currentDistance = ref(100) // 初始设置的距离

// 定义7个颜色层次
const areaColors = [
  // 'rgba(67, 207, 124, 1)', // 第六层 - 绿色
  // 'rgba(56, 224, 182, 1)', // 第五层 - 蓝绿色
  // 'rgba(56, 222, 224, 1)', // 第四层 - 青色
  // 'rgba(123, 171, 227, 1)', // 第三层 - 天蓝色
  // 'rgba(88, 142, 204, 1)', // 第二层 - 浅蓝色
  // 'rgba(56, 135, 224, 1)', // 第一层 - 蓝色
  'rgba(56, 135, 224, 1)', // 第一层 - 蓝色
  'rgba(88, 142, 204, 1)', // 第二层 - 浅蓝色
  'rgba(123, 171, 227, 1)', // 第三层 - 天蓝色
  'rgba(56, 222, 224, 1)', // 第四层 - 青色
  'rgba(56, 224, 182, 1)', // 第五层 - 蓝绿色
  'rgba(67, 207, 124, 1)', // 第六层 - 绿色
]

// 省份数据
const getRandomValue = () => Math.floor(Math.random() * 500000 + 100000) // 随机值范围

// 修改省份数据部分，替换原来的随机数生成
const mapData = [
  { name: '全国', value: 12 }, // 全国设为中间值50
  { name: '北京市', value: 30, coordinate: [116.407396, 39.9042] },
  { name: '天津市', value: 21, coordinate: [117.190182, 39.125596] },
  { name: '河北省', value: 15, coordinate: [114.502461, 38.045474] },
  { name: '山西省', value: 13, coordinate: [112.549248, 37.857014] },
  { name: '内蒙古自治区', value: 10, coordinate: [111.670801, 40.818311] },
  { name: '辽宁省', value: 16, coordinate: [123.429096, 41.796768] },
  { name: '吉林省', value: 13, coordinate: [126.574217, 43.879362] },
  { name: '黑龙江省', value: 11, coordinate: [126.642464, 45.756967] },
  { name: '上海市', value: 21, coordinate: [121.473701, 31.230416] },
  { name: '江苏省', value: 20, coordinate: [118.767413, 32.041544] },
  { name: '浙江省', value: 17, coordinate: [120.153576, 30.287459] },
  { name: '安徽省', value: 15, coordinate: [117.283042, 31.861228] },
  { name: '福建省', value: 17, coordinate: [119.296982, 26.074508] },
  { name: '江西省', value: 16, coordinate: [115.892151, 28.676493] },
  { name: '山东省', value: 16, coordinate: [117.000923, 36.675807] },
  { name: '河南省', value: 15, coordinate: [113.665412, 34.757975] },
  { name: '湖北省', value: 16, coordinate: [114.298572, 30.584355] },
  { name: '湖南省', value: 16, coordinate: [112.982279, 28.19409] },
  { name: '广东省', value: 21, coordinate: [113.280637, 23.125178] },
  { name: '广西壮族自治区', value: 12, coordinate: [108.327545, 22.815003] },
  { name: '海南省', value: 11, coordinate: [110.33119, 20.031971] },
  { name: '重庆市', value: 17, coordinate: [106.504962, 29.533155] },
  { name: '四川省', value: 15, coordinate: [104.064857, 30.659462] },
  { name: '贵州省', value: 10, coordinate: [106.713478, 26.578342] },
  { name: '云南省', value: 11, coordinate: [102.710002, 25.045396] },
  { name: '西藏自治区', value: 7, coordinate: [91.132212, 29.664907] },
  { name: '陕西省', value: 16, coordinate: [108.948024, 34.263161] },
  { name: '甘肃省', value: 10, coordinate: [103.826309, 36.059987] },
  { name: '青海省', value: 9, coordinate: [101.778915, 36.617144] },
  { name: '台湾省', value: 9, coordinate: [101.778915, 36.617144] },
  { name: '香港特别行政区', value: 16, coordinate: [106.278179, 38.46637] },
  { name: '澳门特别行政区', value: 9, coordinate: [106.278179, 38.46637] },
  { name: '宁夏回族自治区', value: 11, coordinate: [106.278179, 38.46637] },
  { name: '新疆维吾尔自治区', value: 10, coordinate: [87.616848, 43.825592] },
]

// 准备regions数据
const regionsData = mapData.map((item) => ({
  name: item.name,
  label: {
    show: true, // 确保显示
    textStyle: {
      color: '#FFF', // 白色
      fontSize: 12,
      fontWeight: 'bold',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
  },
  itemStyle: {
    color: '#348FE5', // 默认颜色
  },
}))

// 获取最小值和最大值
let min, max
function getMinAndMax() {
  min = mapData[1].value // 从第一个省份开始，跳过"全国"
  max = mapData[1].value
  mapData.slice(1).forEach((city) => {
    if (city.value < min) min = city.value
    if (city.value > max) max = city.value
  })
}
getMinAndMax()

// 根据value值设置颜色层次
function setAreaColor() {
  const range = (max - min) / 7 // 分成6个区间

  mapData.slice(1).forEach((city, i) => {
    const index = Math.min(
      Math.floor((city.value - min) / range),
      5, // 最大索引为5
    )
    regionsData[i + 1].itemStyle.color = areaColors[index]
  })
}
setAreaColor()

const chartMap = async () => {
  myChart = echarts.init(document.getElementById('mapEchart')) // 保存实例到变量

  await initMap(myChart, 'china', '100000')

  setTimeout(() => {
    myChart.dispatchAction({
      type: 'map3D.setView',
      alpha: 60,
      beta: 0,
      distance: currentDistance.value,
    })
  }, 100)

  // 添加窗口resize监听
  window.addEventListener('resize', handleResize)
}

const initMap = async (chartDOM, geoName, adcode) => {
  chartDOM.clear()
  const mapData = await getMapJSON(adcode, geoName)
  console.log(mapData.value)
  const option = getOption(geoName, mapData, currentDistance.value)
  chartDOM.setOption(option)
}

const getMapJSON = async (adcode = '100000', geoName) => {
  try {
    echarts.registerMap(geoName, chinaGeoJSON)

    // 创建省份名称到value的映射
    const provinceValueMap = {}
    mapData.forEach((item) => {
      provinceValueMap[item.name] = item.value
    })

    return chinaGeoJSON.features.map((item) => {
      const provinceName = item.properties.name
      return {
        value: {
          ...item.properties, // 保留原有properties
          count: provinceValueMap[provinceName] || 0, // 添加count字段，使用我们设定的值
        },
        name: provinceName,
      }
    })
  } catch (error) {
    console.error('加载地图数据失败:', error)
    return []
  }
}

// 添加resize处理函数
const handleResize = () => {
  if (myChart) {
    myChart.resize()
  }
}

const getOption = (geoName, mapData, distance) => {
  const seriesData = mapData.slice(1).map((item) => ({
    name: item.name,
    value: item.value, // 确保这里传递了value值
    itemStyle: {
      color: regionsData.find((r) => r.name === item.name)?.itemStyle.color || '#348FE5',
    },
  }))
  console.log(seriesData)
  return {
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        const value = params.data ? params.data.value : '无数据'
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
               ${value.count.toLocaleString()}
              </div>
            </div>`
      },
      backgroundColor: 'rgba(0, 0, 0, 0)',
      borderColor: 'rgba(0, 0, 0, 0)',
      borderWidth: 0,
      padding: 0,
    },
    geo3D: {
      zlevel: -100,
      show: true,
      map: geoName,
      regionHeight: 2,
      shading: 'realistic',
      emphasis: {
        label: {
          show: true,
          formatter: (params) => params.name,
          textStyle: {
            color: '#FF0000', // 悬停时标签也保持红色
            fontSize: 16,
            backgroundColor: 'rgba(0,0,0,0.7)',
          },
        },
        itemStyle: {
          color: '#FFA500', // 悬停颜色
          opacity: 0.9,
          borderWidth: 1,
          borderColor: '#00EBFF',
        },
      },
      itemStyle: {
        borderWidth: 1.5,
        borderColor: 'rgba(212, 237, 251, 1)', // 省份边缘线颜色
        opacity: 1,
      },
      label: {
        show: true,
        formatter: (params) => params.name,
        textStyle: {
          color: '#FFF',
          fontSize: 12,
          fontWeight: 'bold', // 加粗
          backgroundColor: 'rgba(0,0,0,0.5)', // 添加半透明背景
        },
      },
      realisticMaterial: {
        detailTexture: 'https://cdn.polyhaven.com/asset_img/primary/painted_concrete.png?height=780',
        textureTiling: 1,
        roughness: 1,
        metalness: 0,
        roughnessAdjust: 0,
      },
      light: {
        main: {
          color: '#fff',
          intensity: 5,
          shadowQuality: 'high',
          shadow: true,
          shadowQuality: 'medium',
          alpha: 55,
          beta: 10,
        },
        ambient: {
          intensity: 0.7,
        },
      },
      viewControl: {
        rotation: 0,
        distance: distance,
      },
      regions: regionsData.map((region) => ({
        ...region,
        label: {
          textStyle: {
            color: '#FF0000', // 确保每个区域的标签也是红色
          },
        },
      })),
    },
    series: [
      {
        zlevel: -10,
        type: 'map3D',
        map: geoName,
        data: mapData.slice(1).map((item) => ({
          name: item.name,
          value: item.value,
          itemStyle: {
            color: regionsData.find((r) => r.name === item.name)?.itemStyle.color || '#348FE5',
          },
        })),
        itemStyle: {
          borderColor: 'rgba(212, 237, 251, 1)', // 省份边缘线颜色
          borderWidth: 1,
        },
        emphasis: {
          label: {
            show: true,
            textStyle: {
              color: '#FFF', // 白色
              fontSize: 12,
              fontWeight: 'bold',
              backgroundColor: 'rgba(0,0,0,0.5)',
            },
          },
          itemStyle: {
            color: '#FFA500', // 悬停颜色
          },
        },
        shading: 'realistic',
        realisticMaterial: {
          detailTexture: './4.png',
          textureTiling: 2,
        },
      },
    ],
    visualMap: {
      min: min,
      max: max,
      text: ['高', '低'],
      realtime: false,
      calculable: true,
      inRange: {
        color: areaColors,
      },
      textStyle: {
        color: '#fff',
      },
    },
  }
}

onMounted(() => {
  chartMap()
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
  <div class="investment-screen">
    <div class="map-chart" id="mapEchart"></div>
  </div>
</template>

<style lang="scss" scoped>
.investment-screen {
  background: linear-gradient(180deg, rgba(62, 125, 117, 0.16) 0%, rgba(69, 131, 217, 0.03) 0%, rgba(56, 109, 194, 0.02) 100%);
  width: 1168px;
  height: 609px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.map-chart {
  width: 180%;
  height: 180%;
}
</style>
