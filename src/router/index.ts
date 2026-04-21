import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/views/IndexView.vue'),
      redirect: 'rainstorm',
      children: [
        {
          path: 'rainstorm',
          name: 'rainstorm',
          component: () => import('@/views/home/rainstorm/RainstormView.vue'),
        },
        {
          path: 'earthquake',
          name: 'earthquake',
          component: () => import('@/views/home/earthquake/EarthquakeView.vue'),
        },
        {
          path: 'data-management',
          name: 'dataManagement',
          component: () =>
            import('@/views/home/data-management/DataManagementView.vue'),
        },
      ],
    },
  ],
});

export default router;
