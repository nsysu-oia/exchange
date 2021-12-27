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
        <button v-if="!sidVerified" :disabled="!studentID" @click="sidAuth" />
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
          <button :disabled="!password" @click="ssoAuth" />
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
      if (this.sidVerified) {
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
          this.$router.push({
            // TODO: The return report system is published first
            //       This prevent these users access the under-constructing homepage.
            name: this.$store.state.user.returnReportOnly
              ? 'ReturnReport'
              : 'Home'
          })
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
