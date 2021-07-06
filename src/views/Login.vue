<template>
  <div class="bg">
    <div>
      <img src="@/assets/logos/logo-mobile.png" alt="OIA logo" style="width: 200px">
      <div>國立中山大學交換計畫單一入口</div>
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
    </div>
  </div>
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

<style scoped>
.bg {
  /* The image used */
  background-image: url('~@/assets/images/bg.jpg');

  /* Full height */
  height: 100%;

  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;

  align-items: center;
  display: flex;
  justify-content: center;
}
</style>
