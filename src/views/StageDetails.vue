<template>
  <p v-if="!!errMsg">{{ errMsg }}</p>
  <template v-if="!!stage.general">
    <div>{{ stage.title }}</div>
    <ul v-if="stage.notes">
      <li v-for="(note, index) in stage.notes" :key="index">
        {{ note.title }}
      </li>
    </ul>
    <div v-if="!mobileDevice || stage.general.applies">申請或登錄</div>
    <ul :v-if="stage.general.applies">
      <li v-for="(apply, index) in stage.general.applies" :key="index">
        {{ apply.title }}
      </li>
    </ul>
    <div v-if="!mobileDevice || stage.general.uploads">上傳檔案區</div>
    <ul :v-if="stage.general.uploads">
      <li v-for="(upload, index) in stage.general.uploads" :key="index">
        {{ upload.title }}
      </li>
    </ul>
    <div v-if="!mobileDevice || stage.general.downloads">下載檔案區</div>
    <ul :v-if="stage.general.downloads">
      <li v-for="(download, index) in stage.general.downloads" :key="index">
        {{ download.title }}
      </li>
    </ul>
  </template>
</template>

<script>
import stages from '@/assets/contents/stages.yaml'
export default {
  name: 'StageDetails',
  props: ['stageTitle'],
  data() {
    return {
      stage: null,
      errMsg: null
    }
  },
  created: function () {
    this.stage = stages.find(stage => stage.title === this.stageTitle)
  },
  computed: {
    mobileDevice() {
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
