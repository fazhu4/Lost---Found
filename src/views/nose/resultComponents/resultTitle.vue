<script setup>
import { ref, onMounted, watch } from 'vue'
import { collecting, concealCollect } from '@/api/nose.js'

const checkCollect = async () => {
  const res = await collecting({
    results_id: reportStatic.value.id,
  })
  console.log(res)
}

const concealCollects = async () => {
  const res = await concealCollect({
    results_id: reportStatic.value.id,
  })
  console.log(res)
}

const iconLists = ref([
  {
    id: 1,
    src: '/src/assets/result/Vector (1).png',
  },
  {
    id: 2,
    src: '/src/assets/result/分组 7.png',
  },
  {
    id: 3,
    src: '/src/assets/result/vector (2).png',
  },
])

const props = defineProps({
  list: {
    type: Object,
    required: true, // 如果需要，可以指定是否必需
  },
  types: {
    type: String,
    required: true, // 如果需要，可以指定是否必需
  },
})

const reportStatic = ref()

function formatTimestamp(timestamp) {
  const date = new Date(timestamp)

  const year = date.getFullYear()
  const month = date.getMonth() + 1 // 月份从 0 开始，需 +1
  const day = date.getDate()

  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')

  return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`
}

const createTime = ref('')

const collectState = ref()

watch(
  () => props.types,
  (newValue) => {
    if (newValue) {
      collectState.value = newValue
    }
  },
  {
    immediate: true,
  },
)

watch(
  () => props.list,
  (newValue) => {
    if (newValue) {
      reportStatic.value = newValue
      createTime.value = formatTimestamp(Number(newValue.time))
      console.log(newValue.time, createTime.value)
      console.log(newValue)
    }
  },
  {
    immediate: true,
  },
)

const collectStates = ref(true)

const changeState = (index) => {
  if (collectStates.value) {
    checkCollect()
  } else {
    concealCollects()
  }
  collectStates.value = !collectStates.value
}
</script>

<template>
  <div class="titles" v-if="reportStatic">
    <div class="titleBox">
      <div class="resultWord">谣言识别结果报告</div>
      <div class="resultIcon"></div>
    </div>
    <div class="timeBox">
      <div class="resultTime">生成时间：{{ createTime }}</div>
      <div class="says">检测结果仅供参考，具体以官方发布为准</div>
    </div>
    <div class="gapLine"></div>
    <div class="outBox">
      <div class="newBox">
        <div class="newWord">新闻标题：{{ reportStatic.title }}</div>
        <div class="newIcon"></div>
      </div>
      <div class="iconList" v-if="collectState === 'nose'">
        <div class="imgBox" v-if="collectStates">
          <img src="@/assets/result/Vector (1).png" alt="" class="imgs" @click="changeState()" />
        </div>
        <div class="imgBox" v-if="!collectStates">
          <img src="@/assets/result/收藏 -已收藏.png" alt="" class="imgs" @click="changeState()" />
        </div>
        <div class="imgBox">
          <img src="@/assets/result/分组 7.png" alt="" class="imgs" />
        </div>
        <div class="imgBox">
          <img src="@/assets/result/vector (2).png" alt="" class="imgs" />
        </div>
      </div>
    </div>
    <div class="newRegion">信息来源：{{ reportStatic.form }}&ensp;&ensp;新闻类别：{{ reportStatic.type }}</div>
  </div>
</template>

<style lang="scss" scoped>
.titles {
  width: 100%;
  height: 12%;
  margin-top: 47px;
  margin-left: 68px;
  position: relative;
  z-index: 1000;

  .titleBox {
    display: flex;
    align-items: center;
    gap: 2px;
    height: 20%;
    width: auto;

    .resultWord {
      min-width: 288px;
      height: 100%;
      display: flex;
      align-items: center;
      font-size: 36px;
      font-weight: 700;
      color: rgba(255, 255, 255, 1);
    }

    .resultIcon {
      width: 43px;
      height: 43px;
      background-image: url('@/assets/result/Double Arrow Right (2).png');
      background-repeat: no-repeat;
      background-size: contain;
      margin-top: 6px;
    }
  }

  .timeBox {
    width: 92%;
    margin-top: 12px;
    display: flex;
    justify-content: space-between;

    .resultTime {
      font-size: 18px;
      color: rgba(145, 145, 145, 1);
    }

    .says {
      font-size: 18px;
      color: rgba(145, 145, 145, 1);
    }
  }

  .gapLine {
    width: 92%;
    height: 0px;
    opacity: 0.3;
    margin-top: 12px;
    border: 1px solid rgba(221, 221, 221, 1);
  }

  .outBox {
    width: 100%;
    height: 13.8%;
    display: flex;
    margin-top: 17px;

    .newBox {
      display: flex;
      align-items: center;
      gap: 2px;

      .newWord {
        min-width: 200px;
        height: 30px;
        display: flex;
        align-items: center;
        font-size: 24px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
      }

      .newIcon {
        width: 29px;
        height: 29px;
        background-image: url('@/assets/result/Align - Left (1).png');
        background-repeat: no-repeat;
        background-size: contain;
      }
    }

    .iconList {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 127px;
      height: 29px;
      margin-left: 52px;

      .imgBox {
        width: 30px;
        height: 29px;

        .imgs {
          width: 30px;
          height: 29px;
        }
      }
    }

    .iconList > div:nth-child(2) {
      display: flex;
      align-items: center;

      .imgs {
        margin-top: 2px;
        width: 31px;
        height: 24px;
      }
    }

    .iconList > div:nth-child(3) {
      display: flex;
      align-items: center;

      .imgs {
        width: 30px;
        height: 24px;
      }
    }
  }

  .newRegion {
    width: auto;
    height: 6.9%;
    font-size: 18px;
    color: rgba(145, 145, 145, 1);
    margin-top: 8px;
    position: relative;
  }
}
</style>
