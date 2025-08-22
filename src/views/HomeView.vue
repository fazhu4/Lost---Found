<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router' // 添加 useRoute
import VScaleScreen from 'v-scale-screen'

const router = useRouter()
const route = useRoute() // 获取当前路由信息
const isCollapse = ref(true)
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}

const count = ref(10)
const load = () => {
  count.value += 2
}

const value6 = ref('')

const value = ref('')
const activeIndex = ref(route.path)
// 监听路由变化
watch(
  () => route.path,
  (newPath) => {
    activeIndex.value = newPath
    console.log('目前地址:', newPath)
  },
)

const options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]
</script>

<template>
  <v-scale-screen width="1920" height="1080">
    <el-container class="bodys">
      <el-aside width="93px">
        <el-menu
          class="el-menu-vertical-demo"
          router
          :default-active="activeIndex"
          :style="{
            width: 93 + 'px',
            height: 1080 + 'px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            border: 0,
            background: 'linear-gradient(180deg, rgba(29, 71, 150, 0.69) 0.46%, rgba(27, 222, 202, 0.05) 100%)',
            position: 'relative',
          }"
          :text-color="'#ffffff'"
          :collapse="isCollapse"
          @open="handleOpen"
          @close="handleClose"
        >
          <div class="logoBox">
            <div class="logos"></div>
          </div>
          <div class="lists">
            <el-menu-item
              index="/home"
              :style="{
                display: 'flex',
                justifyContent: 'center',
              }"
            >
              <el-icon><HomeFilled /></el-icon>
              <template #title>首页</template>
            </el-menu-item>
            <el-menu-item index="/nose">
              <el-icon><UploadFilled /></el-icon>
              <template #title>谣言识别</template>
            </el-menu-item>
            <el-menu-item index="/monitor">
              <el-icon><Search /></el-icon>
              <template #title>谣言监测</template>
            </el-menu-item>
            <el-menu-item index="/my" class="personBox">
              <view class="person"></view>
            </el-menu-item>
          </div>
        </el-menu>
      </el-aside>
      <el-container>
        <router-view></router-view>
      </el-container>
    </el-container>
  </v-scale-screen>
</template>

<style>
.bodys {
  width: 1920px;
  height: 1080px;
  background-image: url('/src/assets/index/背景.png');
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;

  .el-menu-tooltip__trigger {
    width: 94px;
    display: flex;
    justify-content: center;
  }

  .logoBox {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: center;
    position: absolute;
    top: 32px;

    .logos {
      width: 40px;
      height: 40px;
      background-image: url('/src/assets/index/未命名作品.png');
      background-repeat: no-repeat;
      background-size: cover;
    }
  }

  .personBox {
    width: 100%;
    height: 48px;
    display: flex;
    justify-content: center;
    position: absolute;
    padding: 0;
    bottom: 24px;

    .person {
      width: 48px;
      height: 48px;
      background-image: url('/src/assets/index/Image.png');
      background-repeat: no-repeat;
      background-size: cover;
    }
  }
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 93px;
  height: 1080px;
}
</style>
