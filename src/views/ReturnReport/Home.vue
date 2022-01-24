<template>
  <h1>返國報告書</h1>
  <div class="export" :style="{ 'width': sectionWidth }">
    <p><b>預覽報告書並提交至國際處</b></p>
    <button type="button" class="button" @click="validateAndExport('研修資訊.pdf')">研修資訊</button>
    <button type="button" class="button" @click="validateAndExport('心得感想.pdf')">心得感想</button>
  </div>
  <div v-if="!!questions" ref="contents">
    <div class="section" v-for="(section, sectionIndex) in Object.keys(questions)" :key="sectionIndex" :style="{ 'width': sectionWidth }">
      <h2>{{ section }}</h2>
      <div v-for="(question, identifier, questionIndex) in questions[section]" :key="questionIndex">
        <transition @before-enter="collapse" @leave="collapseRev" :css="false">
          <div v-if="checkDependency(question.dependency, question.dependencyValue)">
            <label class="question" :for="section+';'+identifier">{{ question.label }}</label>
            <!-- select -->
            <select
              v-if="question.type === 'select'"
              :id="section+';'+identifier"
              v-model="question.value"
              @change="syncDB"
              @blur="validate"
              @input="removeMark"
            >
              <option disabled value="">請選擇</option>
              <option
                v-for="(option, optionIndex) in question.options"
                :key="optionIndex"
              >{{ option }}</option>
            </select>
            <!-- textarea -->
            <textarea
              class="js-autoresize"
              v-else-if="question.type === 'textarea'"
              :placeholder="question.required ? '必填' : null"
              :id="section+';'+identifier" v-model.lazy="question.value"
              @change="syncDB"
              @blur="validate"
              @input="removeMark"
            />
            <!-- checkbox -->
            <div v-else-if="question.type === 'checkbox'">
              <div v-for="(option, optionIndex) in question.options" :key="optionIndex">
                <input
                  type="checkbox"
                  :id="section+';'+identifier+';'+option"
                  :value="option"
                  v-model="question.value"
                  @change="syncDB"
                  style="width: initial;"
                />
                <label :for="section+';'+identifier+';'+option">{{ option }}</label>
                <input
                  v-if="option==='其他' && question.value.includes(option)"
                  type=text
                  v-model.lazy="question.otherDetail"
                  :id="section+';'+identifier+';otherDetail'"
                  @change="otherDetailSyncDB"
                />
              </div>
            </div>
            <!-- input -->
            <input
              v-else
              :placeholder="question.required ? '必填' : null"
              :type="question.type"
              :id="section+';'+identifier"
              v-model.lazy="question.value"
              :readonly="question.readonly"
              @change="syncDB"
              @blur="validate"
              @input="removeMark"
              v-on="{ keypress: (question.type === 'number') ? isNumber : null }"
            />
            <!-- v-on syntax above: https://github.com/vuejs/vue/issues/7349#issuecomment-354937350 -->
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
import { makeFormReport, makeReviewReport } from './MakeReport'
const backendHost = process.env.VUE_APP_BACKEND_HOST || 'localhost'
function resize () {
  this.style.height = 'auto' // shrink
  this.style.height = `${this.scrollHeight}px` // grow
}
export default {
  name: 'Home',
  data () {
    return {
      questions: require('@/assets/contents/return-report.yaml'),
      stages: require('@/assets/contents/stages.yaml')
    }
  },
  created () {
    axios
      .get('//' + backendHost + ':3000/return-report')
      .then(({ data }) => {
        for (const section in this.questions) {
          for (const question in this.questions[section]) {
            this.questions[section][question].value = data[question]
            if (this.questions[section][question].type === 'checkbox') {
              // an exception in the overal structure
              // used by the input box after the `other` checkbox
              //   level 1 --v  level 2 --v       v-- this is the only level 3 question
              this.questions[section][question].otherDetail = data[question.slice(0, -1) + 'OtherDetail']
            }
          }
        }
        this.$nextTick(function () {
          const targets = this.$refs.contents.querySelectorAll('.js-autoresize')
          targets.forEach(target => {
            target.style.height = `${target.scrollHeight}px`
          })
        })
      })
  },
  mounted () {
    this.$nextTick(function () {
      const targets = this.$refs.contents.querySelectorAll('.js-autoresize')
      targets.forEach(target => {
        target.style.height = `${target.scrollHeight}px`
        target.addEventListener('input', resize)
      })
    })
  },
  computed: {
    sectionWidth () {
      switch (this.$store.state.windowSize) {
        case 'xs':
        case 'sm':
          return '85%'
        default:
          return '50%'
      }
    },
    today () {
      const today = new Date()
      return today.toISOString().split('T')[0]
    }
  },
  methods: {
    collapse (el) {
      gsap.fromTo(el, {
        scale: 0,
        opacity: 0
      }, {
        scale: 1,
        opacity: 1,
        ease: 'back',
        transformOrigin: '0% 50%'
      })
    },
    collapseRev (el, done) {
      gsap.fromTo(el, {
        scale: 1,
        opacity: 1
      }, {
        scale: 0,
        opacity: 0,
        ease: 'back',
        transformOrigin: '0% 50%',
        onComplete: done
      })
    },
    checkDependency (dependency, dependencyValue) {
      if (dependencyValue === undefined) {
        return true
      }
      // dependency and dependencyValue should both be provided in the yaml or neither
      if (this.questions[dependency[0]][dependency[1]].value === dependencyValue) {
        return true
      }
      return false
    },
    isNumber (e) {
      const charCode = e.which ? e.which : e.keyCode
      if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
        e.preventDefault()
      }
    },
    syncDB (e) {
      const ids = e.target.id.split(';')
      const values = {} // values to be send to backend
      values[ids[1]] = this.questions[ids[0]][ids[1]].value
      values.fillDate = this.today
      this.questions.基本資料.fillDate.value = values.fillDate

      if (e.target.type === 'number' && ids[1].substring(0, 4) === 'cost') {
        if (!e.target.value) { // empty string
          this.questions[ids[0]][ids[1]].value = values[ids[1]] = '0'
        }
        // an exception action for handling costTotal
        // summing the cost
        let costTotal = 0
        for (const index in this.questions[ids[0]].costTotal.isSumOf) {
          const costItem = this.questions[ids[0]].costTotal.isSumOf[index]
          costTotal += parseInt(this.questions[ids[0]][costItem].value)
        }
        this.questions[ids[0]].costTotal.value = costTotal
        values.costTotal = costTotal
      }

      axios
        .post('//' + backendHost + ':3000/return-report', { values })
    },
    otherDetailSyncDB (e) {
      const ids = e.target.id.split(';')
      const values = {}
      values[ids[1].slice(0, -1) + 'OtherDetail'] = this.questions[ids[0]][ids[1]].otherDetail
      values.fillDate = this.today
      this.questions.基本資料.fillDate.value = values.fillDate
      axios
        .post('//' + backendHost + ':3000/return-report', { values })
    },
    validate (e) {
      const ids = e.target.id.split(';')
      const question = this.questions[ids[0]][ids[1]]
      if (question.required) {
        if (!question.value) {
          e.target.style['border-color'] = '#e30000'
          e.target.style['background-color'] = '#fff2f4'
        }
      }
    },
    removeMark (e) {
      e.target.style.removeProperty('border-color')
      e.target.style.removeProperty('background-color')
    },
    validateAndExport (filename) {
      // validate
      for (const sectionIdx of Object.keys(this.questions).slice(
        (filename === '研修資訊.pdf') ? 0 : -1,
        (filename === '研修資訊.pdf') ? -1 : this.questions.length
      )) {
        for (const questionIdx in this.questions[sectionIdx]) {
          const question = this.questions[sectionIdx][questionIdx]
          if (
            this.checkDependency(question.dependency, question.dependencyValue) &&
            question.required &&
            !question.value
          ) {
            const el = document.getElementById(sectionIdx + ';' + questionIdx)
            el.scrollIntoView({ behavior: 'smooth', block: 'center' })
            el.style['border-color'] = '#e30000'
            el.style['background-color'] = '#fff2f4'
            return
          }
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
      const uploadToSyno = (file) => {
        const formData = new FormData()
        formData.append(
          'path',
          this.stages[4].applies[0].path + '/' +
          this.questions.基本資料.semester.value.substring(0, 5) + '/' +
          this.questions.基本資料.countryChi.value + '_' +
          this.questions.基本資料.universityChi.value + '_' +
          this.questions.基本資料.nameChi.value
        )
        formData.append('filename', filename)
        formData.append('file', file)

        axios
          .post('//' + backendHost + ':3000/return-report/upload', formData)
          // .catch(e => {
          //   console.log(e)
          // })
      }

      // make a deep copy of questions to prevent modifications
      const questions = JSON.parse(JSON.stringify(this.questions))

      const report = (filename === '研修資訊.pdf')
        ? makeFormReport(questions)
        : makeReviewReport(questions)

      // immediately open new window after button click to prevent popup blocker
      const win = window.open('', '_blank')

      report.getBlob(blob => {
        openInNewWin(blob, win)
        uploadToSyno(blob)
      })
    }
  }
}
</script>

<style scoped>
input, select, textarea {
  font-size: 16px;
  line-height: 24px;
  padding: 5px 10px;
  border: .0625rem solid #d2d2d7;
  border-radius: .25rem;
  width: 100%;
  color: #1d1d1f;
  box-sizing: border-box;
  font-family:inherit;
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
  background-color: #F5F5F7;
  border-radius: 15px;
  margin: 0 auto;
  padding-bottom: 20px;
}
.section {
  text-align: left;
  margin: 0 auto;
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
  font-size: 17px;
}
</style>
