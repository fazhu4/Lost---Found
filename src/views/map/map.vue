<script setup>
import * as echarts from 'echarts'
import geoJson from '@/assets/中华人民共和国.json'
import axios from 'axios'
import { ref, onMounted } from 'vue'

import 'echarts-gl' //3D地图插件
const mapEchart = ref(null)

const historyMapData = ref([])

// 定义初始距离
const currentDistance = ref(100) // 初始设置的距离

const chartMap = async () => {
  const myChart = echarts.init(document.getElementById('mapEchart'))

  await initMap(myChart, 'map', '100000')

  setTimeout(() => {
    myChart.dispatchAction({
      type: 'map3D.setView',
      alpha: 60,
      beta: 0,
      distance: currentDistance.value, // 使用 currentDistance 的值
    })
  }, 100)

  myChart.on('click', async (e) => {
    console.log(e)
    const newName = e.name
    if (e.value.level === 'district') return alert('该地区已经无法下钻')

    // 添加历史记录
    historyMapData.value.push(e.value)

    // 缩小地图视图
    currentDistance.value += 70 // 每次下钻减少距离

    await initMap(myChart, newName, e.value.adcode)

    console.log(currentDistance.value)
  })

  window.addEventListener('resize', () => {
    myChart.resize()
  })
}

const initMap = async (chartDOM, geoName, adcode) => {
  chartDOM.clear()

  const mapData = await getMapJSON(adcode, geoName)

  const option = getOption(geoName, mapData, currentDistance.value) // 将 currentDistance 传入

  chartDOM.setOption(option)
}

/**
 * 地图配置项
 */

// 请求地图 JSON 数据，并过滤成地图 data 配置项
const getMapJSON = async (adcode = '100000', geoName) => {
  const res = await axios.get(`https://geo.datav.aliyun.com/areas_v2/bound/${adcode}_full.json`)

  // 重新注册地图
  echarts.registerMap(geoName, res.data)

  // 过滤 JSON 数据
  const mapData = res.data.features.map((item) => {
    return {
      value: item.properties,
      name: item.properties.name,
    }
  })

  return mapData
}

// 图表生成配置项
const getOption = (geoName, mapData, distance) => {
  // 接受 distance 参数
  const option = {
    geo3D: {
      zlevel: -100,
      show: true,
      map: geoName,
      regionHeight: 2,
      shading: 'realistic',
      realisticMaterial: {
        detailTexture: './1.png', // 确保路径正确
      },
      // hover高亮颜色
      emphasis: {
        label: {
          formatter: function (params) {
            // console.log('hover', params)
            return params.name
          },
        },
        itemStyle: {
          color: '#1341BE',
          opacity: 0.9, // 透明度
          borderWidth: 1, //分界线宽度
          borderColor: '#00EBFF', //分界线颜色
        },
      },
      itemStyle: {
        borderWidth: 1.5,
        borderColor: 'skyblue',
        color: '#6597D0',
        opacity: 1,
      },
      label: {
        show: true,
        textStyle: {
          color: '#fff',
          fontSize: 40,
        },
        formatter: (e) => {
          return ` ${e.name} `
        },
      },
      realisticMaterial: {
        detailTexture: 'https://cdn.polyhaven.com/asset_img/primary/painted_concrete.png?height=780', // 纹理贴图
        textureTiling: 1, // 纹理平铺，1是拉伸，数字表示纹理平铺次数
        roughness: 1, // 材质粗糙度，0完全光滑，1完全粗糙
        metalness: 0, // 0材质是非金属 ，1金属
        roughnessAdjust: 0,
      },
      light: {
        //光照阴影
        main: {
          color: '#fff', //光照颜色
          intensity: 5, //光照强度
          shadowQuality: 'high', //阴影亮度
          shadow: true, //是否显示阴影
          shadowQuality: 'medium', //阴影质量 ultra //阴影亮度
          alpha: 55,
          beta: 10,
        },
        ambient: {
          intensity: 0.7,
        },
      },
      viewControl: {
        // alpha: 60,
        rotation: 0,
        distance: distance, // 使用传入的 distance
      },
    },
    series: [
      {
        zlevel: -10,
        type: 'map3D',
        map: geoName,
        data: mapData.map((item) => ({ ...item })),
        emphasis: {
          label: { show: true },
          itemStyle: {
            color: 'transparent',
          },
        },
        shading: 'realistic',
        realisticMaterial: {
          detailTexture: './4.png', // 确保路径正确
          textureTiling: 2,
        },
        itemStyle: {
          color: 'transparent',
          // 鼠标悬停时使其亮出颜色
        },
      },
    ],
  }
  return option
}

// 返回上级地图
const backMap = () => {
  currentDistance.value = 100
  console.log(historyMapData.value)
  if (historyMapData.value.length < 2) {
    currentDistance.value = 100 // 返回默认距离
  } else {
    currentDistance.value += 70 // 增加距离
  }

  const myChart = echarts.init(document.getElementById('mapEchart'))

  // 去除当前的地图信息
  historyMapData.value.pop()
  const len = historyMapData.value.length

  // 获取上一级的地图信息
  const newdata = historyMapData.value[len - 1]

  initMap(myChart, newdata?.name || 'map', newdata?.adcode || '100000')
}

/**
 * 生命周期
 */

onMounted(() => {
  // 挂载 echart
  chartMap()
})
</script>

<template>
  <div class="investment-screen">
    <svg
      style="position: absolute; left: 38px; top: 100px; cursor: pointer"
      @click="backMap"
      t="1681180771137"
      class="icon"
      viewBox="0 0 1024 1024"
      version="1.5"
      xmlns="http://www.w3.org/2000/svg"
      p-id="3427"
      width="20"
      height="20"
    >
      <path
        d="M426.666667 384V213.333333l-298.666667 298.666667 298.666667 298.666667v-174.933334c213.333333 0 362.666667 68.266667 469.333333 217.6-42.666667-213.333333-170.666667-426.666667-469.333333-469.333333z"
        p-id="3428"
        fill="#ffffff"
      ></path>
    </svg>
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

  .icon {
    width: 40px;
    height: 40px;
    position: absolute;
    z-index: 1000;
  }
}

.map-chart {
  width: 180%;
  height: 180%;
  position: absolute;
  top: -230px;
  left: -420px;
}
</style>
