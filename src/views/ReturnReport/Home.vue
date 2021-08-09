<template>
  <div v-for="(section, sectionIndex) in Object.keys(questions)" :key="sectionIndex">
    <h2>{{ section }}</h2>
    <div v-for="(question, name, questionIndex) in questions[section]" :key="questionIndex">
      <label :for="question.label">{{ question.label }}</label>
      <!-- select -->
      <select v-if="question.type === 'select'" :id="question.label">
        <option
          v-for="(option, optionIndex) in question.options"
          :key="optionIndex"
          :value="option"
        >{{ option }}</option>
      </select>
      <!-- textarea -->
      <textarea v-else-if="question.type === 'textarea'" :id="question.label" />
      <!-- checkbox -->
      <div v-else-if="question.type === 'checkbox'">
        <div v-for="(option, optionIndex) in question.options" :key="optionIndex">
          <label :for="option">{{ option }}</label>
          <input type="checkbox" :id="option" />
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
      questions: require('@/assets/data/return-report.yaml')
    }
  },
  created () {
    axios
      .get('//' + backendHost + ':3000/return-report')
      .then(({ data }) => {
        for (const property in this.questions['基本資料']) {
          this.questions['基本資料'][property].value = data[property]
        }
        const today = new Date()
        this.questions['基本資料'].fillDate.value = today.toISOString().split('T')[0]
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
