<script setup>
import { ref, onMounted, onUnmounted, onBeforeMount } from 'vue'
import fileContent from './handComponents/fileContent.vue'
import bottomInfo from './handComponents/bottomInfo.vue'
import resultTitle from './resultComponents/resultTitle.vue'
import smallTitle from './resultComponents/smallTitle.vue'
import noseResult from './resultComponents/noseResult.vue'
import noseWord from './resultComponents/noseWord.vue'
import emotion from './resultComponents/emotion.vue'
import loading from '@/components/loadingTwo.vue'
import { useImgStore, useResultStore } from '@/stores'
import { userNoseService, userBestNose, monitorStatic, myStatic } from '@/api/nose.js'
import 'animate.css'
import { ElMessage } from 'element-plus'
// 目标页面获取
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()

const usingResult = useResultStore()
onUnmounted(() => {
  usingResult.setResult('')
})

const getImg = useImgStore()

const textarea = ref('')

const options = ['腾讯新闻', '网易新闻', '搜狐新闻']
const checkedOptions = ref([])

const sendButton = ref(null)

const writeButton = ref(null)

const resultButton = ref(null)

const type = ref('handing')

const changeToWrite = () => {
  sendButton.value.classList.add('animate__animated', 'animate__fadeOut')
  sendButton.value.addEventListener('animationend', () => {
    type.value = 'handing'
    usingResult.setResult('')
    // nextIndex.value.classList.add('animate__animated', 'animate__fadeIn')
  })
}

const backToSend = () => {
  writeButton.value.classList.add('animate__animated', 'animate__fadeOut')
  writeButton.value.addEventListener('animationend', () => {
    type.value = 'sending'
    usingResult.setResult('')
    // nextIndex.value.classList.add('animate__animated', 'animate__fadeIn')
  })
}

const getSendResult = () => {
  sendButton.value.classList.add('animate__animated', 'animate__fadeOut')
  uploadSend()
  // sendButton.value.addEventListener('animationend', () => {

  //   // nextIndex.value.classList.add('animate__animated', 'animate__fadeIn')
  // })
}

const getHandResult = () => {
  if (!validateForms()) {
    return
  }
  type.value = 'loading'
  writeButton.value.classList.add('animate__animated', 'animate__fadeOut')
  uploadHands()
  inputs.value = ''
  // writeButton.value.addEventListener('animationend', () => {
  // type.value = 'results'
  // usingResult.setResult('results')
  // nextIndex.value.classList.add('animate__animated', 'animate__fadeIn')
  // })
}

const backToSending = () => {
  resultButton.value.classList.add('animate__animated', 'animate__fadeOut')
  resultButton.value.addEventListener('animationend', () => {
    type.value = 'sending'
    usingResult.setResult('')
    // nextIndex.value.classList.add('animate__animated', 'animate__fadeIn')
  })
}

const backToHanding = () => {
  resultButton.value.classList.add('animate__animated', 'animate__fadeOut')
  resultButton.value.addEventListener('animationend', () => {
    type.value = 'handing'
    usingResult.setResult('')
    // nextIndex.value.classList.add('animate__animated', 'animate__fadeIn')
  })
}

const inputs = ref('')

const select = ref('')

const handle = (val) => {
  select.value = val
}

const uploadHands = async () => {
  const res = await userNoseService({
    title: inputs.value,
    text: getImg.imgName.textarea,
    img_path: getImg.imgName.headerImg,
    comments: '',
    form: select.value,
  })
  if (res.code === 200) {
    type.value = 'results'
    usingResult.setResult('results')
  }
  console.log(res)
  resultStatic.value = res.data
  wordCloudData.value = convertWordCloudData(res.data.word_cloud_diagrams)
  console.log(wordCloudData.value)
  emotionData.value = convertEmotionData(parseEmotionFactor(res.data.emotion_factor).probabilities)
  console.log(emotionData.value)
}

const types = ref(1)

const changeIndex = (e) => {
  console.log(checkedOptions.value[0])
  if (checkedOptions.value[0] == '腾讯新闻') {
    types.value = 1
  } else if (checkedOptions.value[0] == '网易新闻') {
    types.value = 2
  } else if (checkedOptions.value[0] == '搜狐新闻') {
    types.value = 3
  }
}

const resultStatic = ref()

