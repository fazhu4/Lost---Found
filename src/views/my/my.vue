<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import { historyList, collectList, deletes, collectPercenalInfo } from '@/api/person.js'
import { useResultStore } from '@/stores'
import { useRouter } from 'vue-router'

const router = useRouter()
const usingResult = useResultStore()

onMounted(() => {
  getHistory()
  getCollectList()
  getPersonInfo()
})

const infoList = ref()

const getPersonInfo = async () => {
  const res = await collectPercenalInfo()
  infoList.value = res.data
  console.log(res)
}

const deletList = async (items, index) => {
  console.log(items.id)
  // const res = await deletes({
  //   id: String(items.id),
  // })
  allLists.value.splice(index, 1)
  // console.log(res)
}

const historyArray = ref()

const allLists = ref()

const getHistory = async () => {
  const res = await historyList()
  console.log(res)
  historyArray.value = res.data
  allLists.value = res.data
}

const collectArray = ref()

const getCollectList = async () => {
  const res = await collectList()
  console.log(res)
  collectArray.value = res.data
}

const personalInfo = ref([
  {
    id: 1,
    contents: '12345678',
  },
  {
    id: 2,
    contents: '2024年6月2日',
  },
  {
    id: 3,
    contents: '123456789@123.com',
  },
])

const value = ref('')

const options = [
  {
    value: 1,
    label: '识别记录',
  },
  {
    value: 2,
    label: '收藏记录',
    disabled: true,
  },
]

const counts = ref(10)
const loading = () => {
  counts.value += 2
}

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
  {
    id: 7,
    name: '删除',
  },
])

const changeIndex = (e) => {
  console.log(e)
  if (e === 1) {
    allLists.value = historyArray.value
  } else if (e === 2) {
    allLists.value = collectArray.value
  }
}

const toPercentage = (decimal) => {
  // 乘以100后四舍五入取整
  return Math.round(decimal * 100) + '%'
}

const formatDate = (timestamp) => {
  const date = new Date(timestamp)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // 月份补零
  const day = String(date.getDate()).padStart(2, '0') // 日期补零

  return `${year}.${month}.${day}`
}

const pageType = ref('mine')

const navigateTo = (item) => {
  usingResult.setResult('results')
  // console.log(pageType.value)
  router.push({
    path: '/nose',
    query: { id: item.id, type: pageType.value },
  })
}

const backLogin = () => {
  router.push({
    path: '/login',
  })
}
</script>

