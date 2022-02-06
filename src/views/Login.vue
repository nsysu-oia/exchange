<template>
  <div class="bg">
    <div class="login-box">
      <div class="title">國立中山大學<br />學生出國交換計畫單一入口</div>
      <div class="form">
        <input
          v-model="studentID"
          @input="sidChanged"
          @focus="sidFocused"
          @blur="sidBlurred"
          ref="studentID"
          type="text"
          autocomplete="off"
          placeholder="學號"
          autofocus
          @keyup.enter="sidAuth"
        />
        <button v-if="!sidVerified" :disabled="!studentID" @click="sidAuth">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="28" version="1.1" viewBox="-10 0 532 512">
             <path fill="currentColor" d="M256 0q106 0 181 75t75 181t-75 181t-181 75t-181 -75t-75 -181t75 -181t181 -75zM256 493q98 0 167.5 -69.5t69.5 -167.5t-69.5 -167.5t-167.5 -69.5t-167.5 69.5t-69.5 167.5t69.5 167.5t167.5 69.5zM286 217v-80l128 111v17l-128 110v-79h-158v-79h158z" />
          </svg>
        </button>
      </div>
      <transition @before-enter="collapse" @leave="collapseRev" :css="false">
        <div class="form" v-show="sidVerified">
          <input
            v-model="password"
            @input="errMsg = ''"
            @focus="pwFocused"
            @blur="pwBlurred"
            ref="password"
            type="password"
            autocomplete="off"
            placeholder="密碼"
            class="pw-input"
            @keyup.enter="ssoAuth"
          />
          <button :disabled="!password" @click="ssoAuth">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="28" version="1.1" viewBox="-10 0 532 512">
               <path fill="currentColor" d="M256 0q106 0 181 75t75 181t-75 181t-181 75t-181 -75t-75 -181t75 -181t181 -75zM256 493q98 0 167.5 -69.5t69.5 -167.5t-69.5 -167.5t-167.5 -69.5t-167.5 69.5t-69.5 167.5t69.5 167.5t167.5 69.5zM286 217v-80l128 111v17l-128 110v-79h-158v-79h158z" />
            </svg>
          </button>
        </div>
      </transition>
      <p>&nbsp;{{ errMsg }}&nbsp;</p>
      <img class="logo" src="@/assets/logos/logo-mobile.png" alt="OIA logo">
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import gsap from 'gsap'
const backendHost = process.env.VUE_APP_BACKEND_HOST || 'localhost'
const gray = '#d6d6d6'
const blue = '#0070c9'

export default {
  name: 'Login',
  data () {
    return {
      studentID: '',
      password: '',
      sidVerified: false,
      errMsg: ''
    }
  },
  methods: {
    sidFocused () {
      if (this.sidVerified) {
        this.$refs.studentID.style['border-bottom'] = '1px solid ' + blue
        this.$refs.password.style['border-top'] = 0
      }
    },
    sidBlurred () {
      if (this.sidVerified) {
        this.$refs.studentID.style['border-bottom'] = 0
        this.$refs.password.style['border-top'] = '1px solid ' + gray
      }
    },
    pwFocused () {
      if (this.sidVerified) {
        this.$refs.password.style['border-top-color'] = blue
      }
    },
    pwBlurred () {
      // the second condition has to be checked
      // because after successfully logged in,
      // this function will also be triggered
      // but `this.$refs.password` doesn't exist anymore
      if (this.sidVerified && this.$refs.password) {
        this.$refs.password.style['border-top-color'] = gray
      }
    },
    sidChanged () {
      this.errMsg = ''
      this.sidVerified = false
      this.password = ''

      this.$refs.studentID.style.removeProperty('border-bottom')
      this.$refs.studentID.style.removeProperty('border-bottom-left-radius')
      this.$refs.studentID.style.removeProperty('border-bottom-right-radius')
    },
    collapse (el) {
      gsap.fromTo(el, {
        height: 0,
        opacity: 0
      }, {
        height: '42px',
        opacity: 1
      })
    },
    collapseRev (el, done) {
      gsap.fromTo(el, {
        height: '42px',
        opacity: 1
      }, {
        height: 0,
        opacity: 0,
        onComplete: done
      })
    },
    sidAuth () {
      axios
        .post('//' + backendHost + ':3000/sid-auth', { studentID: this.studentID })
        .then(() => {
          this.errMsg = ' '
          this.sidVerified = true
          this.$refs.studentID.style.cssText = `
            border-bottom: 0;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
          `
          this.$nextTick(() => { this.$refs.password.focus() })
        })
        .catch(err => {
          if (err.response && err.response.status === 400) {
            this.errMsg = '您並未申請學生交換計畫'
            this.sidVerified = false
          }
        })
    },
    ssoAuth () {
      this.$store
        .dispatch('ssoAuth', {
          studentID: this.studentID,
          password: this.password
        })
        .then(() => {
          this.$router.push({ name: 'Home' })
        })
        .catch(err => {
          if (err.response && err.response.status === 400) {
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
  background-image: url('~@/assets/images/bg.webp');

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
  height: 400px;
}
.logo {
  width: 250px;
  margin: 1rem;
}
.title {
  font-size: 21px;
  margin-bottom: 13px;
}
.form {
  position: relative;
  height: 42px;
}
input {
  position: relative;
  font-size: 17px;
  width: 270px;
  height: 100%;
  padding: 0 43px 0 15px;
  background: #fff;
  border: 1px solid #d6d6d6;
  border-radius: 6px;
  vertical-align: top;
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
button {
  position: absolute;
  top: 7.5px;
  right: 6px;
  z-index: 3;
  cursor: pointer;
  background: none;
  border: none;
}
</style>
