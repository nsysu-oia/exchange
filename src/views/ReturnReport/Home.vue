<template>
  <div v-for="(section, sectionIndex) in Object.keys(questions)" :key="sectionIndex">
    <h2>{{ section }}</h2>
    <div v-for="(question, identifier, questionIndex) in questions[section]" :key="questionIndex">
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
      />
    </div>
  </div>
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
    syncDB (e) {
      this.questions.基本資料.fillDate.value = this.today
      const ids = e.target.id.split(';')
      axios
        .post('//' + backendHost + ':3000/return-report', {
          identifier: ids[1],
          value: this.questions[ids[0]][ids[1]].value,
          fillDate: this.today
        })
    },
    otherDetailSyncDB (e) {
      this.questions.基本資料.fillDate.value = this.today
      const ids = e.target.id.split(';')
      axios
        .post('//' + backendHost + ':3000/return-report', {
          identifier: ids[1].slice(0, -1) + 'OtherDetail',
          value: this.questions[ids[0]][ids[1]].otherDetail,
          fillDate: this.today
        })
    }
  }
}
</script>

<style scoped>
</style>
