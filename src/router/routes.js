const routes = [
  // {
  //   path: '/',
  //   component: () => import('layouts/AuthLayout.vue'),
  //   children: [{ name: 'Auth', path: '', component: () => import('pages/AuthPage.vue') }],
  // },
  // {
  //   path: '/home',
  //   component: () => import('layouts/MainLayout.vue'),
  //   children: [{ name: 'Home', path: '', component: () => import('pages/IndexPage.vue') }],
  // },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ name: 'Dashboard', path: '', component: () => import('pages/DashboardPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
