<template>
  <div class="wrapper" :style="{ '--border-color': stage.style.backgroundColor }">
    <router-link
      :to="{name: 'StageDetails', params: { id: stage.id } }"
      class="stage-title-link"
    >
      <div class="stage-title" :style="stage.style" >{{ stage.id }}</div>
    </router-link>

    <ul v-if="stage.notes.length" class="note" :style="{ height: noteH }">
      <li
        v-for="note in stage.notes"
        :key="note.id"
      >{{ note.title }}</li>
    </ul>
    <ul v-else :style="{ height: noteH }"></ul>

    <div v-if="!mobileDevice || !!stage.applies.length">申請或登錄</div>
    <ul v-if="stage.applies.length" :style="{ height: applyH }">
      <li
        v-for="apply in stage.applies"
        :key="apply.id"
        :style="{ listStyle: 'url(' + (apply.done ? icons[0] : icons[1]) + ')' }"
      >{{ apply.title }}</li>
    </ul>
    <ul v-else :style="{ height: applyH }"></ul>

    <div v-if="!mobileDevice || !!stage.uploads.length">上傳檔案區</div>
    <ul v-if="stage.uploads.length" :style="{ height: uploadH }">
      <li
        v-for="upload in stage.uploads"
        :key="upload.id"
        :style="{ listStyle: 'url(' + icons[2] + ')' }"
      >{{ upload.title }}</li>
    </ul>
    <ul v-else :style="{ height: uploadH }"></ul>

    <div v-if="!mobileDevice || !!stage.downloads.length">下載檔案區</div>
    <ul v-if="stage.downloads.length" :style="{ height: downloadH }">
      <li
        v-for="download in stage.downloads"
        :key="download.id"
        :style="{ listStyle: 'url(' + icons[3] + ')' }"
      >{{ download.title }}</li>
    </ul>
    <ul v-else :style="{ height: downloadH }"></ul>
  </div>
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
  data () {
    return {
      icons: [
        require('@/assets/icons/check-box-done.svg'),
        require('@/assets/icons/check-box.svg'),
        require('@/assets/icons/upload.svg'),
        require('@/assets/icons/download.svg')
      ]
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
    noteH () { return this.mobileDevice ? 'initial' : this.divHeight.note + 'px' },
    applyH () { return this.mobileDevice ? 'initial' : this.divHeight.apply + 'px' },
    uploadH () { return this.mobileDevice ? 'initial' : this.divHeight.upload + 'px' },
    downloadH () { return this.mobileDevice ? 'initial' : this.divHeight.download + 'px' }
  }
}
</script>

<style scoped>
.wrapper {
  margin: 5px;
  border-radius: 10px;
  border: 3px solid var(--border-color);
  overflow: hidden;
}
li {
  text-align: left;
  padding: 5px;
  margin-right: 10px;
  border-radius: 5px;
  transition: background-color .3s;
}
li:hover {
  background-color: #d6d6d6;
}
.stage:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2);
}
.stage-title {
  font-size: 20pt;
  padding: 20px 5px;
}
.stage-title-link {
  color: #2c3e50;
  text-decoration: none;
}
ul.note {
  font-size: 13px;
  color: #666666;
  list-style: none;
  padding: 5px;
  margin: 0;
}
ul.note li:hover {
  background-color: revert;
}
</style>