<template>
  <div class="contain">
    <div class="bg"></div>
    <div class="myInfos" v-if="infoList">
      <div class="titles">
        <div class="firstTitle">
          <div class="names">个人中心</div>
          <div class="icons"></div>
        </div>
        <div class="bottomTime">更新时间：2025.1.22</div>
      </div>
      <div class="personal">
        <div class="personBg"></div>
        <div class="personInfo">
          <div class="headBox">
            <div class="head"></div>
            <div class="names">用户名称</div>
          </div>
          <div class="staticInfo">
            <div class="staticItem">
              <div class="num">{{ infoList.collection }}</div>
              <div class="name">收藏</div>
            </div>
            <div class="gapLine"></div>
            <div class="staticItem">
              <div class="num">{{ infoList.rumor_monitoring }}</div>
              <div class="name">识别记录</div>
            </div>
            <div class="gapLine"></div>
            <div class="staticItem">
              <div class="num">{{ infoList.rumor_results }}</div>
              <div class="name">监测记录</div>
            </div>
          </div>
        </div>
        <div class="gaps"></div>
        <div class="setInfo">
          <div class="infoBox" v-for="(item, index) in personalInfo" :key="item.id">
            <template v-if="index === 0">账号ID: {{ infoList.account }}</template>
            <template v-if="index === 1">注册时间: {{ infoList.time }}</template>
            <template v-if="index === 2">账号邮箱: {{ infoList.email }}</template>
          </div>
          <div class="setButton">
            <div class="changeEmail">修改邮箱</div>
            <div class="backLogin" @click="backLogin">退出登录</div>
          </div>
        </div>
      </div>
    </div>
    <div class="history">
      <div class="topInfo">
        <div class="titles">
          <div class="firstTitle">
            <div class="names">个人中心</div>
            <div class="icons"></div>
          </div>
          <div class="bottomTime">更新时间：2025.1.22</div>
        </div>
        <div class="right">
          <el-select v-model="value" @change="changeIndex" placeholder="识别记录">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </div>
      <div class="bottomList">
        <div class="listHead">
          <div class="headInfo" v-for="item in headInfos" :key="item.id">{{ item.name }}</div>
        </div>
        <div v-infinite-scroll="loading" class="infinite-hotList" style="overflow: auto">
          <div class="infinite-hotList-item" v-for="(item, index) in allLists" :key="index" @click="navigateTo(item)">
            <div class="percent">
              <div class="percentCircle">{{ toPercentage(item.reliability) }}</div>
            </div>
            <div class="lastStatic">
              <div class="lastItem">{{ item.keyword || '无' }}</div>
              <div class="lastItem">
                <div class="contents" v-if="item.title">{{ item.title || '无' }}</div>
                <div class="contents" v-else>{{ item.text || '无' }}</div>
              </div>
              <div class="lastItem">{{ item.type || '无' }}</div>
              <div class="lastItem">{{ item.form || '无' }}</div>
              <div class="lastItem">{{ formatDate(Number(item.time)) }}</div>
              <div class="delete">
                <el-button type="primary" @click.stop="deletList(item, index)" :icon="Delete" circle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.contain {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  .bg {
    position: absolute;
    left: 855px;
    top: -55px;
    width: 1063px;
    height: 1063px;
    z-index: 1;
    background-image: url('@/assets/my/01.png (6).png');
    background-size: cover;
    background-repeat: no-repeat;
  }

  .myInfos {
    width: 95%;
    height: 37.3%;
    background-image: url('@/assets/my/Rectangle 585.png');
    background-repeat: no-repeat;
    background-size: cover;
    margin-top: 38px;
    margin-left: 55px;
    position: relative;
    overflow: hidden;

    .personBg {
      width: 440px;
      height: 440px;
      position: absolute;
      left: 621px;
      top: -30px;
      background-image: url('@/assets/my/user square.png');
      background-repeat: no-repeat;
      background-size: contain;
    }

    .titles {
      padding-top: 31px;
      margin-left: 43px;

      .firstTitle {
        display: flex;
        align-items: center;
        height: 30px;

        .names {
          min-width: 96px;
          height: 30px;
          font-size: 24px;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
          display: flex;
          align-items: center;
        }

        .icons {
          width: 30px;
          height: 30px;
          background-image: url('@/assets/my/Double Arrow Right (3).png');
          background-size: cover;
          background-repeat: no-repeat;
          margin-top: 3px;
        }
      }

      .bottomTime {
        min-width: 120px;
        height: 15px;
        display: flex;
        align-items: center;
        font-size: 14px;
        color: rgba(145, 145, 145, 1);
      }
    }

    .personal {
      width: 100%;
      height: 245px;
      display: flex;
      position: relative;
      z-index: 1000;

      .personInfo {
        width: 805px;
        height: 245px;
        display: flex;

        .headBox {
          width: 150px;
          margin-left: 120px;
          margin-top: 41px;

          .head {
            width: 150px;
            height: 150px;
            background-image: url('@/assets/my/分组 13.png');
            background-repeat: no-repeat;
            background-size: contain;
          }

          .names {
            width: 150px;
            height: 37px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 20px;
            color: rgba(255, 255, 255, 1);
            margin-top: 32px;
          }
        }

        .staticInfo {
          width: 530px;
          height: 101px;
          display: flex;
          margin-left: 54px;
          margin-top: 94px;

          .staticItem {
            width: 175px;
            height: 101px;

            .num {
              width: 100%;
              height: 53px;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 26px;
              font-weight: 600;
              color: rgba(255, 255, 255, 1);
            }

            .name {
              width: 100%;
              height: 37px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-top: 11px;
              font-size: 18px;
              color: rgba(255, 255, 255, 0.71);
            }
          }

          .gapLine {
            width: 0;
            height: 42.62px;
            border: 1px solid rgba(221, 221, 221, 1);
            margin-top: 28px;
          }
        }
      }

      .gaps {
        width: 241.24px;
        height: 0px;
        transform: rotate(90deg);
        border: 1px solid rgba(255, 255, 255, 0.22);
        margin-top: 148px;
        margin-left: 120px;
      }

      .setInfo {
        width: 339px;
        margin-top: 47px;

        .infoBox {
          min-width: 395px;
          height: 25px;
          display: flex;
          align-items: center;
          font-size: 20px;
          font-weight: 200;
          margin-bottom: 18px;
          color: rgba(255, 255, 255, 1);
        }

        .setButton {
          width: 339px;
          height: 39px;
          display: flex;
          justify-content: space-between;
          margin-top: 42px;

          .changeEmail {
            width: 157.27px;
            height: 39px;
            border-radius: 25px;
            background: linear-gradient(270deg, rgba(0, 186, 173, 1) 0%, rgba(42, 130, 228, 1) 100%);
            box-shadow: 3px 3px 10px -1px rgba(11, 27, 102, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
          }

          .backLogin {
            width: 157.27px;
            height: 39px;
            border-radius: 25px;
            background: rgba(62, 73, 92, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
          }
        }
      }
    }
  }

  .history {
    width: 95%;
    height: 53.1%;
    z-index: 1000;
    position: relative;
    background-image: url('@/assets/my/Rectangle 586.png');
    background-repeat: no-repeat;
    background-size: cover;
    margin-top: 20px;
    margin-left: 55px;

    .topInfo {
      width: 100%;
      height: 45px;
      display: flex;
      justify-content: space-between;

      .titles {
        margin-left: 43px;
        padding-top: 33px;

        .firstTitle {
          display: flex;
          align-items: center;
          height: 30px;

          .names {
            min-width: 96px;
            height: 30px;
            font-size: 24px;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            display: flex;
            align-items: center;
          }

          .icons {
            width: 30px;
            height: 30px;
            background-image: url('@/assets/my/Double Arrow Right (3).png');
            background-size: cover;
            background-repeat: no-repeat;
            margin-top: 3px;
          }
        }

        .bottomTime {
          min-width: 120px;
          height: 15px;
          display: flex;
          align-items: center;
          font-size: 14px;
          color: rgba(145, 145, 145, 1);
        }
      }

      .right {
        margin-top: 35px;
        margin-right: 48px;

        .el-select {
          position: relative; /* 确保伪元素相对于父元素定位 */
          background-color: transparent; /* 背景透明 */
          overflow: hidden; /* 确保伪元素的圆角不溢出 */
          margin-top: 12px;
          margin-left: 29px;
        }

        :deep(.el-select__wrapper) {
          width: 272px;
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

    .bottomList {
      width: 100%;
      margin-top: 62px;
      margin-left: 29px;

      .listHead {
        width: 96%;
        height: 42px;
        position: relative;
        border-radius: 20px;
        background: rgba(35, 36, 43, 0.53);
        margin-top: 14px;
        display: flex;
        padding-left: 24px;

        .headInfo {
          width: 14.3%;
          height: 100%;
          display: flex;
          align-items: center;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.71);
        }
      }

      .infinite-hotList {
        width: 96%;
        height: 305px;
        margin-top: 20px;
        list-style: none;
        overflow: hidden;

        .infinite-hotList-item {
          width: 100%;
          height: 59px;
          display: flex;
          align-items: center;
          margin-top: 15px;

          .percent {
            width: 15.6%;
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
            width: 84.4%;
            height: 59px;
            display: flex;

            .lastItem {
              width: 16.7%;
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

              .contents {
                width: 80%;
                height: 100%;
              }
            }

            .delete {
              width: 16.7%;
              height: 100%;
              display: flex;
              align-items: center;
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
    }
  }
}
</style>
