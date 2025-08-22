<script setup>
import smallTitle from './smallTitle.vue'
import word from '@/components/words.vue'
import wordSencond from '@/components/word.vue'
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  wordList: {
    type: Array,
    required: true, // 如果需要，可以指定是否必需
  },
})

const wordArray = ref()

watch(
  () => props.wordList,
  (newValue) => {
    if (newValue) {
      wordArray.value = newValue
    }
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div class="wordsReport">
    <smallTitle>
      <template #word>内容分析报告</template>
    </smallTitle>
    <div class="wordBox" v-if="wordArray">
      <!-- <word :wordArrays="wordArray"></word> -->
      <wordSencond :wordArrays="wordArray"></wordSencond>
    </div>
    <div class="wordTitle">识别结果词云图</div>
  </div>
</template>

<style lang="scss" scoped>
.wordsReport {
  width: 330px;
  height: 100%;
  margin-top: 18px;
  position: relative;

  .wordBox {
    width: 290px;
    height: 260px;
    position: absolute;
    top: 22px;
    left: -22px;
  }

  .wordTitle {
    width: 147px;
    height: 25px;
    font-size: 20px;
    font-weight: 500;
    letter-spacing: 0px;
    line-height: 24.2px;
    color: rgba(255, 255, 255, 1);
    position: absolute;
    bottom: 27px;
    left: 48px;
  }
}
</style>
