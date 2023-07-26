import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },

  {
    path: '/uitslagen',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/UitslagenPage.vue') }],
  },

  {
    path: '/scorebord',
    children: [{ path: '', component: () => import('pages/ScoreboardPage.vue') }],
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
