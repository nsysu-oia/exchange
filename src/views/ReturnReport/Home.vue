<template>
  <p v-if="!!errMsg">{{ errMsg }}</p>
  <div v-if="!!questions">
    <div v-for="(section, sectionIndex) in Object.keys(questions)" :key="sectionIndex">
      <h2>{{ section }}</h2>
      <div v-for="(question, questionIndex) in questions[section]" :key="questionIndex">
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
        <input v-else type="question.type" :id="question" />
      </div>
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
      questions: null,
      errMsg: null
    }
  },
  created: function () {
    const content = 'returnReport'
    axios
      .post('//' + backendHost + ':3000/content', { content })
      .then(({ data }) => { this.questions = data })
      .catch(err => {
        if (err.response.status === 400) {
          this.errMsg = 'Cannot fetch the content: ' + content
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
    }
  }
}
</script>

<style scoped>
</style>
