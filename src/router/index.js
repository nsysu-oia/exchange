import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/%E8%BF%94%E5%9C%8B%E5%A0%B1%E5%91%8A%E6%9B%B8', // 返國報告書
      name: 'ReturnReport',
      component: () => import('@/views/ReturnReport/Home.vue')
    },
    {
      path: '/:stageTitle',
      name: 'StageDetails',
      props: true,
      component: () => import('@/views/StageDetails.vue')
    }
  ]
})

router.beforeEach((to, _, next) => {
  // redirect to login page if user is not logged in and trying to access a restricted page
  const publicPages = ['Login']
  const authRequired = !publicPages.includes(to.name)
  const user = localStorage.getItem('user')

  if (authRequired && !user) {
    return next({ name: 'Login' })
  }

  // TODO: The return report system is published first
  //       This prevent these users access the under-constructing homepage.
  if (to.name !== 'ReturnReport' && user && JSON.parse(user).returnReportOnly) {
    return next({ name: 'ReturnReport' })
  }

  next()
})

export default router
