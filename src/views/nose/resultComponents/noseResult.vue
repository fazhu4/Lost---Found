<script setup>
import smallTitle from './smallTitle.vue'
import circleChart from './circleChart.vue'
import { ref, onMounted, watch } from 'vue'
import '@/assets/font/font.css'

const props = defineProps({
  list: {
    type: Object,
    required: true, // 如果需要，可以指定是否必需
  },
})

const arrayList = ref()

function decimalToPercent(decimal) {
  // parseInt 会直接丢弃小数部分
  return parseInt(decimal * 100) + '%'
}

// 示例

const trustData = ref()

const textData = ref()

const imgData = ref()

watch(
  () => props.list,
  (newValue) => {
    if (newValue) {
      arrayList.value = newValue
      trustData.value = decimalToPercent(newValue.reliability)
      textData.value = decimalToPercent(newValue.text_factor)
      if (newValue.image_factor != 'null') {
        imgData.value = decimalToPercent(newValue.image_factor)
      } else {
        imgData.value = newValue.image_factor
      }
      console.log(imgData.value)
    }
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div class="circleStatic">
    <smallTitle>
      <template #word>综合识别结果</template>
    </smallTitle>
    <div class="circleBox">
      <div class="circles">
        <circleChart :lists="arrayList"></circleChart>
      </div>
      <div class="percent" v-if="arrayList">
        <div class="trust">
          <div class="num">{{ trustData }}</div>
          <div class="names">可信度</div>
          <div class="trustBg"></div>
        </div>
        <div class="gapLine"></div>
        <div class="text">
          <div class="num">{{ textData }}</div>
          <div class="names">文本因子</div>
          <div class="textBg"></div>
        </div>
        <div class="gapLines"></div>
        <div class="real">
          <div class="num">{{ imgData == 'null' ? '无' : imgData }}</div>
          <div class="names">图像真实度</div>
          <div class="realBg"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.circleStatic {
  width: 576px;
  height: 100%;
  margin-left: 70px;
  margin-top: 13px;

  .circleBox {
    width: 100%;
    height: 291px;
    display: flex;

    .circles {
      width: 370px;
      height: 100%;
    }

    .percent {
      width: 160px;
      margin-left: 57px;
      // background-color: #fff;

      .trust {
        width: 100%;
        height: 92px;
        position: relative;

        .num {
          width: 144px;
          height: 70px;
          font-size: 55px;
          font-weight: 500;
          font-family: 'PangMenZhengDaoBiao';
          background: linear-gradient(90deg, rgba(0, 250, 246, 1) 0%, rgba(255, 255, 255, 1) 81.94%); /*设置渐变的方向从左到右 颜色从ff0000到ffff00*/
          -webkit-background-clip: text; /*将设置的背景颜色限制在文字中*/
          -webkit-text-fill-color: transparent; /*给文字设置成透明*/
        }

        .names {
          width: 70px;
          height: 45px;
          font-size: 20px;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 26px;
        }

        .trustBg {
          width: 91px;
          height: 92px;
          position: absolute;
          background-image: url('@/assets/nose/Emotion.png');
          background-repeat: no-repeat;
          background-size: cover;
          top: 12px;
          right: 0px;
        }
      }

      .gapLine {
        width: 74px;
        border: 1px solid rgba(221, 221, 221, 0.5);
        margin-top: 32px;
        margin-left: 30px;
      }

      .text {
        width: 110px;
        height: 90px;
        margin-left: 30px;
        margin-top: 10px;
        position: relative;

        .num {
          width: 90px;
          height: 45px;
          font-size: 36px;
          font-weight: 500;
          font-family: 'PangMenZhengDaoBiao';
          background: linear-gradient(
            90deg,
            rgba(32, 103, 227, 1) 0%,
            rgba(32, 103, 227, 1) 0%,
            rgba(27, 98, 222, 1) 0%,
            rgba(27, 98, 222, 1) 0%,
            rgba(31, 102, 226, 1) 2.08%,
            rgba(32, 103, 227, 1) 3.08%,
            rgba(242, 245, 250, 1) 84.72%
          ); /*设置渐变的方向从左到右 颜色从ff0000到ffff00*/
          -webkit-background-clip: text; /*将设置的背景颜色限制在文字中*/
          -webkit-text-fill-color: transparent; /*给文字设置成透明*/
        }

        .names {
          width: 90px;
          height: 45px;
          display: flex;
          align-items: center;
          font-size: 18px;
          color: rgba(255, 255, 255, 1);
        }

        .textBg {
          width: 66px;
          height: 67px;
          background-image: url('@/assets/nose/bubble chat check.png');
          background-repeat: no-repeat;
          background-size: contain;
          position: absolute;
          top: 0;
          right: 10px;
        }
      }

      .gapLines {
        width: 74px;
        border: 1px solid rgba(221, 221, 221, 0.5);
        margin-top: 8px;
        margin-left: 30px;
      }

      .real {
        width: 110px;
        height: 90px;
        margin-left: 30px;
        margin-top: 10px;
        position: relative;

        .num {
          width: 90px;
          height: 45px;
          font-size: 33px;
          font-weight: 500;
          font-family: 'PangMenZhengDaoBiao';
          background: linear-gradient(90deg, rgba(66, 207, 122, 1) 0%, rgba(255, 255, 255, 1) 100%); /*设置渐变的方向从左到右 颜色从ff0000到ffff00*/
          -webkit-background-clip: text; /*将设置的背景颜色限制在文字中*/
          -webkit-text-fill-color: transparent; /*给文字设置成透明*/
        }

        .names {
          width: 90px;
          height: 45px;
          display: flex;
          align-items: center;
          font-size: 18px;
          color: rgba(255, 255, 255, 1);
        }

        .realBg {
          width: 66px;
          height: 67px;
          background-image: url('@/assets/nose/Transaction History.png');
          background-repeat: no-repeat;
          background-size: contain;
          position: absolute;
          top: 0;
          right: 10px;
        }
      }
    }
  }
}
</style>
