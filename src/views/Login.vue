<template>
  <div :style="{ 'font-size': titleFontSize }">國立中山大學交換計畫單一入口</div>
  <form @submit.prevent="login">
    <label for="studentID">
      學號：
    </label>
    <input v-model="studentID" type="text" name="studentID">

    <label for="password">
      密碼：
    </label>
    <input v-model="password" type="password" name="password">

    <button type="submit" name="button">
      登入
    </button>
  </form>
  <p v-if="status === 400">Incorrect student ID or password.</p>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      studentID: '',
      password: '',
      status: null
    }
  },
  computed: {
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
    login () {
      this.$store
        .dispatch('login', {
          studentID: this.studentID,
          password: this.password
        })
        .then(() => { this.$router.push({ name: 'Home' }) })
        .catch(err => { this.status = err.response.status })
    }
  }
}
</script>
