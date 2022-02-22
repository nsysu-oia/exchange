import { createRouter, createWebHistory } from 'vue-router'
import $store from '@/store'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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

  if (authRequired) {
    const user = $store.state.user
    if (!user) {
      return next({ name: 'Login' })
    }

    // expiration check
    if (!user.expireTimestamp || user.expireTimestamp < Date.now()) {
      $store.commit('CLR_USER')
      return next({ name: 'Login' })
    }
    // renew timestamp
    user.expireTimestamp =
      Date.now() +
      parseInt(import.meta.env.VUE_APP_SESSION_DURATION || '100000000000000')
    $store.commit('SET_USER', user)

    // TODO: The return report system is published first
    //       This prevent these users access the under-constructing homepage.
    if (to.name !== 'ReturnReport' && user && user.returnReportOnly) {
      return next({ name: 'ReturnReport' })
    }
  }

  next()
})

export default router
