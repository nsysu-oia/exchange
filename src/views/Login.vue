<template>
  <div class="bg">
    <div class="login-box">
      <img class="logo" src="@/assets/logos/logo-mobile.png" alt="OIA logo">
      <div class="title">出國交換計畫平台</div>
      <form @submit.prevent="sidAuth">
        <input v-model="studentID" ref="studentID" type="text" placeholder="學號" autofocus />
        <button v-if="pwVis === 'hidden'" :disabled="!studentID" type="submit" name="button" />
      </form>
      <form @submit.prevent="ssoAuth" :style="'visibility:' + pwVis">
        <input v-model="password" ref="password" type="password" placeholder="密碼" class="pw-input" />
        <button :disabled="!password" type="submit" name="button" />
      </form>
      <p>&nbsp;{{ errMsg }}&nbsp;</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
const backendHost = process.env.VUE_APP_BACKEND_HOST || 'localhost'
export default {
  name: 'Login',
  data () {
    return {
      studentID: '',
      password: '',
      pwVis: 'hidden',
      errMsg: ' '
    }
  },
  mounted: function () {
    const gray = '#d6d6d6'
    const blue = '#0070c9'

    this.$refs.studentID.addEventListener('focus', el => {
      if (this.pwVis === 'visible') {
        el.target.style['border-bottom'] = '1px solid ' + blue
        this.$refs.password.style['border-top'] = 0
      }
    })
    this.$refs.studentID.addEventListener('blur', el => {
      if (this.pwVis === 'visible') {
        el.target.style['border-bottom'] = 0
        this.$refs.password.style['border-top'] = '1px solid ' + gray
      }
    })
    this.$refs.password.addEventListener('focus', el => {
      if (this.pwVis === 'visible') {
        el.target.style['border-top-color'] = blue
      }
    })
    this.$refs.password.addEventListener('blur', el => {
      if (this.pwVis === 'visible') {
        el.target.style['border-top-color'] = gray
      }
    })
  },
  watch: {
    studentID: function () {
      this.errMsg = ' '
      this.pwVis = 'hidden'
      this.password = ''

      this.$refs.studentID.style.removeProperty('border-bottom')
      this.$refs.studentID.style.removeProperty('border-bottom-left-radius')
      this.$refs.studentID.style.removeProperty('border-bottom-right-radius')
    },
    password: function () {
      this.errMsg = ' '
    }
  },
  methods: {
    sidAuth () {
      axios
        .post('//' + backendHost + ':3000/sid-auth', { studentID: this.studentID })
        .then(() => {
          this.errMsg = ' '
          this.pwVis = 'visible'
          this.$refs.studentID.style.cssText = `
            border-bottom: 0;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
          `
          this.$nextTick(() => { this.$refs.password.focus() })
        })
        .catch(err => {
          if (err.response.status === 400) {
            this.errMsg = '您並未申請學生交換計畫'
            this.pwVis = 'hidden'
          }
        })
    },
    ssoAuth () {
      this.$store
        .dispatch('ssoAuth', {
          studentID: this.studentID,
          password: this.password
        })
        .then(() => { this.$router.push({ name: 'Home' }) })
        .catch(err => {
          if (err.response.status === 400) {
            this.errMsg = '帳號或密碼錯誤'
          }
        })
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
.login-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 12rem;
}
.logo {
  width: 250px;
  margin: 1rem;
}
.title {
  font-size: 21px;
  margin-bottom: 13px;
}
form {
  position: relative;
}
input {
  position: relative;
  font-size: 17px;
  width: 300px;
  height: 42px;
  padding: 0 43px 0 15px;
  background: #fff;
  border: 1px solid #d6d6d6;
  border-radius: 6px;
}
.pw-input {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
input:focus {
  outline: none;
  border-color: #0070c9;
  box-shadow: 0 0 0 1px #0070c9;
  z-index: 2;
}
@font-face {
  font-family: shared-icons;
  src: url('~@/assets/fonts/shared-icons.woff');
}
button {
  position: absolute;
  top: 7px;
  right: 10px;
  z-index: 999;
  font-size: 23px;
  cursor: pointer;
  background: none;
  border: none;
  font-family: shared-icons;
}
button::before {
  content: '\f127';
}
</style>
