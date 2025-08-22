<script setup>
import { ref, onMounted } from 'vue'
</script>

<template>
  <div class="smallTitle">
    <div class="circle"></div>
    <div class="name">
      <slot name="word"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.smallTitle {
  height: 25px;
  display: flex;
  align-items: center;

  .circle {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: linear-gradient(130.28deg, rgba(42, 130, 228, 1) 0%, rgba(67, 207, 124, 1) 100%);
  }

  .name {
    height: 25px;
    font-size: 20px;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    display: flex;
    align-items: center;
    margin-left: 14px;
  }
}
</style>
