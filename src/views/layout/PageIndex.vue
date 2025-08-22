<script setup>
import { ref, onMounted, reactive } from 'vue'
import * as echarts from 'echarts'
import 'echarts-wordCloud'
import maps from '@/components/maps.vue'
import alltitle from '@/components/titles.vue'
import words from '@/components/words.vue'
import wordSencond from '@/components/word.vue'
import circles from '@/components/circle.vue'
import squares from '@/components/square.vue'
import lines from '@/components/line.vue'
import { nationalWord, nationalKinds, nationalHotList, nationalRegion, monitorHistory } from '@/api/index.js'

const historyLists = ref([])

const formatTimestamps = (timestamp) => {
  const date = new Date(timestamp)

  // 月份缩写
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  // 获取日期部分
  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()

  // 格式化时间部分（12小时制+AM/PM）
  let hours = date.getHours()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12 // 0点转为12
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${day} ${month} ${year} / ${hours}:${minutes}${ampm}`
}

const getHistory = async () => {
  const res = await monitorHistory({
    type: '',
    keyword: '',
  })
  console.log(res)
  historyLists.value = [...res.data.monitoring_lists, ...res.data.monitoring_data]
  console.log(historyLists.value.length)
}

const regionList = ref([])

const mapList = ref([])

// const getNational = async () => {
//   const res = await nationalRegion()
//   console.log(res)

//   // 确保res.data存在且是数组，然后取前8个元素
//   mapList.value = res.data
//   regionList.value = res.data

//   const processedData = regionList.value.map((item) => ({
//     ...item,
//     form: item.form.replace('新闻', ''),
//   }))

//   const nums = processedData.map((item) => item.num)
//   const minNum = Math.min(...nums)
//   const maxNum = Math.max(...nums)

//   // 要添加的新平台
//   const newPlatforms = ['微博', '网易', '搜狐', '腾讯', '百度', '今日头条', '知乎', '小红书']

//   // 生成随机数函数 (包含min和max)
//   const getRandomNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

//   // 为新平台创建数据
//   const newData = newPlatforms.map((platform) => ({
//     form: platform,
//     num: getRandomNum(minNum, maxNum),
//   }))

//   // 合并原数据和新数据
//   regionList.value = [...processedData, ...newData.map((item) => reactive(item))]

//   console.log(regionList.value)
// }

// 生成随机数据的函数 (适配图表yAxis.max:50)
function generateRandomData() {
  return Array.from({ length: 6 }, () => Math.floor(Math.random() * 40) + 10)
}

// 格式化数字
function formatNumber(num) {
  return parseInt(num).toLocaleString()
}

// 数据转换
function transformData(data) {
  return data.map((item, index) => ({
    id: `${Date.now()}-${index}`,
    names: item.text.length > 30 ? item.text.substring(0, 30) + '...' : item.text,
    counts: formatNumber(item.hot),
    data: generateRandomData(),
  }))
}

const hotLists = ref([])
const counts = ref(1)
const loading = ref(false)
const noMore = ref(false)
const baseColors = [
  'rgba(67, 207, 124, 1)', // 绿色
  'rgba(56, 224, 182, 1)', // 蓝绿色
  'rgba(56, 222, 224, 1)', // 青色
  'rgba(123, 171, 227, 1)', // 浅蓝色
  'rgba(88, 142, 204, 1)', // 蓝青色
  'rgba(56, 135, 224, 1)', // 蓝色系
  // 'rgba(56, 135, 224, 1)', // 蓝色系
  // 'rgba(88, 142, 204, 1)', // 蓝青色
  // 'rgba(123, 171, 227, 1)', // 浅蓝色
  // 'rgba(56, 222, 224, 1)', // 青色
  // 'rgba(56, 224, 182, 1)', // 蓝绿色
  // 'rgba(67, 207, 124, 1)', // 绿色
]

const getColor = (index) => {
  // 前6个直接使用基准色
  if (index < 6) return baseColors[index]

  // 后续项目随机选择一个基准色作为基础
  const baseColor = baseColors[Math.floor(Math.random() * baseColors.length)]

  // 生成相近颜色（轻微调整RGB值）
  return generateSimilarColor(baseColor)
}

// 生成相近颜色函数
function generateSimilarColor(baseColor) {
  // 提取RGB值
  const match = baseColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(,\s*[\d.]+)?\)/)
  if (!match) return baseColor

  const r = parseInt(match[1])
  const g = parseInt(match[2])
  const b = parseInt(match[3])

  // 随机微调RGB值（±20）
  const randomVariation = () => Math.floor(Math.random() * 41) - 20 // -20到+20

  const newR = Math.min(255, Math.max(0, r + randomVariation()))
  const newG = Math.min(255, Math.max(0, g + randomVariation()))
  const newB = Math.min(255, Math.max(0, b + randomVariation()))

  return `rgba(${newR}, ${newG}, ${newB}, 1)`
}
// 加载更多数据
const loadMore = async () => {
  if (loading.value || noMore.value) return

  loading.value = true
  try {
    const res = await nationalHotList({
      limit: 12,
      page: counts.value,
    })

    if (!res.data || res.data.length === 0) {
      noMore.value = true
      return
    }

    const newData = transformData(res.data)
    hotLists.value = [...hotLists.value, ...newData]
    counts.value += 1
  } finally {
    loading.value = false
  }
}

const wordList = ref()
const getWord = async () => {
  const res = await nationalWord()
  console.log(res)
  wordList.value = res.data
}

const kindList = ref()

const getKinds = async () => {
  const res = await nationalKinds()
  console.log(res)
  kindList.value = res.data
}

onMounted(() => {
  getLastWeekDateRange()
  getWord()
  getKinds()
  // getNational()
  getHistory()
})

const count = ref(10)
const load = () => {
  count.value += 2
}

const value6 = ref('')

const value = ref('')

const options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]

const selectTitle = ref([
  {
    id: 1,
    name: '谣言话题',
  },
  {
    id: 2,
    name: '总热度',
  },
  {
    id: 3,
    name: '热度变化',
  },
])

const timeGap = ref()

function getLastWeekDateRange() {
  const today = new Date()
  const lastWeek = new Date(today)
  lastWeek.setDate(today.getDate() - 6) // 往前推 6 天（共 7 天）

  // 格式化日期为 YYYY.M.D
  const formatDate = (date) => {
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`
  }

  timeGap.value = `${formatDate(lastWeek)}-${formatDate(today)}`
  return `${formatDate(lastWeek)}-${formatDate(today)}`
}
</script>

