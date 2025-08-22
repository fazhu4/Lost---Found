<script setup>
import { ref, onMounted, watch } from 'vue'

const textareas = ref('')

const agreeArray = ref([
  {
    id: 1,
    name: '点赞数',
    value: '',
  },
  {
    id: 2,
    name: '收藏数',
    value: '',
  },
  {
    id: 3,
    name: '转发数',
    value: '',
  },
])
const emit = defineEmits(['update'])

const checkedCities = ref()
const cities = ['新浪微博', '百度', '今日头条', '知乎', '腾讯新闻', '搜狐新闻', '网易新闻', '小红书', '其他']

const values = ref(true)

watch(
  () => checkedCities.value,
  (newValue) => {
    console.log(newValue)
    emit('update', newValue[0])
  },
)
</script>

<template>
  <div class="bottomInfo">
    <div class="leftInfo">
      <div class="commentWord">
        <div class="words">相关用户评论</div>
        <div class="commentIcon"></div>
      </div>
      <div class="tips">*此项为选填项</div>
      <el-input v-model="textareas" :resize="'none'" type="textarea" placeholder="请在此输入文字" />
      <div class="bottomComment">
        <div class="bottomItem" v-for="(item, index) in agreeArray" :key="item.id">
          <div class="itemnames">{{ item.name }}</div>
          <el-input v-model="item.value" style="width: 142px; height: 35px" />
        </div>
      </div>
    </div>
    <div class="rigthInfo">
      <div class="region">
        <div class="regionWord">新闻来源</div>
        <div class="regionIcon"></div>
      </div>
      <div class="regionTip">*此项为选填项</div>
      <el-checkbox-group v-model="checkedCities" :max="1">
        <el-checkbox v-for="city in cities" :key="city" :label="city" :value="city">
          {{ city }}
        </el-checkbox>
      </el-checkbox-group>
      <div class="lines"></div>
      <div class="check">
        <div class="checkName">该新闻发布者是否拥有官方认证</div>
        <el-switch v-model="values" size="large" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bottomInfo {
  width: 93%;
  height: auto;
  display: flex;
  gap: 5.2%;
  margin-top: 26px;
  margin-left: 52px;

  .leftInfo {
    width: 47%;
    height: auto;

    .commentWord {
      width: auto;
      height: 24px;
      display: flex;
      gap: 2px;

      .words {
        width: auto;
        height: 24px;
        display: flex;
        align-items: center;
        font-size: 18px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
      }

      .commentIcon {
        width: 24px;
        height: 24px;
        margin-top: 2px;
        background-image: url('@/assets/nose/Edit 1.png');
        background-size: contain;
        background-repeat: no-repeat;
      }
    }

    .tips {
      width: auto;
      height: 16px;
      display: flex;
      align-items: center;
      margin-top: 2px;
      font-size: 12px;
      color: rgba(145, 145, 145, 1);
    }

    .el-textarea {
      position: relative; /* 确保伪元素相对于父元素定位 */
      background-color: transparent; /* 背景透明 */
      overflow: hidden; /* 确保伪元素的圆角不溢出 */
      margin-top: 12px;
    }

    .el-textarea :deep(.el-textarea__inner) {
      width: 100%;
      height: 175px; /* 设置高度 */
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

    .bottomComment {
      width: 100%;
      height: auto;
      display: flex;
      justify-content: space-between;
      margin-top: 24px;

      .bottomItem {
        width: 218px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .itemnames {
          width: 70px;
          height: 35px;
          display: flex;
          align-items: center;
          font-size: 16px;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
        }

        .el-input {
          padding: 0;
          margin: 0;
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
    }
  }

  .rigthInfo {
    width: 47%;
    height: auto;

    .region {
      width: auto;
      height: 24px;
      display: flex;
      gap: 2px;

      .regionWord {
        width: auto;
        height: 24px;
        display: flex;
        align-items: center;
        font-size: 18px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
      }

      .regionIcon {
        width: 24px;
        height: 24px;
        margin-top: 2px;
        background-image: url('@/assets/nose/Share 3.png');
        background-size: contain;
        background-repeat: no-repeat;
      }
    }

    .regionTip {
      width: auto;
      height: 16px;
      display: flex;
      align-items: center;
      margin-top: 2px;
      font-size: 12px;
      color: rgba(145, 145, 145, 1);
      margin-bottom: 8px;
    }

    .el-checkbox-group {
      width: 95%;

      .el-checkbox {
        margin-bottom: 15px;
      }

      .el-input {
        z-index: 1000;
        margin-left: 0;
        margin-top: -10px;
      }
    }

    .lines {
      width: 300px;
      height: 0px;
      border: 1px solid rgba(133, 133, 133, 1);
      margin-top: 20px;
    }

    .check {
      width: auto;
      height: 100px;
      display: flex;
      align-items: center;
      gap: 15px;

      .checkName {
        height: 29px;
        font-size: 18px;
        font-weight: 500;
        margin-top: -3px;
        color: rgba(255, 255, 255, 1);
      }
    }
  }
}

.el-input {
  margin-top: 17px;
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
</style>
