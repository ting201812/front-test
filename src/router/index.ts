import { VNodeTypes, } from 'vue';
import { createRouter, createWebHashHistory, RouteRecordRaw, } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: '主页',
    component: (): VNodeTypes => import('@/views/index.vue'),
  },
];

export const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});
