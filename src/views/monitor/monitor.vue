<script setup>
import { ref, onMounted } from 'vue'
import secondTitle from './components/secondTittle.vue'
import kindStatic from './components/kindStatic.vue'
import { monitoring, monitorHistory, monitorLists, deleteFal, deleteRig } from '@/api/monitor.js'
import { ElMessage } from 'element-plus'
import { useResultStore } from '@/stores'
import { useRouter } from 'vue-router'
import { Delete } from '@element-plus/icons-vue'

const router = useRouter()
const usingResult = useResultStore()

onMounted(() => {
  // getMonitorHistory()
})

const pageType = ref('monitor')

const navigateTo = (item) => {
  usingResult.setResult('results')
  router.push({
    path: '/nose',
    query: { id: item.id, type: pageType.value },
  })
}

const formatDate = (timestamp) => {
  const date = new Date(timestamp)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // 月份补零
  const day = String(date.getDate()).padStart(2, '0') // 日期补零

  return `${year}.${month}.${day}`
}

const toPercentage = (decimal) => {
  // 乘以100后四舍五入取整
  return Math.round(decimal * 100) + '%'
}

const allList = ref([])

// 当前页码
const currentPage = ref(1)
// 每页条数
const pageSize = ref(10)
// 是否没有更多数据
const noMoreData = ref(false)
// 获取数据函数
const loading = async () => {
  if (switchValue.value) {
    return
  } else {
    try {
      console.log(checkedKinds.value)
      const response = await monitorLists({
        limit: pageSize.value,
        page: currentPage.value,
        type: checkedKinds.value.toString(),
        keyword: input.value,
      })

      const newData = response.data
      console.log(newData)

      // 如果返回数据为空或不足一页，说明没有更多数据
      if (newData.length === 0 || (currentPage.value > 1 && newData.length < pageSize.value)) {
        noMoreData.value = true
      }

      // 如果是第一页，直接替换数据
      if (currentPage.value === 1) {
        allList.value = newData
        console.log(allList.value)
        monitorList.value = allList.value
      } else {
        // 否则追加数据
        allList.value = [...allList.value, ...newData]
        monitorList.value = allList.value
      }

      // 只有获取到数据才增加页码
      if (newData.length > 0) {
        currentPage.value++
      }
    } catch (error) {
      console.error('获取数据失败:', error)
    }
  }
}

const chooseKinds = () => {
  if (switchValue.value) {
    getMonitorHistory()
  } else {
    allList.value = []
    loading()
  }
}

const kindArray = ref()

const getMonitorHistory = async () => {
  console.log(input.value)
  if (checkedKinds.value.length === 12) {
    setTimeout(() => {
      switchValue.value = true
    }, 300)
    getMonitors()
  } else {
    setTimeout(async () => {
      switchValue.value = true
    }, 300)
    const res = await monitorHistory({ type: checkedKinds.value.toString(), keyword: input.value })
    console.log(res, 1)
    if (res.data.length) {
      const newData = res.data.monitoring_lists
      nowMonitors.value = res.data.monitoring_data
      nowMonitors.value = nowMonitors.value.map((item) => ({
        ...item,
        time: item.end_time,
        reliability: null,
      }))
      allList.value = [...nowMonitors.value, ...newData]
    } else {
      allList.value = res.data
    }
  }
}

const monitorList = ref()

const nowMonitors = ref()

const getMonitors = async () => {
  const ress = await monitorHistory({ type: '', keyword: '' })
  console.log(ress)
  const newData = ress.data.monitoring_lists
  nowMonitors.value = ress.data.monitoring_data
  nowMonitors.value = nowMonitors.value.map((item) => ({
    ...item,
    time: item.end_time,
    reliability: null,
  }))
  allList.value = [...nowMonitors.value, ...newData]
}

const getMonitor = async () => {
  const res = await monitoring({
    keyword: textarea.value,
    start_time: dataList.value[0],
    end_time: dataList.value[1],
    platform: JSON.stringify(checkedCities.value),
  })
  ElMessage({
    message: res.msg,
    type: 'success',
  })
  console.log(res)
  const ress = await monitorHistory({ type: '', keyword: '' })
  console.log(ress)
  const newData = ress.data.monitoring_lists
  nowMonitors.value = ress.data.monitoring_data
  nowMonitors.value = nowMonitors.value.map((item) => ({
    ...item,
    time: item.end_time,
    reliability: null,
  }))
  allList.value = [...nowMonitors.value, ...newData]
  switchValue.value = true
}

