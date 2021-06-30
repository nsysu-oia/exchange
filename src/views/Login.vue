<template>
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
