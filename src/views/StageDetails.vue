<template>
  <p v-if="!!errMsg">{{ errMsg }}</p>
  <template v-if="!!stage">
    <div>{{ stage.title }}</div>
    <ul v-if="stage.notes.length">
      <li
        v-for="(note, index) in stage.notes"
        :key="index"
      >{{ note.title }}</li>
    </ul>
    <div v-if="!mobileDevice || stage.applies.length">申請或登錄</div>
    <ul :v-if="stage.applies.length">
      <li
        v-for="(apply, index) in stage.applies"
        :key="index"
      >{{ apply.title }}</li>
    </ul>
    <div v-if="!mobileDevice || stage.uploads.length">上傳檔案區</div>
    <ul :v-if="stage.uploads.length">
      <li
        v-for="(upload, index) in stage.uploads"
        :key="index"
      >{{ upload.title }}</li>
    </ul>
    <div v-if="!mobileDevice || stage.downloads.length">下載檔案區</div>
    <ul :v-if="stage.downloads.length">
      <li
        v-for="(download, index) in stage.downloads"
        :key="index"
      >{{ download.title }}</li>
    </ul>
  </template>
</template>

<script>
export default {
  name: 'StageDetails',
  props: ['stageTitle'],
  data () {
    return {
      stage: null,
      errMsg: null
    }
  },
  created: function () {
    this.stage = require('@/assets/contents/stages.yaml').find(stage => stage.title === this.stageTitle)
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
