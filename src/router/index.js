import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      meta: {
        title: '登录页',
      },
      component: () => import('@/views/login/login.vue'),
    },
    {
      path: '/',
      component: () => import('@/views/HomeView.vue'),
      redirect: '/login', // 修改重定向到登录页
      children: [
        {
          path: '/home',
          meta: {
            title: '首页',
          },
          component: () => import('@/views/layout/PageIndex.vue'),
        },

        {
          path: '/nose',
          meta: {
            title: '识别',
          },
          component: () => import('@/views/nose/nose.vue'),
        },
        {
          path: '/monitor',
          meta: {
            title: '监测',
          },
          component: () => import('@/views/monitor/monitor.vue'),
        },
        {
          path: '/my',
          meta: {
            title: '个人中心',
          },
          component: () => import('@/views/my/my.vue'),
        },
      ],
    },
  ],
})

export default router
