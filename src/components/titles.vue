<script lang="ts" setup>
import { ref } from 'vue'
</script>

<template>
  <div class="mapTitle">
    <div class="counts"><slot name="titleName"></slot></div>
    <div class="mapTime"><slot name="time"></slot></div>
  </div>
</template>

<style>
.mapTitle {
  min-width: 180px;
  height: 42px;

  .counts {
    min-width: 162px;
    height: 22px;
    font-size: 18px;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
  }

  .mapTime {
    min-width: 177px;
    height: 15px;
    margin-top: 5px;
    font-size: 12px;
    color: rgba(145, 145, 145, 1);
  }
}
</style>
