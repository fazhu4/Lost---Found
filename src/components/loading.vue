<template>
  <div class="loading-container">
    <h2 data-text="Loading...">Loading...</h2>
  </div>
</template>

<script setup></script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap');

.loading-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-container h2 {
  position: relative;
  font-size: 7vw;
  color: #252839;
  -webkit-text-stroke: 0.3vw #252839;
  text-transform: uppercase;
}

.loading-container h2::before {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  color: rgba(56, 135, 224, 1);
  -webkit-text-stroke: 0vw #383d52;
  border-right: 2px solid rgba(56, 135, 224, 1);
  overflow: hidden;
  animation: animate 6s linear infinite;
}

@keyframes animate {
  0%,
  10%,
  100% {
    width: 0;
  }
  70%,
  90% {
    width: 100%;
  }
}
</style>
