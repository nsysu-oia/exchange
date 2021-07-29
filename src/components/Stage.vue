<template>
  <div :style="sectionStyle(1, stage.style)">
    <router-link
      :to="{name: 'StageDetails', params: { stageTitle: stage.title } }"
      class="stage-title-link"
    >
      <div class="stage-title" :style="stage.style" >{{ stage.title }}</div>
    </router-link>
  </div>

  <div :style="sectionStyle(2, stage.style)">
    <ul v-if="stage.notes.length" class="note">
      <li
        v-for="(note, index) in stage.notes"
        :key="index"
        >{{ note.title }}</li>
    </ul>
  </div>

  <div :style="sectionStyle(3, stage.style)">
    <div v-if="!mobileDevice || !!stage.applies.length" class="section-title" :style="stage.style">申請或登錄</div>
    <ul v-if="stage.applies.length">
      <li
        v-for="(apply, index) in stage.applies"
        :key="index"
        :style="{ listStyle: 'url(' + (apply.done ? icons[0] : icons[1]) + ')' }"
      >{{ apply.title }}</li>
    </ul>
  </div>

  <div :style="sectionStyle(4, stage.style)">
    <div v-if="!mobileDevice || !!stage.uploads.length" class="section-title" :style="stage.style">上傳檔案區</div>
    <ul v-if="stage.uploads.length">
      <li
        v-for="(upload, index) in stage.uploads"
        :key="index"
        :style="{ listStyle: 'url(' + icons[2] + ')' }"
      >{{ upload.title }}</li>
    </ul>
  </div>

  <div :style="sectionStyle(5, stage.style)">
    <div v-if="!mobileDevice || !!stage.downloads.length" class="section-title" :style="stage.style">下載檔案區</div>
    <ul>
      <!-- we will need this ul on the mobile devices even if no downloads.
           So we can present the bottom border-radius --->
      <li
        v-for="(download, index) in stage.downloads"
        :key="index"
        :style="{ listStyle: 'url(' + icons[3] + ')' }"
      >{{ download.title }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Stage',
  props: {
    stage: {
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
    }
  },
  methods: {
    sectionStyle (index, stageStyle) {
      // styles tailored for each section
      var style = {}
      if (index === 1) {
        style.marginTop = '1em'
        style.borderRadius = '10px 10px 0 0'
        style.overflow = 'hidden'
      } else {
        style.borderLeft = '3px solid ' + stageStyle.backgroundColor
        style.borderRight = '3px solid ' + stageStyle.backgroundColor
      }
      if (index === 5) {
        style.borderRadius = '0 0 10px 10px'
        style.borderBottom = '3px solid ' + stageStyle.backgroundColor
      }
      if (!this.mobileDevice) {
        style.gridRow = index
      }
      return style
    }
  }
}
</script>

<style scoped>
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
.stage-title {
  font-size: 20pt;
  padding: 20px 5px;
  white-space: nowrap;
  transition: transform .2s;
}
.stage-title:hover {
  transform: scale(1.05, 1.05);
}
.stage-title-link {
  color: #2c3e50;
  text-decoration: none;
}
.section-title {
  border-radius: 20px;
  padding: 5px;
  margin: 10px 25%;
}
ul.note {
  font-size: 13px;
  color: #666666;
  list-style: none;
  padding: 5px;
}
ul.note li:hover {
  background-color: revert;
}
</style>
