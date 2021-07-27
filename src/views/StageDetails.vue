<template>
  <template v-if="!!stage">
    <div>{{ stage.id }}</div>
    <ul v-if="stage.notes.length">
      <li
        v-for="note in stage.notes"
        :key="note.id"
      >{{ note.title }}</li>
    </ul>
    <div v-if="!mobileDevice || stage.applies.length">申請或登錄</div>
    <ul :v-if="stage.applies.length">
      <li
        v-for="apply in stage.applies"
        :key="apply.id"
      >{{ apply.title }}</li>
    </ul>
    <div v-if="!mobileDevice || stage.uploads.length">上傳檔案區</div>
    <ul :v-if="stage.uploads.length">
      <li
        v-for="upload in stage.uploads"
        :key="upload.id"
      >{{ upload.title }}</li>
    </ul>
    <div v-if="!mobileDevice || stage.downloads.length">下載檔案區</div>
    <ul :v-if="stage.downloads.length">
      <li
        v-for="download in stage.downloads"
        :key="download.id"
      >{{ download.title }}</li>
    </ul>
  </template>
</template>

<script>
import axios from 'axios'
const backendHost = process.env.VUE_APP_BACKEND_HOST || 'localhost'

export default {
  name: 'StageDetails',
  props: ['id'],
  data () {
    return {
      stage: null
    }
  },
  created: function () {
    // fetch UI content
    axios
      .post('//' + backendHost + ':3000/content', { content: 'stages' })
      .then(({ data }) => { this.stage = data.find(stage => stage.id === this.id) })
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
.frame {
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2);
}
</style>