const textarea = ref('')

const value2 = ref('')

const checkedCities = ref()
const cities = ['新浪微博', '百度', '今日头条', '知乎', '腾讯新闻', '搜狐新闻', '小红书', '网易新闻']

const kinds = ['政治', '经济', '社会', '体育', '娱乐', '科技', '军事', '环保', '文化', '灾难', '健康', '其他']

const checkedKinds = ref(['政治', '经济', '社会', '体育', '娱乐', '科技', '军事', '环保', '文化', '灾难', '健康', '其他'])

const input = ref('')

const headInfos = ref([
  {
    id: 1,
    name: '可信度',
  },
  {
    id: 2,
    name: '关键词',
  },
  {
    id: 3,
    name: '标题',
  },
  {
    id: 4,
    name: '类别',
  },
  {
    id: 5,
    name: '来源',
  },
  {
    id: 6,
    name: '时间',
  },
])

const dataList = ref()

const dataChoose = (value) => {
  console.log(value)
  // 转换为时间戳对象
  const timestampObject = {}
  for (const key in value) {
    if (value.hasOwnProperty(key)) {
      timestampObject[key] = value[key].getTime()
    }
  }
  dataList.value = timestampObject
  console.log(dataList.value)
}

const reset = () => {
  textarea.value = ''
  checkedCities.value = []
}

const switchValue = ref(false)

const changeIndex = (e) => {
  console.log(e)
  if (e) {
    getMonitors()
    allList.value = nowMonitors.value
  } else {
    allList.value = monitorList.value
  }
}

const deletList = async (item, index) => {
  console.log(item)

  if (item.uid) {
    const res = await deleteFal({ id: item.id })
    console.log(res, 2)
    if (res.code === 200) {
      allList.value.splice(index, 1)
    }
  } else {
    const res = await deleteRig({ id: item.id, result_id: item.result_id })
    console.log(res, 1)
    if (res.code === 200) {
      allList.value.splice(index, 1)
    }
  }
}
</script>