<template>
  <div class="content">
    <div class="left">
      <div class="maps">
        <div class="bg"></div>
        <div class="titleBox">
          <alltitle>
            <template #titleName>全国谣言分布及数量</template>
            <template #time>生成时间：{{ timeGap }}</template>
          </alltitle>
        </div>
        <div class="say"></div>
        <div class="describ">高德地图 © 2025 Amap - GS(2024)1158</div>
        <maps :lists="mapList"></maps>
      </div>
      <div class="bottomInfo">
        <div class="test">
          <div class="testTitle">
            <alltitle>
              <template #titleName>用户自定义监测窗口</template>
              <template #time>生成时间：{{ timeGap }}</template>
            </alltitle>
          </div>
          <div v-if="historyLists.length != 0" v-infinite-scroll="load" class="infinite-list" style="overflow: auto">
            <div v-for="(item, index) in historyLists" :key="index" class="infinite-list-item">
              <div class="select">
                <div class="selectInline"></div>
              </div>
              <div class="selectTitle">{{ item.title || '正在检测中' }}</div>
              <div class="selectTime">{{ formatTimestamps(Number(item.time || item.end_time)) }}</div>
              <div class="circles"></div>
            </div>
          </div>
          <div class="block" v-else>
            <div class="centerBg"></div>
          </div>
        </div>
        <div class="word">
          <div class="wordTitle">
            <alltitle>
              <template #titleName>全国谣言词云图</template>
              <template #time>生成时间：{{ timeGap }}</template>
            </alltitle>
          </div>
          <!-- <words v-if="wordList" :wordArrays="wordList"></words> -->
          <div class="wordBox"><wordSencond v-if="wordList" :wordArrays="wordList"></wordSencond></div>
        </div>
        <div class="kind">
          <div class="kindTitle">
            <alltitle>
              <template #titleName>全国谣言类别统计</template>
              <template #time>生成时间：{{ timeGap }}</template>
            </alltitle>
          </div>
          <circles v-if="kindList" :circleArray="kindList"></circles>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="hot">
        <div class="hotTitle">
          <alltitle>
            <template #titleName>全国谣言热榜</template>
            <template #time>生成时间：{{ timeGap }}</template>
          </alltitle>
        </div>
        <div class="selectOption">
          <div class="selectItem" v-for="(item, index) in selectTitle" :key="index">
            <div class="selectTitle">{{ item.name }}</div>
            <div class="selectIcon"></div>
          </div>
        </div>
        <div v-infinite-scroll="loadMore" class="infinite-hotList" :infinite-scroll-distance="5" style="overflow: auto">
          <div v-for="(item, index) in hotLists" :key="index" class="infinite-hotList-item">
            <div class="color" :style="{ backgroundColor: getColor(index) }"></div>
            <div class="names">
              <div class="nameBox">{{ item.names }}</div>
            </div>
            <div class="hotStatic">{{ item.counts }}</div>
            <div class="changing">
              <lines :datas="item.data"></lines>
            </div>
          </div>
        </div>
      </div>
      <div class="region">
        <div class="regionTitle">
          <alltitle>
            <template #titleName>全国谣言来源统计</template>
            <template #time>生成时间：{{ timeGap }}</template>
          </alltitle>
        </div>
        <squares></squares>
        <div class="selectMonth"></div>
      </div>
    </div>
  </div>
