<template>
  <div class="login">
    <h1>Login</h1>
  </div>
  <form @submit.prevent="login">
    <label for="studentID">
      學號：
    </label>
    <input v-model="studentID" type="text" name="studentID">

    <label for="password">
      密碼：
    </label>
    <input @input="hashing($event.target.value)" type="password" name="password">

    <button type="submit" name="button">
      登入
    </button>

    <div>
      {{ studentID }}
      {{ passwordHashed }}
    </div>
  </form>
</template>

<script>
import md5 from 'md5'
export default {
  name: 'Login',
  data () {
    return {
      studentID: '',
      passwordHashed: ''
    }
  },
  methods: {
    hashing (data) {
      this.passwordHashed = md5(data)
    },
    login () {
      this.$store
        .dispatch('login', {
          studentID: this.studentID,
          passwordHashed: this.passwordHashed
        })
        .then(() => {
          this.$router.push({ name: 'Home' })
        })
    }
  }
}
</script>