// 词云数据转换函数
function convertWordCloudData(rawString) {
  // 1. 移除开头和结尾的方括号
  const trimmed = rawString.slice(1, -1)

  // 2. 按"), "分割成单个条目
  const items = trimmed.split('), ')

  // 3. 处理每个条目
  return items.map((item) => {
    // 移除可能残留的括号
    const cleanItem = item.replace(/Wcd\(|\)/g, '')

    // 分割name和value
    const [namePart, valuePart] = cleanItem.split(', ')

    // 提取name和value的值
    const name = namePart.split('=')[1]
    const value = parseInt(valuePart.split('=')[1])

    return { name, value }
  })
}

// 情绪类型映射表（后端字段 -> 前端显示）
const emotionMap = {
  happiness: { type: '快乐', id: 1 },
  sadness: { type: '悲伤', id: 2 },
  anger: { type: '愤怒', id: 3 },
  fear: { type: '害怕', id: 4 },
  surprise: { type: '惊讶', id: 5 },
  disgust: { type: '厌恶', id: 6 },
  // like 对应前端的中性情绪
  like: { type: '中性', id: 7 },
}

// 七种情绪转换函数
function convertEmotionData(probabilities) {
  return Object.entries(probabilities).map(([key, value]) => {
    const percentValue = (value * 100).toFixed(2)
    return {
      id: emotionMap[key].id,
      type: emotionMap[key].type,
      date: '2023年10月', // 保持原有日期
      num: `${percentValue}%`,
      value: parseFloat(percentValue),
    }
  })
}

const showLinkError = ref(false)
const showSourceError = ref(false)

const validateForm = () => {
  // 重置错误状态
  showLinkError.value = false
  showSourceError.value = false

  // 验证链接
  if (!textarea.value.trim()) {
    showLinkError.value = true
  }

  // 验证来源
  if (checkedOptions.value.length === 0) {
    showSourceError.value = true
  }

  // 如果验证通过
  if (!showLinkError.value && !showSourceError.value) {
    type.value = 'loading'
    getSendResult()
  }
}

// 执行转换
const emotionData = ref()

// 执行转换
const wordCloudData = ref()

const uploadSend = async () => {
  const res = await userBestNose({
    url: textarea.value,
    type: types.value,
  })
  if (res.code === 200) {
    type.value = 'results'
    usingResult.setResult('results')
  }
  console.log(res)
  resultStatic.value = res.data
  wordCloudData.value = convertWordCloudData(res.data.word_cloud_diagrams)
  console.log(wordCloudData.value)
  emotionData.value = convertEmotionData(parseEmotionFactor(res.data.emotion_factor).probabilities)
  console.log(emotionData.value)
}

const getStatic = async (index) => {
  const res = await monitorStatic({
    id: index,
  })
  console.log(res)
  resultStatic.value = res.data
  wordCloudData.value = convertWordCloudData(resultStatic.value.word_cloud_diagrams)
  if (res.data.emotion_factor) {
    emotionData.value = convertEmotionData(parseEmotionFactor(resultStatic.value.emotion_factor).probabilities)
  }
  console.log(emotionData.value)
}

const getMyStatic = async (index) => {
  console.log(index)
  const res = await myStatic({
    results_id: index,
  })
  console.log(res)
  resultStatic.value = res.data
  wordCloudData.value = convertWordCloudData(resultStatic.value.word_cloud_diagrams)
  emotionData.value = convertEmotionData(parseEmotionFactor(resultStatic.value.emotion_factor).probabilities)
  console.log(emotionData.value)
}

const resultId = ref()

const parseEmotionFactor = (emotionFactorString) => {
  // 提取 predicted_emotion
  const predictedEmotionMatch = emotionFactorString.match(/predicted_emotion=([^,)]+)/)
  const predicted_emotion = predictedEmotionMatch ? predictedEmotionMatch[1] : null

  // 提取 probabilities 对象
  const probabilitiesMatch = emotionFactorString.match(/probabilities=\{(.+?)\}/)
  let probabilities = {}

  if (probabilitiesMatch) {
    const probString = probabilitiesMatch[1]
    const probPairs = probString.split(', ')

    probPairs.forEach((pair) => {
      const [key, value] = pair.split('=')
      if (key && value) {
        probabilities[key.trim()] = parseFloat(value)
      }
    })
  }

  return {
    predicted_emotion,
    probabilities,
  }
}

