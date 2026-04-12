import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/views/Index.vue'),
      redirect: 'rainstorm',
      children: [
        {
          path: 'rainstorm',
          name: 'rainstorm',
          component: () => import('@/views/home/rainstorm/Rainstorm.vue'),
        },
        {
          path: 'earthquake',
          name: 'earthquake',
          component: () => import('@/views/home/earthquake/Earthquake.vue'),
        }
      ]
    }
  ],
})

export default router
