<template>
  <div class="container">
    <img :src="logo" alt="OIA logo"  :style="{ 'width': logoWidth }">
    <button v-if="user" type="button" class="button" @click="logout">Logout</button>
    <!-- <router-link :to="{ name: 'Root' }">Root</router-link> |
    <router-link :to="{ name: 'Home' }">Home</router-link> |
    <router-link v-if="!user" :to="{ name: 'Login' }">Login</router-link> |
    <button v-if="user" type="button" @click="logout">Logout</button>
    <router-link :to="{ name: 'About' }">About</router-link> -->
  </div>
</template>

<script>
export default {
  name: 'Header',
  computed: {
    user () {
      return this.$store.state.user
    },
    logo () {
      switch (this.$store.state.windowSize) {
        case 'xs':
        case 'sm':
          return require('@/assets/logos/logo-mobile.png')
        default:
          return require('@/assets/logos/logo-desktop.png')
      }
    },
    logoWidth () {
      switch (this.$store.state.windowSize) {
        case 'lg':
          return '40%'
        case 'xl':
          return '30%'
        default:
          return '50%'
      }
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('logout')
    }
  }
}
</script>

<style scoped>
.button {
  background-color: #1C4A7C; /* Green */
  border: none;
  border-radius: 8px;
  color: white;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1.2rem;
  cursor: pointer;
}
.container {
  display: flex;
  justify-content: space-between;
  padding: 0 0.5rem 1rem 0.5rem;
}
</style>