</template>

<style>
.content {
  flex: 1;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .left {
    width: 1168px;
    height: 92.7%;
    margin-left: 30px;
    margin-right: 22px;

    .maps {
      width: 100%;
      height: 609px;
      border-radius: 20.75px;
      background-image: url('@/assets/index/背景框.png');
      background-repeat: no-repeat;
      background-size: cover;
      overflow: hidden;
      position: relative;

      .bg {
        position: absolute;
        left: -739px;
        top: -739px;
        width: 1478px;
        height: 1478px;
        border-radius: 50%;
        background: radial-gradient(35.66% 35.66% at 50% 50%, rgba(0, 186, 173, 0.22) 0%, rgba(42, 130, 228, 0) 100%);
      }

      .describ {
        z-index: 1000;
        min-width: 636px;
        height: 15px;
        position: absolute;
        left: 15px;
        bottom: 13px;
        font-size: 12px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.9);
      }

      .titleBox {
        z-index: 1000;
        position: absolute;
        left: 38px;
        top: 29px;
      }

      .say {
        width: 50px;
        height: 200px;
        position: absolute;
        background-image: url('@/assets/index/谣言数量层级.svg');
        background-repeat: no-repeat;
        background-size: contain;
        left: 20px;
        bottom: 20px;
      }
    }

    .bottomInfo {
      width: 100%;
      height: 373px;
      display: flex;
      gap: 22px;
      margin-top: 27px;

      .test {
        width: 463px;
        height: 373px;
        opacity: 1;
        background-image: url('@/assets/index/矩形 9 (1).png');
        background-repeat: no-repeat;
        background-size: cover;

        .testTitle {
          margin-top: 19px;
          margin-left: 27px;
        }

        .infinite-list {
          width: 412px;
          height: 268px;
          margin-left: 27px;
          margin-top: 10px;
          list-style: none;

          .infinite-list-item {
            height: 71px;
            width: 380px;
            border-bottom: 1px solid rgba(136, 162, 209, 1);
            position: relative;

            .select {
              width: 22px;
              height: 22px;
              border-radius: 4px;
              background: rgba(184, 210, 222, 0.3);
              border: 1px solid rgba(162, 196, 212, 1);
              position: absolute;
              top: 15px;
              left: 0;
              display: flex;
              justify-content: center;
              align-items: center;

              .selectInline {
                width: 13px;
                height: 13px;
                border-radius: 2px;
                background: linear-gradient(180deg, rgba(4, 150, 255, 1) 0%, rgba(40, 181, 224, 1) 100%);
              }
            }

            .selectTitle {
              min-width: 174px;
              height: 23px;
              font-size: 16px;
              color: rgba(114, 118, 119, 1);
              display: flex;
              flex-direction: column; /* 设置主轴方向为列（纵向） */
              justify-content: flex-start;
              position: absolute;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
              top: 10px;
              left: 35px;
            }

            .selectTime {
              min-width: 120px;
              height: 23px;
              font-size: 10px;
              font-weight: 500;
              color: rgba(105, 109, 110, 1);
              position: absolute;
              left: 35px;
              top: 33px;
            }

            .circles {
              width: 9px;
              height: 9px;
              border-radius: 50%;
              position: absolute;
              bottom: 18px;
              right: 8px;
              background: rgba(85, 169, 224, 1);
            }
          }
        }

        .block {
          width: 100%;
          height: 268px;
          display: flex;
          align-items: center;
          justify-content: center;

          .centerBg {
            width: 190px;
            height: 151px;
            background-image: url('@/assets/index/分组 1 (3).png');
            background-repeat: no-repeat;
            background-size: contain;
          }
        }

        ::-webkit-scrollbar {
          width: 8px;
          border-radius: 100px;
          background: rgba(110, 110, 110, 0.12);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(46, 125, 117, 1);
          border-radius: 100px;
          border-radius: 3px;
        }
      }

      .word {
        width: 326px;
        height: 100%;
        opacity: 1;
        background-image: url('@/assets/index/矩形 6 (4).png');
        background-repeat: no-repeat;
        background-size: cover;

        .wordTitle {
          margin-top: 18px;
          margin-left: 26px;
        }

        .wordBox {
          width: 326px;
          height: 67%;
        }
      }

      .kind {
        width: 335px;
        height: 100%;
        opacity: 1;
        background-image: url('@/assets/index/矩形 8 (1).png');
        background-repeat: no-repeat;
        background-size: cover;
        overflow: hidden;
        .kindTitle {
          margin-left: 23px;
          margin-top: 18px;
        }
      }
    }
  }

  .right {
    width: 541px;
    height: 92.7%;
    margin-right: 51px;
    display: flex;
    flex-direction: column; /* 设置为纵向排列 */
    justify-content: space-between;
    position: relative;

    .hot {
      width: 100%;
      height: 537px;
      border-radius: 20.34px;
      background-image: url('@/assets/index/矩形 3.png');
      background-repeat: no-repeat;
      background-size: cover;
      position: absolute;
      top: 0;

      .hotTitle {
        margin-top: 29px;
        margin-left: 40px;
      }

      .selectOption {
        width: 470px;
        height: 22px;
        display: flex;
        margin-left: 45px;
        margin-top: 18px;

        .selectItem {
          height: 22px;
          display: flex;
          align-items: center;
          gap: 4px;

          .selectTitle {
            height: 22px;
            font-size: 14px;
            color: rgba(162, 193, 238, 1);
          }

          .selectIcon {
            width: 6px;
            height: 5px;
            background-image: url('@/assets/index/Path.png');
            background-repeat: no-repeat;
            background-size: contain;
          }
        }
      }

      .selectOption > div:nth-child(2) {
        margin-left: 180px;
      }

      .selectOption > div:nth-child(3) {
        margin-left: 69px;
      }

      .infinite-hotList {
        width: 470px;
        height: 69%;
        margin-left: 46px;
        margin-top: 20px;
        list-style: none;

        .infinite-hotList-item {
          width: 100%;
          height: 62px;
          border-top: 1px solid rgba(136, 162, 209, 0.5);
          display: flex;
          align-items: center;

          .color {
            width: 20px;
            height: 20px;
            border-radius: 5px;
            margin-left: 4px;
          }

          .names {
            width: 205px;
            height: 22px;
            margin-left: 15px;

            .nameBox {
              width: 135px;
              height: 22px;
              font-size: 14px;
              color: rgba(202, 223, 255, 1);
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }

          .hotStatic {
            width: 122px;
            height: 22px;
            font-size: 14px;
            color: rgba(202, 223, 255, 1);
            display: flex;
            align-items: center;
          }

          .changing {
            width: 91px;
            height: 26px;
          }
        }
      }

      ::-webkit-scrollbar {
        width: 8px;
        border-radius: 100px;
        background: rgba(110, 110, 110, 0.12);
      }
      ::-webkit-scrollbar-thumb {
        background: rgba(46, 125, 117, 1);
        border-radius: 100px;
        border-radius: 3px;
      }
    }

    .region {
      width: 100%;
      height: 454px;
      background-image: url('@/assets/index/矩形 5.png');
      background-repeat: no-repeat;
      background-size: cover;

      position: absolute;
      bottom: 0px;

      .regionTitle {
        margin-top: 26px;
        margin-left: 27px;
      }

      .selectMonth {
        width: auto;
        position: absolute;
        top: 37px;
        right: 69px;
        font-size: 13px;
        color: rgba(255, 255, 255, 1);
      }
    }
  }
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 93px;
  height: 100vh;
}
</style>