<template>
  <div class="contain">
    <div class="leftContent">
      <div class="circleBg"></div>
      <div class="topTitle">
        <div class="names">新增谣言监测内容</div>
        <div class="icons"></div>
      </div>
      <div class="gapLine"></div>
      <div class="titleBox">
        <secondTitle>
          <template #word>谣言监测关键词</template>
        </secondTitle>
      </div>
      <el-input v-model="textarea" :resize="'none'" type="textarea" placeholder="请在此输入文字" />
      <div class="titleSecondBox">
        <secondTitle>
          <template #word>谣言监测时间段</template>
        </secondTitle>
      </div>
      <div class="dates">时间段选择</div>
      <el-date-picker
        @change="dataChoose"
        v-model="value2"
        type="daterange"
        start-placeholder="Start Date"
        end-placeholder="End Date"
        class="jlpMySelect"
        :default-value="[new Date(2025, 2, 1), new Date(2025, 3, 1)]"
      />
      <div class="titleThirdBox">
        <secondTitle>
          <template #word>谣言监测平台选择</template>
        </secondTitle>
      </div>
      <el-checkbox-group v-model="checkedCities" :max="8">
        <el-checkbox @change="getType" v-for="city in cities" :key="city" :label="city" :value="city">
          {{ city }}
        </el-checkbox>
      </el-checkbox-group>
      <div class="bottomBox">
        <button class="repeat" @click="reset">重置</button>
        <button class="adds" @click="getMonitor">新增监测</button>
      </div>
    </div>
    <div class="rightContent">
      <div class="bg"></div>
      <div class="searchBox">
        <div class="searching">搜索</div>
        <el-input v-model="input" style="width: 529px; height: 29px" placeholder="请在此输入文字" />
      </div>
      <div class="kindBox">
        <div class="names">新闻类型</div>
        <div class="kinds">
          <el-checkbox-group v-model="checkedKinds" :max="12">
            <el-checkbox v-for="item in kinds" :key="item" :label="item" :value="item">
              {{ item }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="beginButton" @click="chooseKinds()">开始查询</div>
      </div>
      <div class="gapLines"></div>
      <div class="static">
        <div class="topInfo">
          <div class="nums">监测数据</div>
          <div class="say">
            <!-- <div class="circle"></div>
            <div class="names">监测数据数量</div> -->
          </div>
          <div class="times"></div>
        </div>
        <div class="middleInfo">
          <kindStatic></kindStatic>
        </div>
      </div>
      <div class="bottomList">
        <div class="titleBox">
          <div class="listTitle">监测列表</div>
          <div class="right">
            <el-switch @change="changeIndex" v-model="switchValue" class="ml-2" />
          </div>
        </div>
        <div class="listHead">
          <div class="headInfo" v-for="item in headInfos" :key="item.id">{{ item.name }}</div>
        </div>
        <div v-if="allList" v-infinite-scroll="loading" class="infinite-hotList" :infinite-scroll-distance="1" style="overflow: auto">
          <div class="infinite-hotList-item" v-for="(item, index) in allList" :key="index" @click="navigateTo(item)">
            <div class="percent">
              <div class="percentCircle">{{ toPercentage(item.reliability) }}</div>
            </div>
            <div class="lastStatic">
              <div class="lastItem">{{ item.keyword || '无' }}</div>
              <div class="lastItem">
                <div class="contents" v-if="item.title">{{ item.title || '无' }}</div>
                <div class="contents" v-else>{{ item.text || '无' }}</div>
              </div>
              <div class="lastItem">{{ item.category || '无' }}</div>
              <div class="lastItem">{{ item.form || '无' }}</div>
              <div class="lastItem">{{ formatDate(Number(item.time)) }}</div>
              <div class="deletes" v-if="switchValue">
                <el-button type="primary" @click.stop="deletList(item, index)" :icon="Delete" circle />
              </div>
            </div>
          </div>
        </div>
        <div class="block" v-else>
          <div class="centerBg"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.contain {
  width: 100%;
  height: 100%;
  display: flex;

  .leftContent {
    width: 30%;
    height: 93.6%;
    background-image: url('@/assets/monitor/Rectangle 860.png');
    background-size: cover;
    background-repeat: no-repeat;
    margin-top: 45px;
    margin-left: 47px;
    position: relative;
    overflow: hidden;

    .circleBg {
      position: absolute;
      left: -1029px;
      top: -886px;
      width: 1868px;
      height: 1868px;
      background-image: url('@/assets/monitor/圆形 1 (4).png');
      background-size: cover;
      background-repeat: no-repeat;
    }

    .topTitle {
      height: 30px;
      display: flex;
      align-items: center;
      margin-top: 32px;
      margin-left: 29px;

      .names {
        min-width: 192px;
        height: 30px;
        font-size: 24px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        display: flex;
        align-items: center;
      }

      .icons {
        width: 24px;
        height: 24px;
        background-repeat: no-repeat;
        background-size: contain;
        background-image: url('@/assets/monitor/Link 2 (1).png');
        margin-top: 5px;
      }
    }

    .gapLine {
      width: 480px;
      height: 0px;
      border: 2px solid rgba(221, 221, 221, 0.12);
      margin-top: 13px;
      margin-left: 29px;
    }

    .titleBox {
      margin-top: 29px;
      margin-left: 29px;
    }

    .el-textarea {
      position: relative; /* 确保伪元素相对于父元素定位 */
      background-color: transparent; /* 背景透明 */
      overflow: hidden; /* 确保伪元素的圆角不溢出 */
      margin-top: 12px;
      margin-left: 29px;
    }

    .el-textarea :deep(.el-textarea__inner) {
      width: 86%;
      height: 154px; /* 设置高度 */
      background-color: transparent; /* 背景透明 */
      border: 2px solid; /* 设置边框宽度 */
      border-image: linear-gradient(270deg, rgba(0, 186, 173, 0.6), rgba(42, 130, 228, 0.6)) 1; /* 渐变边框 */
      box-shadow: none; /* 去除阴影 */
      padding: 2px; /* 确保内容不紧贴边框 */
      position: relative; /* 确保伪元素相对于父元素定位 */
      z-index: 1; /* 确保内容在伪元素之上 */
      font-size: 12px;
      color: rgba(135, 135, 135, 1);
      padding-top: 16px;
      padding-left: 11px;
      padding-right: 11px;
    }

    .titleSecondBox {
      margin-top: 48px;
      margin-left: 29px;
    }

    .dates {
      min-width: 77px;
      height: 20px;
      margin-top: 35px;
      margin-left: 32px;
      font-size: 16px;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
    }

    :deep(.jlpMySelect) {
      width: 65%;
      height: 34px; /* 设置高度 */
      margin-top: 22px;
      margin-left: 32px;
      background-color: transparent; /* 背景透明 */
      border: 2px solid; /* 设置边框宽度 */
      border-image: linear-gradient(270deg, rgba(0, 186, 173, 0.6), rgba(42, 130, 228, 0.6)) 1; /* 渐变边框 */
      box-shadow: none; /* 去除阴影 */
      padding: 2px; /* 确保内容不紧贴边框 */
      position: relative; /* 确保伪元素相对于父元素定位 */
      z-index: 1; /* 确保内容在伪元素之上 */
      font-size: 12px;
      color: rgba(135, 135, 135, 1);
    }

    .titleThirdBox {
      margin-top: 50px;
      margin-left: 29px;
    }

    .el-checkbox-group {
      width: 75%;
      margin-left: 29px;
      margin-top: 29px;

      .el-checkbox {
        width: 83px;
        margin-right: 40px;
        margin-bottom: 15px;
      }
    }

    .bottomBox {
      width: 91%;
      margin-top: 60px;
      margin-left: 21px;
      position: relative;
      z-index: 1000;

      .repeat {
        width: 100%;
        height: 44px;
        border-radius: 25px;
        background: rgba(62, 73, 92, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        border: none;
      }

      .adds {
        width: 100%;
        height: 44px;
        border-radius: 25px;
        background: linear-gradient(270deg, rgba(0, 186, 173, 0.8) 0%, rgba(42, 130, 228, 0.8) 100%);
        box-shadow: 3px 3px 10px -1px rgba(11, 27, 102, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        margin-top: 12px;
        border: none;
      }
    }
  }

  .rightContent {
    width: 64.2%;
    height: 93.6%;
    background-image: url('@/assets/monitor/Rectangle 844.png');
    background-size: cover;
    background-repeat: no-repeat;
    margin-top: 45px;
    margin-left: 21px;
    position: relative;
    overflow: hidden;

    .bg {
      position: absolute;
      left: 225px;
      top: -39px;
      width: 1063px;
      height: 1063px;
      background-image: url('@/assets/monitor/01.png (5).png');
      background-repeat: no-repeat;
      background-size: contain;
      z-index: 1;
    }

    .searchBox {
      display: flex;
      height: 29px;
      gap: 60px;
      margin-top: 50px;
      margin-left: 29px;

      .searching {
        min-width: 30px;
        height: 29px;
        font-size: 16px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        display: flex;
        align-items: center;
      }

      .el-input {
        height: 29px;
        z-index: 1000;

        :deep(.el-input__wrapper) {
          position: relative; /* 确保伪元素相对于父元素定位 */
          background-color: transparent; /* 背景透明 */
          border: 2px solid transparent; /* 设置透明边框，确保布局不受影响 */
          box-shadow: none; /* 去除阴影 */
          display: flex;
          align-items: center;
          padding-left: 10px;
          overflow: hidden; /* 确保伪元素的圆角不溢出 */
        }

        :deep(.el-input__wrapper)::before {
          content: ''; /* 伪元素内容为空 */
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(270deg, rgba(0, 186, 173, 0.6) 0%, rgba(42, 130, 228, 0.6) 100%); /* 渐变 */
          z-index: -1; /* 将伪元素置于底层 */
          padding: 1px; /* 模拟边框 */
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0); /* 带前缀的 mask */
          -webkit-mask-composite: xor; /* 带前缀的 mask-composite */
          mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0); /* 标准属性 */
          mask-composite: exclude; /* 标准属性 */
        }

        :deep(.el-input__inner) {
          background-color: transparent; /* 输入框背景透明 */
          font-size: 12px;
          color: rgba(135, 135, 135, 1);
        }
      }
    }

    .kindBox {
      width: 91%;
      height: 61px;
      margin-top: 29px;
      margin-left: 29px;
      display: flex;
      align-items: center;
      position: relative;
      z-index: 1000;

      .names {
        font-size: 16px;
        font-weight: 500;
        line-height: 20px;
        color: rgba(255, 255, 255, 1);
      }

      .kinds {
        width: 762px;
        height: 100%;
        margin-left: 30px;

        .el-checkbox-group {
          width: 100%;

          .el-checkbox {
            width: 83px;
            margin-right: 40px;
            margin-bottom: 15px;
          }
        }
      }

      .beginButton {
        width: 174px;
        height: 44px;
        border-radius: 25px;
        background: linear-gradient(270deg, rgba(0, 186, 173, 1) 0%, rgba(42, 130, 228, 1) 100%);
        box-shadow: 3px 3px 10px -1px rgba(11, 27, 102, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
      }
    }

    .gapLines {
      width: 89.6%;
      height: 0px;
      opacity: 1;
      border: 1px solid rgba(221, 221, 221, 0.12);
      margin-top: 40px;
      margin-left: 61px;
    }

    .static {
      width: 91%;
      margin-top: 30px;
      margin-left: 24px;
      z-index: 100;
      position: relative;

      .topInfo {
        width: 100%;
        height: 31px;
        display: flex;
        justify-content: space-between;

        .nums {
          height: 31px;
          line-height: 31px;
          font-size: 16px;
          font-weight: 600;
          color: rgba(255, 255, 255, 1);
        }

        .say {
          width: 90px;
          height: 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .circle {
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background: rgba(30, 117, 255, 1);
          }

          .names {
            min-width: 60px;
            height: 28px;
            font-size: 14px;
            line-height: 28px;
            color: rgba(255, 255, 255, 1);
          }
        }

        .times {
          min-width: 90px;
          height: 31px;
          font-size: 18px;
          color: rgba(255, 255, 255, 1);
          line-height: 31px;
        }
      }

      .middleInfo {
        width: 100%;
        height: 225px;
      }
    }

    .bottomList {
      width: 91.5%;
      margin-top: 20px;
      margin-left: 29px;
      z-index: 1000;
      position: relative;

      .titleBox {
        width: 100%;
        display: flex;
        justify-content: space-between;

        .listTitle {
          font-size: 16px;
          font-weight: 600;
          color: rgba(255, 255, 255, 1);
          line-height: 23px;
        }

        .right {
          .el-select {
            position: relative; /* 确保伪元素相对于父元素定位 */
            background-color: transparent; /* 背景透明 */
            overflow: hidden; /* 确保伪元素的圆角不溢出 */
            margin-left: 29px;
          }

          :deep(.el-select__wrapper) {
            width: 172px;
            height: 35px; /* 设置高度 */
            background-color: transparent; /* 背景透明 */
            border: 2px solid; /* 设置边框宽度 */
            border-image: linear-gradient(270deg, rgba(0, 186, 173, 0.6), rgba(42, 130, 228, 0.6)) 1; /* 渐变边框 */
            box-shadow: none; /* 去除阴影 */
            padding: 2px; /* 确保内容不紧贴边框 */
            position: relative; /* 确保伪元素相对于父元素定位 */
            z-index: 1; /* 确保内容在伪元素之上 */
            font-size: 12px;
            color: rgba(135, 135, 135, 1);
            padding-left: 11px;
            padding-right: 11px;
          }
        }
      }

      .listHead {
        width: 100%;
        height: 42px;
        border-radius: 20px;
        background: rgba(35, 36, 43, 0.53);
        margin-top: 14px;
        display: flex;
        padding-left: 24px;

        .headInfo {
          width: 16.6%;
          height: 100%;
          display: flex;
          align-items: center;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.71);
        }
      }

      .infinite-hotList {
        width: 100%;
        height: 305px;
        margin-top: 20px;
        list-style: none;
        overflow: hidden;
        position: relative;
        z-index: 1000;

        .infinite-hotList-item {
          width: 100%;
          height: 59px;
          display: flex;
          align-items: center;
          margin-top: 15px;

          .percent {
            width: 18.5%;
            height: 59px;
            padding-left: 24px;

            .percentCircle {
              width: 59px;
              height: 59px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              background: rgba(32, 32, 41, 1);
              color: rgba(255, 255, 255, 1);
              font-size: 16px;
              border: 1px solid skyblue;
            }
          }

          .lastStatic {
            width: 82%;
            height: 59px;
            display: flex;

            .lastItem {
              width: 25%;
              height: 23px;
              font-size: 16px;
              color: rgba(255, 255, 255, 1);
              display: flex;
              align-items: center;
              line-height: 23px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
              margin-top: 18px;
              position: relative;

              .contents {
                width: 80%;
                height: 100%;
              }
            }

            .deletes {
              position: absolute;
              right: 20px;
              margin-top: 13px;
            }
          }
        }

        .infinite-hotList-item:hover {
          background: rgba(35, 36, 43, 0.53);
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

      .block {
        width: 100%;
        height: 305px;
        display: flex;
        align-items: center;
        justify-content: center;

        .centerBg {
          width: 229px;
          height: 182px;
          background-image: url('@/assets/monitor/分组 1 (4).png');
          background-repeat: no-repeat;
          background-size: contain;
        }
      }
    }
  }
}
</style>
