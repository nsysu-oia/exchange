<template>
  <div class="container">
    <img :src="logo" alt="OIA logo" class="logo" :style="{ 'width': logoWidth }" @click="pushHome">
    <button v-if="user" type="button" class="button" @click="logout">Logout</button>
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
    pushHome () {
      this.$router.push({ name: 'Home' })
    },
    logout () {
      this.$store.dispatch('logout')
    }
  }
}
</script>

<style scoped>
img.logo {
  cursor: pointer;
  transition: transform .2s;
}
img.logo:hover {
  transform: scale(1.03, 1.03);
}
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
  margin: 1rem;
  padding: 0.7rem;
  transition: transform .2s;
}
.button:hover {
  transform: scale(1.1, 1.1);
}
.container {
  display: flex;
  justify-content: space-between;
  padding: 0 0.5rem;
}
</style>
