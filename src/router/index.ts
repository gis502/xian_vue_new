import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/rainstorm',
    },
    {
      path: '/rainstorm',
      name: 'rainstorm',
      component: () => import('@/views/home/rainstorm/Rainstorm.vue'),
    },
    {
      path: '/earthquake',
      name: 'earthquake',
      component: () => import('@/views/home/earthquake/Earthquake.vue'),
    }
  ],
})

export default router