const collectState = ref()

onMounted(() => {
  // console.log(route.query.type)
  if (route.query.id) {
    if (route.query.type === 'monitor') {
      type.value = 'results'
      console.log(resultId.value)
      getStatic(resultId.value)
      usingResult.setResult('results')
    } else if (route.query.type == 'mine') {
      type.value = 'results'
      console.log('个人中心')
      getMyStatic(route.query.id)
      usingResult.setResult('results')
    }
  }
})

onBeforeMount(() => {
  // console.log(usingResult.result)
  collectState.value = route.query.type || 'nose'
  if (route.query.id) {
    if (route.query.type === 'monitor') {
      type.value = 'results'
      resultId.value = route.query.id
      console.log(resultId.value)
      getStatic(resultId.value)
    } else if (route.query.type === 'mine') {
      type.value = 'results'
      console.log(route.query.type)
      console.log(route.query.id)
      getMyStatic(route.query.id)
      usingResult.setResult('results')
    }
  }
})

function fixMultipleDots(text) {
  // 使用正则表达式匹配两个及以上的连续句号，替换为单个句号
  return text.replace(/\。{2,}/g, '。')
}

const fileContentValid = ref(false) // 文件/内容验证状态

// 接收fileContent组件的验证状态
const handleFileContentValidate = (isValid) => {
  fileContentValid.value = isValid
}

// 验证方法
const validateForms = () => {
  // 1. 验证必填的新闻标题
  if (!inputs.value || inputs.value.trim() === '') {
    ElMessage.error('新闻标题为必填项')
    return false
  }

  // 2. 验证必选其一的新闻内容或图片
  if (!fileContentValid.value) {
    ElMessage.error('请填写新闻文本内容或上传图片(至少一项)')
    return false
  }

  return true
}

const router = useRouter()

const backToLast = () => {
  router.back()
}
</script>

