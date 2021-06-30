<template>
  <Header/>
  <router-view/>
</template>

<script>
import axios from 'axios'
import Header from '@/components/Header.vue'
export default {
  name: 'App',
  components: {
    Header
  },
  created () {
    // RWD
    window.addEventListener('resize', () => {
      this.$store.commit('UPDATE_WINDOW_WIDTH')
    })

    // Auto login
    const userString = localStorage.getItem('user')
    if (userString) {
      const user = JSON.parse(userString)
      this.$store.commit('SET_USER', user)
    }
    axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response.status === 401) {
          this.$router.push('/')
          this.$store.dispatch('logout')
        }
        return Promise.reject(error)
      }
    )
  },
  unmounted () {
    window.removeEventListener()
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
