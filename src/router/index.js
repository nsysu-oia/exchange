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
      name: 'returnReport',
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
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('user')

  if (authRequired && !loggedIn) {
    return next('/login')
  }

  next()
})

export default router
