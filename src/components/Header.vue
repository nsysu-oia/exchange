<template>
  <div class="wrapper">
    <img :src="logo" alt="OIA logo" class="logo">
  </div>
  <div class="title" :style="{ 'font-size': titleFontSize }">國立中山大學交換計畫單一入口</div>
  <div id="nav">
    <!-- <router-link :to="{ name: 'Root' }">Root</router-link> --> |
    <router-link :to="{ name: 'Home' }">Home</router-link> |
    <router-link v-if="!user" :to="{ name: 'Login' }">Login</router-link> |
    <button v-if="user" type="button" @click="logout">Logout</button>
    <!-- <router-link :to="{ name: 'About' }">About</router-link> -->
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
      // For webpack compile
      switch (this.$store.state.windowSize) {
        case 'xs':
        case 'sm':
          return require('@/assets/logos/logo-mobile.png')
        default:
          return require('@/assets/logos/logo-desktop.png')
      }
    },
    titleFontSize () {
      switch (this.$store.state.windowSize) {
        case 'xs':
          return '20pt'
        case 'sm':
          return '25pt'
        case 'md':
          return '30pt'
        case 'lg':
          return '35pt'
        case 'xl':
          return '40pt'
        default:
          return '35pt'
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
#nav {
  padding: 10px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #045e91;
}
.logo {
  width: 30%;
}
.title {
  font-weight: bold;
}
.wrapper {
  display: grid;
}
</style>
