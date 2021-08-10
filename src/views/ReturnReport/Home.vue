<template>
  <div v-for="(section, sectionIndex) in Object.keys(questions)" :key="sectionIndex">
    <h2>{{ section }}</h2>
    <div v-for="(question, name, questionIndex) in questions[section]" :key="questionIndex">
      <label :for="question.label">{{ question.label }}</label>
      <!-- select -->
      <select
        v-if="question.type === 'select'"
        :id="question.label"
        v-model="question.value"
      >
        <option disabled value="">請選擇</option>
        <option
          v-for="(option, optionIndex) in question.options"
          :key="optionIndex"
        >{{ option }}</option>
      </select>
      <!-- textarea -->
      <textarea v-else-if="question.type === 'textarea'" :id="question.label" v-model="question.value" />
      <!-- checkbox -->
      <div v-else-if="question.type === 'checkbox'">
        <div v-for="(option, optionIndex) in question.options" :key="optionIndex">
          <input type="checkbox" :id="option" :value="option" v-model="question.value" />
          <label :for="option">{{ option }}</label>
          <input v-if="option === '其他'" type=text>
        </div>
      </div>
      <!-- input -->
      <input
        v-else
        :type="question.type"
        :id="question.label"
        v-model="question.value"
        :readonly="question.readonly"
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
        console.log(data)
        for (const section in this.questions) {
          for (const question in this.questions[section]) {
            this.questions[section][question].value = data[question]
          }
        }
        // update the fillDate to today
        // const today = new Date()
        // this.questions['基本資料'].fillDate.value = today.toISOString().split('T')[0]
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
    }
  }
}
</script>

<style scoped>
</style>
