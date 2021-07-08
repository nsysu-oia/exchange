<template>
  <router-link
    class="stage-link"
    :to="{name: 'StageDetails', params: { id: stage.id } }"
  >
    <div class="stage-title" :style="stage.style">{{ stage.id }}</div>
    <ul v-if="stage.notes.length" :style="{ height: noteH }">
      <li
        v-for="note in stage.notes"
        class="note"
        :key="note.id"
        :style="{ 'list-style': 'url(' + iconPath(0) + ')' }"
      >{{ note.title }}</li>
    </ul>
    <ul v-else :style="{ height: noteH }"></ul>
    <div v-if="!mobileDevice || stage.applies.length">申請或登錄</div>
    <ul v-if="stage.applies.length" :style="{ height: applyH }">
      <li
        v-for="apply in stage.applies"
        :key="apply.id"
        :style="{ 'list-style': 'url(' + iconPath(1, apply.done) + ')' }"
      >{{ apply.title }}</li>
    </ul>
    <ul v-else :style="{ height: applyH }"></ul>
    <div v-if="!mobileDevice || stage.uploads.length">上傳檔案區</div>
    <ul v-if="stage.uploads.length" :style="{ height: uploadH }">
      <li
        v-for="upload in stage.uploads"
        :key="upload.id"
        :style="{ 'list-style': 'url(' + iconPath(2) + ')' }"
      >{{ upload.title }}</li>
    </ul>
    <ul v-else :style="{ height: uploadH }"></ul>
    <div v-if="!mobileDevice || stage.downloads.length">下載檔案區</div>
    <ul v-if="stage.downloads.length" :style="{ height: downloadH }">
      <li
        v-for="download in stage.downloads"
        :key="download.id"
        :style="{ 'list-style': 'url(' + iconPath(3) + ')' }"
      >{{ download.title }}</li>
    </ul>
    <ul v-else :style="{ height: downloadH }"></ul>
  </router-link>
</template>

<script>
export default {
  name: 'Stage',
  props: {
    stage: {
      type: Object,
      required: true
    },
    divHeight: {
      type: Object,
      required: true
    }
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
    // For caching
    idH () { return this.mobileDevice ? 'initial' : this.divHeight.id + 'px' },
    noteH () { return this.mobileDevice ? 'initial' : this.divHeight.note + 'px' },
    applyH () { return this.mobileDevice ? 'initial' : this.divHeight.apply + 'px' },
    uploadH () { return this.mobileDevice ? 'initial' : this.divHeight.upload + 'px' },
    downloadH () { return this.mobileDevice ? 'initial' : this.divHeight.download + 'px' },

    noteIcon () { return require('@/assets/icons/note.svg') },
    checkBoxIcon () { return require('@/assets/icons/check-box.svg') },
    checkBoxDoneIcon () { return require('@/assets/icons/check-box-done.svg') },
    uploadIcon () { return require('@/assets/icons/upload.svg') },
    downloadIcon () { return require('@/assets/icons/download.svg') }
  },
  methods: {
    iconPath (section, done = false) {
      switch (section) {
        case 0:
          return "'" + this.noteIcon + "'"
        case 1:
          if (done) return "'" + this.checkBoxDoneIcon + "'"
          return "'" + this.checkBoxIcon + "'"
        case 2:
          return "'" + this.uploadIcon + "'"
        case 3:
          return "'" + this.downloadIcon + "'"
        default:
      }
    }
  }
}
</script>

<style scoped>
li {
  text-align: left;
  padding: 4px;
}
.stage:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2);
}
.stage-link {
  color: #2c3e50;
  text-decoration: none;
}
.stage-title {
  font-size: 20pt;
  padding: 20px 5px;
  border-radius: 10px 10px 0 0;
}
.note {
  font-size: 13px;
  color: #666666;
  font-style: italic;
}
</style>
