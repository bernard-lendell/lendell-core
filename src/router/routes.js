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
  {
    path: '/tracker',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ name: 'Tracker', path: '', component: () => import('pages/TrackerPage.vue') }],
  },
  {
    path: '/test-upload',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ name: 'TestUpload', path: '', component: () => import('pages/TestUpload.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