<template>
  <div class="noseContent">
    <div class="noseBg">
      <div class="send" ref="sendButton" v-if="type === 'sending'">
        <div class="rightBg"></div>
        <div class="titles">
          <div class="leftWord">快速进行谣言识别</div>
          <div class="rightIcon"></div>
        </div>
        <div class="tips">
          <div>请输入或粘贴新闻链接</div>
          <div>我们将分析内容 帮助您判断其真实性</div>
        </div>
        <div class="bottomLine"></div>
        <div class="secondTitle">
          <div class="topInfo">
            <div class="topWord">新闻页面链接上传</div>
            <div class="topIcon"></div>
          </div>
          <div class="tip">*此项为必填项</div>
        </div>
        <el-input v-model="textarea" :resize="'none'" type="textarea" placeholder="请在此粘贴链接" :class="{ 'error-border': showLinkError }" />
        <div v-if="showLinkError" class="error-message">请填写新闻链接</div>

        <div class="regions">
          <div class="regionWord">
            <div class="words">谣言来源</div>
            <div class="regionTip">*此项为必选项</div>
          </div>
          <div class="options">
            <el-checkbox-group v-model="checkedOptions" :max="1">
              <el-checkbox
                @change="changeIndex"
                v-for="option in options"
                :key="option"
                :label="option"
                :value="option"
                :class="{ 'error-checkbox': showSourceError }"
              >
                {{ option }}
              </el-checkbox>
            </el-checkbox-group>
            <div v-if="showSourceError" class="error-messages">请选择谣言来源</div>
          </div>
        </div>
        <div class="bottomButtons">
          <button class="leftButton" @click="changeToWrite">切换至手动输入信息</button>
          <button class="rightButton" @click="validateForm">生成报告</button>
        </div>
      </div>
      <div class="hand" ref="writeButton" v-if="type === 'handing'">
        <div class="bg"></div>
        <div class="title">
          <div class="word">
            <div class="leftWord">快速进行新闻识别</div>
            <div class="rightArrow"></div>
          </div>
        </div>
        <div class="newTitle">
          <div class="newWord">
            <div class="leftNew">新闻标题</div>
            <div class="newIcon"></div>
          </div>
          <div class="must">*此项为必填项</div>
        </div>
        <el-input v-model="inputs" style="width: 529px; height: 41px" placeholder="请在此输入文字" />
        <div class="contentImg">
          <div class="contentWord">新闻文本内容与图片</div>
          <div class="mustOne">*两项中必填一项</div>
        </div>
        <fileContent @validate="handleFileContentValidate"></fileContent>
        <bottomInfo @update="handle"></bottomInfo>
        <div class="buttons">
          <button class="leftButton" @click="backToSend">返回至上传链接</button>
          <button class="rightButton" @click="getHandResult">生成报告</button>
        </div>
      </div>
      <div class="result" ref="resultButton" v-if="usingResult.result === 'results'">
        <div class="bgs"></div>
        <resultTitle :types="collectState" :list="resultStatic"></resultTitle>
        <div class="contentWords">
          <smallTitle>
            <template #word>新闻识别内容</template>
          </smallTitle>
          <div class="newContent" v-if="resultStatic.text">
            {{ fixMultipleDots(resultStatic.text) }}
          </div>
        </div>
        <div class="otherStatic">
          <noseResult :list="resultStatic"></noseResult>
          <div class="firstLine"></div>
          <noseWord :wordList="wordCloudData"></noseWord>
          <div class="emotionKind">
            <div class="topInfo">情感分类分布图</div>
            <div class="staticContent" v-if="emotionData">
              <emotion :emotionArrays="emotionData"></emotion>
            </div>
          </div>
        </div>
        <div class="bottomReport">
          <smallTitle>
            <template #word>综合分析报告</template>
          </smallTitle>
          <div class="content">
            {{ fixMultipleDots(resultStatic.report) }}
          </div>
        </div>
        <div class="bottomButton">
          <div class="back" v-if="collectState === 'nose'" @click="backToSending">返回链接识别页面</div>
          <div class="again" v-if="collectState === 'nose'" @click="backToHanding">返回手动识别页面</div>
          <div class="backNavi" v-else @click="backToLast">返回列表</div>
        </div>
      </div>
      <loading v-if="type === 'loading'"></loading>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.noseContent {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;

  .noseBg {
    width: 95%;
    height: 94%;
    background-image: url('@/assets/nose/矩形 2 (1).png');
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 26.05px;
    position: relative;
    overflow: hidden;

    .send {
      width: 100%;
      height: 100%;
      position: relative;

      .rightBg {
        width: 1063px;
        height: 1063px;
        position: absolute;
        right: -122px;
        top: -188px;
        background-image: url('@/assets/nose/01.png (3).png');
        background-repeat: no-repeat;
        background-size: contain;
      }

      .titles {
        width: auto;
        height: 77px;
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 164px;
        margin-left: 86px;

        .leftWord {
          min-width: 460px;
          height: 77px;
          display: flex;
          align-items: center;
          font-size: 58px;
          font-weight: 600;
          color: rgba(255, 255, 255, 1);
        }

        .rightIcon {
          width: 65px;
          height: 65px;
          margin-top: 8px;
          background-image: url('@/assets/nose/Double Arrow Right (1).png');
          background-repeat: no-repeat;
          background-size: contain;
        }
      }

      .tips {
        min-width: 390px;
        height: auto;
        margin-top: 10px;
        margin-left: 93px;
        font-size: 24px;
        font-weight: 200;
        color: rgba(255, 255, 255, 1);
        line-height: 35.05px;
      }

      .bottomLine {
        width: 233px;
        height: 1px;
        background: rgba(204, 204, 204, 1);
        margin-top: 22px;
        margin-left: 93px;
      }

      .secondTitle {
        margin-top: 43px;
        margin-left: 93px;

        .topInfo {
          width: auto;
          height: 29px;
          display: flex;
          gap: 2px;
          align-items: center;

          .topWord {
            min-width: 192px;
            height: 29px;
            display: flex;
            align-items: center;
            font-size: 24px;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
          }

          .topIcon {
            width: 24px;
            height: 24px;
            background-image: url('@/assets/nose/Link 2.png');
            background-repeat: no-repeat;
            background-size: contain;
            margin-top: 5px;
          }
        }

        .tip {
          height: 14px;
          font-size: 14px;
          color: rgba(145, 145, 145, 1);
          line-height: 17px;
          margin-top: 2px;
        }
      }

      .el-textarea {
        position: relative; /* 确保伪元素相对于父元素定位 */
        background-color: transparent; /* 背景透明 */
        overflow: hidden; /* 确保伪元素的圆角不溢出 */
        margin-top: 22px;
        margin-left: 93px;
      }

      .el-textarea :deep(.el-textarea__inner) {
        width: 861px;
        height: 158px; /* 设置高度 */
        background: rgba(21, 23, 28, 0.5);
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

      .regions {
        width: auto;
        height: 38px;
        display: flex;
        align-items: center;
        margin-top: 20px;
        margin-left: 93px;

        .regionWord {
          height: 38px;

          .words {
            height: 21px;
            display: flex;
            align-items: center;
            font-size: 18px;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
          }

          .regionTip {
            height: 15px;
            margin-top: 2px;
            font-size: 12px;
            color: rgba(145, 145, 145, 1);
          }
        }

        .options {
          width: auto;
          height: 30px;
          margin-left: 50px;
        }
      }

      .bottomButtons {
        width: 451px;
        height: 47px;
        display: flex;
        justify-content: space-between;
        margin-left: 93px;
        margin-top: 51px;

        .leftButton {
          width: 207px;
          height: 47px;
          border-radius: 25px;
          background: rgba(62, 73, 92, 1);
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 18px;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
          margin: 0;
          border: 0;
        }

        .rightButton {
          margin: 0;
          border: 0;
          width: 207px;
          height: 47px;
          border-radius: 25px;
          background: linear-gradient(270deg, rgba(0, 186, 173, 1) 0%, rgba(42, 130, 228, 1) 100%);
          box-shadow: 3px 3px 10px -1px rgba(11, 27, 102, 0.3);
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 18px;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
        }
      }

      .error-border {
        :deep(.el-textarea__inner) {
          border-color: #f56c6c !important;
        }
      }

      .error-checkbox {
        :deep(.el-checkbox__label) {
          color: #f56c6c;
        }
      }

      .error-message {
        color: #f56c6c;
        font-size: 12px;
        margin-top: 4px;
        margin-left: 92px;
      }

      .error-messages {
        color: #f56c6c;
        font-size: 12px;
        margin-top: 4px;
      }
    }

    .hand {
      width: 100%;
      height: 100%;
      position: relative;

      .bg {
        width: 1868px;
        height: 1868px;
        border-radius: 50%;
        position: absolute;
        left: -777px;
        top: -924.07px;
        background: radial-gradient(35.65% 35.65% at 50% 50%, rgba(0, 186, 173, 0.17) 0%, rgba(42, 130, 228, 0) 100%);
      }

      .title {
        width: 238px;
        height: auto;
        margin-top: 52px;
        margin-left: 52px;
        z-index: 1000;

        .word {
          width: 238px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .leftWord {
            min-width: 182px;
            height: 30px;
            display: flex;
            align-items: center;
            font-size: 24px;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
          }

          .rightArrow {
            width: 30px;
            height: 30px;
            background-image: url('@/assets/nose/Double Arrow Right.png');
            background-repeat: no-repeat;
            background-size: contain;
          }
        }

        .time {
          min-width: 177px;
          height: 15px;
          font-size: 14px;
          color: rgba(145, 145, 145, 1);
          margin-top: 2px;
        }
      }

      .newTitle {
        width: 144px;
        height: auto;
        margin-top: 28px;
        margin-left: 52px;
        z-index: 1000;

        .newWord {
          width: 100%;
          height: 21px;
          display: flex;

          .leftNew {
            width: auto;
            height: 21px;
            font-size: 18px;
            font-weight: 500;
            display: flex;
            align-items: center;
            color: rgba(255, 255, 255, 1);
          }

          .newIcon {
            width: 24px;
            height: 24px;
            background-image: url('@/assets/nose/Align - Left.png');
            background-repeat: no-repeat;
            background-size: contain;
          }
        }

        .must {
          width: auto;
          height: 15px;
          font-size: 12px;
          color: rgba(145, 145, 145, 1);
          margin-top: 2px;
        }
      }

      .el-input {
        margin-top: 18px;
        margin-left: 52px;
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

      .contentImg {
        width: 300px;
        height: auto;
        margin-top: 26px;
        margin-left: 52px;

        .contentWord {
          width: 300px;
          height: 21px;
          display: flex;
          align-items: center;
          font-size: 18px;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
        }

        .mustOne {
          min-width: 177px;
          height: 15px;
          margin-top: 2px;
          display: flex;
          align-items: center;
          font-size: 12px;
          color: rgba(145, 145, 145, 1);
        }
      }

      .buttons {
        width: 411px;
        height: 47px;
        display: flex;
        justify-content: space-between;
        position: relative;
        margin-top: 32px;
        margin-left: 1225px;

        .leftButton {
          margin: 0;
          border: 0;
          width: 188px;
          height: 47px;
          border-radius: 25px;
          background: rgba(62, 73, 92, 1);
          box-shadow: 3px 3px 10px -1px rgba(11, 27, 102, 0.3);
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 18px;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
        }

        .rightButton {
          margin: 0;
          border: 0;
          width: 188px;
          height: 47px;
          border-radius: 25px;
          background: linear-gradient(270deg, rgba(0, 186, 173, 1) 0%, rgba(42, 130, 228, 1) 100%);
          box-shadow: 3px 3px 10px -1px rgba(11, 27, 102, 0.3);
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 18px;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
        }
      }
    }

    .result {
      width: 100%;
      height: 100%;
      position: relative;

      .bgs {
        position: absolute;
        left: 832px;
        top: -184px;
        width: 1063px;
        height: 1063px;
        background-image: url('@/assets/nose/01.png (4).png');
        background-repeat: no-repeat;
        background-size: contain;
      }

      .contentWords {
        width: 100%;
        margin-top: 47px;
        margin-left: 70px;

        .newContent {
          width: 81%;
          height: 90px;
          margin-top: 13px;
          font-size: 20px;
          font-weight: 200;
          line-height: 30px;
          color: rgba(255, 255, 255, 1);
          display: -webkit-box; /* 使用 Flexbox 布局 */
          -webkit-box-orient: vertical; /* 设置为垂直方向 */
          -webkit-line-clamp: 3; /* 限制为三行 */
          overflow: hidden; /* 超出部分隐藏 */
          text-overflow: ellipsis; /* 使用省略号显示溢出文本 */
          white-space: normal; /* 允许换行 */
        }
      }

      .otherStatic {
        width: 100%;
        height: 350px;
        display: flex;

        .firstLine {
          width: 154.59px;
          height: 0px;
          transform: rotate(90deg);
          margin-top: 203px;
          border: 1px solid rgba(221, 221, 221, 1);
        }

        .emotionKind {
          width: 600px;
          margin-top: 60px;

          .topInfo {
            height: 25px;
            font-size: 20px;
            font-weight: 500;
            line-height: 22px;
            color: rgba(245, 245, 245, 1);
          }

          .staticContent {
            width: 100%;
            height: 282px;
          }
        }
      }

      .bottomReport {
        width: 92%;
        margin-top: 47px;
        margin-left: 72px;

        .content {
          width: 100%;
          height: 65px;
          font-size: 20px;
          font-weight: 200;
          line-height: 30px;
          color: rgba(255, 255, 255, 1);
          margin-top: 27px;
        }
      }

      .bottomButton {
        width: 460px;
        height: 47px;
        display: flex;
        justify-content: space-between;
        margin-top: 50px;
        margin-left: 1228px;
        position: relative;
        z-index: 10000;

        .back {
          width: 209px;
          height: 47px;
          border-radius: 25px;
          background: rgba(62, 73, 92, 1);
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 18px;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
        }

        .again {
          width: 209px;
          height: 47px;
          border-radius: 25px;
          background: linear-gradient(270deg, rgba(0, 186, 173, 1) 0%, rgba(42, 130, 228, 1) 100%);
          box-shadow: 3px 3px 10px -1px rgba(11, 27, 102, 0.3);
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 18px;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
        }

        .backNavi {
          width: 209px;
          height: 47px;
          border-radius: 25px;
          background: linear-gradient(270deg, rgba(0, 186, 173, 1) 0%, rgba(42, 130, 228, 1) 100%);
          box-shadow: 3px 3px 10px -1px rgba(11, 27, 102, 0.3);
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 18px;
          font-weight: 500;
          margin-left: 251px;
          color: rgba(255, 255, 255, 1);
        }
      }
    }
  }
}
</style>
