<script setup>
import { ref, onMounted } from 'vue'
</script>

<template>
  <div class="contentImg">
    <div class="contentWord"><slot name="word"></slot></div>
    <div class="mustOne">*此项为选填项</div>
  </div>
</template>

<style lang="scss" scoped>
.contentImg {
  width: 300px;
  height: auto;

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
</style>
