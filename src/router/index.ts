import { createRouter, createWebHistory } from 'vue-router';
import HomeViews from '@/views/home/HomeViews.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeViews,
    },
    {
      path: '/editor',
      name: 'Editor',
      component: () => import('@/views/editor/EditorView.vue'),
    },
  ],
});

export default router;
