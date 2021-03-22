<template>
  <Header/>
  <router-view/>
</template>

<script>
import Header from '@/components/Header.vue'
export default {
  name: 'App',
  components: {
    Header
  },
  created () {
    window.addEventListener('resize', () => {
      this.$store.commit('UPDATE_WINDOW_WIDTH')
    })
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
