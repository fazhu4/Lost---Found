<template>
  <div class="loading-container">
    <span style="--i: 1">L</span>
    <span style="--i: 2">o</span>
    <span style="--i: 3">a</span>
    <span style="--i: 4">d</span>
    <span style="--i: 5">i</span>
    <span style="--i: 6">n</span>
    <span style="--i: 7">g</span>
    <span style="--i: 8">.</span>
    <span style="--i: 9">.</span>
    <span style="--i: 10">.</span>
  </div>
</template>

<script setup></script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

.loading-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: default;
  -webkit-box-reflect: below -25px linear-gradient(transparent, #0005);

  span {
    background: linear-gradient(to right, #3887e0, #43cf7c);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-family: 'Poppins', sans-serif;
    position: relative;
    display: inline-flex;
    font-size: 5em;
    color: transparent;
    text-transform: uppercase;
    font-weight: 800;
    -webkit-text-stroke: 1px #fff9;
    animation: animate 1.5s ease-in-out infinite;
    animation-delay: calc(0.15s * var(--i));
  }
}

@keyframes animate {
  0% {
    transform: translateY(0px);
    color: transparent;
    text-shadow: none;
  }
  20% {
    transform: translateY(-60px);
    color: #fff;
    text-shadow:
      0 0 5px #fff,
      0 0 25px #fff,
      0 0 50px #fff;
  }
  40%,
  100% {
    transform: translateY(0px);
    color: transparent;
    text-shadow: none;
  }
}
</style>
