<template>
  <div class="container">
    <img :src="logo" alt="OIA logo" class="logo" :style="{ 'width': logoWidth }" @click="pushHome">
    <button type="button" class="button" @click="logout" :style="{ 'font-size': buttonFontSize }">登出</button>
  </div>
</template>

<script>
export default {
  name: 'Header',
  computed: {
    logo () {
      switch (this.$store.state.windowSize) {
        case 'xs':
        case 'sm':
          return require('@/assets/logos/logo-mobile.webp')
        default:
          return require('@/assets/logos/logo-desktop.webp')
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
    },
    buttonFontSize () {
      switch (this.$store.state.windowSize) {
        case 'xs':
          return '12px'
        default:
          return '18px'
      }
    }
  },
  methods: {
    pushHome () {
      this.$router.push({ name: 'Home' })
    },
    logout () {
      this.$store.commit('CLR_USER')
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
  border-radius: 25px;
  color: white;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
  margin: auto 10px;
  padding: 5px 20px;
  transition: transform .2s;
  font-family:inherit;
}
.container {
  display: flex;
  justify-content: space-between;
  padding: 0 0.5rem;
}
</style>
