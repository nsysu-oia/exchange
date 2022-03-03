<template>
  <h1>交換證明書</h1>
  <div class="export" :style="{ width: sectionWidth }">
    <button
      type="button"
      class="button"
      @click="validateAndExport"
    >
      匯出報告書
    </button>
  </div>
  <div v-if="!!questions" ref="contents">
    <div class="section" :style="{ width: sectionWidth }">
      <div
        v-for="(question, identifier, questionIndex) in questions"
        :key="questionIndex"
      >
        <transition @before-enter="collapse" @leave="collapseRev" :css="false">
          <div>
            <label class="question" :for="identifier">{{
              question.label
            }}</label>
            <!-- select -->
            <select
              v-if="question.type === 'select'"
              :id="identifier"
              v-model="question.value"
              @change="syncDB"
              @blur="validate"
              @input="removeMark"
            >
              <option disabled value="">請選擇</option>
              <option
                v-for="(option, optionIndex) in question.options"
                :key="optionIndex"
              >
                {{ option }}
              </option>
            </select>
            <!-- input -->
            <input
              v-else
              :placeholder="question.required ? '必填' : null"
              :type="question.type"
              :id="identifier"
              v-model.lazy="question.value"
              :readonly="question.readonly"
              @change="syncDB"
              @blur="validate"
              @input="removeMark"
            />
          </div>
        </transition>
      </div>
    </div>
  </div>
  <p style="margin-top: 30px">&nbsp;</p>
</template>

<script>
import axios from 'axios'
import gsap from 'gsap'
import makeReport from './MakeReport'
const backendHost = import.meta.env.VITE_BACKEND_HOST || 'localhost'
import stages from '@/assets/contents/stages.yaml'
import questions from '@/assets/contents/proof-of-exchange.yaml'
function resize() {
  this.style.height = 'auto' // shrink
  this.style.height = `${this.scrollHeight}px` // grow
}
export default {
  name: 'Home',
  data() {
    return {
      questions: null,
      stages: null
    }
  },
  created() {
    this.questions = JSON.parse(JSON.stringify(questions)) // make a deep clone to avoid cache
    this.stages = JSON.parse(JSON.stringify(stages)) // make a deep clone to avoid cache
    axios.get('//' + backendHost + ':3000/proof-of-exchange').then(({ data }) => {
      for (const question in this.questions) {
        this.questions[question].value = data[question]
      }

      this.questions['birthDate'].value = new Date(
        parseInt(data.birthYear) + 1911,
        data.birthMonth - 1,
        data.birthDay
      ).toISOString().split('T')[0]

      // setup textarea auto resizing
      this.$nextTick(function () {
        const targets = this.$refs.contents.querySelectorAll('.js-autoresize')
        targets.forEach(target => {
          target.style.height = `${target.scrollHeight}px`
        })
      })
    })
  },
  mounted() {
    this.$nextTick(function () {
      const targets = this.$refs.contents.querySelectorAll('.js-autoresize')
      targets.forEach(target => {
        target.style.height = `${target.scrollHeight}px`
        target.addEventListener('input', resize)
      })
    })
  },
  computed: {
    sectionWidth() {
      switch (this.$store.state.windowSize) {
        case 'xs':
        case 'sm':
          return '85%'
        default:
          return '50%'
      }
    },
    today() {
      const today = new Date()
      return today.toISOString().split('T')[0]
    }
  },
  methods: {
    collapse(el) {
      gsap.fromTo(
        el,
        {
          scale: 0,
          opacity: 0
        },
        {
          scale: 1,
          opacity: 1,
          ease: 'back',
          transformOrigin: '0% 50%'
        }
      )
    },
    collapseRev(el, done) {
      gsap.fromTo(
        el,
        {
          scale: 1,
          opacity: 1
        },
        {
          scale: 0,
          opacity: 0,
          ease: 'back',
          transformOrigin: '0% 50%',
          onComplete: done
        }
      )
    },
    syncDB(e) {
      const id = e.target.id
      const values = {} // values to be send to backend
      values[id] = this.questions[id].value
      values.fillDate = this.today
      this.questions.fillDate.value = values.fillDate

      axios.post('//' + backendHost + ':3000/proof-of-exchange', { values })
    },
    validate(e) {
      const id = e.target.id
      const question = this.questions[id]
      if (question.required) {
        if (!question.value) {
          e.target.style['border-color'] = '#e30000'
          e.target.style['background-color'] = '#fff2f4'
        }
      }
    },
    removeMark(e) {
      e.target.style.removeProperty('border-color')
      e.target.style.removeProperty('background-color')
    },
    validateAndExport() {
      // validate
      for (const questionIdx in this.questions) {
        const question = this.questions[questionIdx]
        if (question.required && !question.value) {
          const el = document.getElementById(questionIdx)
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          el.style['border-color'] = '#e30000'
          el.style['background-color'] = '#fff2f4'
          return
        }
      }

      // validated
      const openInNewWin = async (blob, win) => {
        try {
          const urlCreator = window.URL || window.webkitURL
          win.location.href = urlCreator.createObjectURL(blob)
        } catch (e) {
          alert('預覽PDF失敗')
        }
      }

      // make a deep copy of questions to prevent modifications
      const questions = JSON.parse(JSON.stringify(this.questions))

      const report = makeReport(questions)

      // immediately open new window after button click to prevent popup blocker
      const win = window.open('', '_blank')

      report.getBlob(blob => {
        openInNewWin(blob, win)
      })
    }
  }
}
</script>

<style scoped>
input,
select,
textarea {
  font-size: 16px;
  line-height: 24px;
  padding: 5px 10px;
  border: 0.0625rem solid #d2d2d7;
  border-radius: 0.25rem;
  width: 100%;
  color: #1d1d1f;
  box-sizing: border-box;
  font-family: inherit;
}
input:read-only {
  background-color: #f1f1f1;
}
label.question {
  display: block;
  font-size: 18px;
  padding: 15px 0 5px 0;
}
h2 {
  padding-top: 15px;
}
.export {
  color: #696969;
  box-shadow: #696969 0px 0px 1px 0px inset, #696969 0px 0px 1px 0px;
  border: 1px solid #696969;
  background-color: #f5f5f7;
  border-radius: 15px;
  margin: 0 auto;
  padding: 20px 0;
}
.section {
  text-align: left;
  margin: 0 auto;
}
.button {
  background-color: #1c4a7c; /* Green */
  border: none;
  border-radius: 25px;
  color: white;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
  padding: 5px 20px;
  transition: transform 0.2s;
  font-family: inherit;
  font-size: 17px;
}
</style>
