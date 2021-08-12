<template>
  <template v-if="!!questions">
    <div v-for="(section, sectionIndex) in Object.keys(questions)" :key="sectionIndex">
      <h2>{{ section }}</h2>
      <div v-for="(question, identifier, questionIndex) in questions[section]" :key="questionIndex">
        <template v-if="checkDependency(question.dependency, question.dependencyValue)">
          <label :for="section+';'+identifier">{{ question.label }}</label>
          <!-- select -->
          <select
            v-if="question.type === 'select'"
            :id="section+';'+identifier"
            v-model="question.value"
            @change="syncDB"
          >
            <option disabled value="">請選擇</option>
            <option
              v-for="(option, optionIndex) in question.options"
              :key="optionIndex"
            >{{ option }}</option>
          </select>
          <!-- textarea -->
          <textarea
            v-else-if="question.type === 'textarea'"
            :id="section+';'+identifier" v-model.lazy="question.value"
            @change="syncDB"
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
            :type="question.type"
            :id="section+';'+identifier"
            v-model.lazy="question.value"
            :readonly="question.readonly"
            @change="syncDB"
            v-on="{ keypress: (question.type === 'number') ? isNumber : null }"
          />
          <!-- v-on syntax above: https://github.com/vuejs/vue/issues/7349#issuecomment-354937350 -->
        </template>
      </div>
    </div>
  </template>
</template>

<script>
import axios from 'axios'
const backendHost = process.env.VUE_APP_BACKEND_HOST || 'localhost'
export default {
  name: 'Home',
  data () {
    return {
      questions: require('@/assets/contents/return-report.yaml')
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
      })
  },
  computed: {
    mobileDevice () {
      switch (this.$store.state.windowSize) {
        case 'xs':
        case 'sm':
        case 'md':
          return true
        default:
          return false
      }
    },
    today () {
      const today = new Date()
      return today.toISOString().split('T')[0]
    }
  },
  methods: {
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
      const values = {}
      values[ids[1]] = this.questions[ids[0]][ids[1]].value
      values.fillDate = this.today
      this.questions.基本資料.fillDate.value = values.fillDate

      if (e.target.type === 'number' && ids[1].substring(0, 4) === 'cost') {
        // an exception for handling costTotal
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
    }
  }
}
</script>

<style scoped>
</style>
