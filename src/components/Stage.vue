<template>
  <div :style="sectionStyle(1, stage.style)">
    <router-link
      :to="{ name: 'StageDetails', params: { stageTitle: stage.title } }"
      class="stage-title-link"
    >
      <div class="stage-title" :style="stage.style">{{ stage.title }}</div>
    </router-link>
  </div>

  <div :style="sectionStyle(2, stage.style)">
    <ul v-if="stage.notes">
      <li v-for="(note, index) in stage.notes" :key="index">
        {{ note.title }}
      </li>
    </ul>
  </div>

  <div
    v-for="(content, index) in [
      { id: 'applies', title: '申請或登錄' },
      { id: 'uploads', title: '上傳檔案區' },
      { id: 'downloads', title: '下載檔案區' }
    ]"
    :key="index"
    :style="sectionStyle(index + 3, stage.style)"
  >
    <template v-if="stage.title !== '校內甄選階段'">
      <div
        v-if="!mobileDevice || stage[content.id]"
        class="section-title"
        :style="stage.style"
      >
        {{ content.title }}
      </div>
      <StageContent
        v-if="stage[content.id]"
        :items="stage[content.id]"
        :type="content.id"
        :accentStyle="stage.style"
        :downloadLinks="downloadLinks"
      />
    </template>
    <template v-else-if="index === 0">
      <div class="apply-phase-message">
        恭喜您通過交換/雙聯校內甄選。接下來請依指示於時限內完成各階段應完成項目。
      </div>
    </template>
  </div>
</template>

<script>
import StageContent from '@/components/StageContent.vue'
export default {
  name: 'Stage',
  props: {
    stage: {
      type: Object,
      required: true
    },
    downloadLinks: {
      required: true
    }
  },
  components: {
    StageContent
  },
  /*
  data () {
    return {
    }
  },
  */
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
  },
  methods: {
    sectionStyle(index, stageStyle) {
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
      if (index === 3) {
        style.paddingTop = '10px'
      }
      if (index === 5) {
        style.borderRadius = '0 0 10px 10px'
        style.borderBottom = '3px solid ' + stageStyle.backgroundColor
        style.paddingBottom = '10px'
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
ul {
  font-size: 13px;
  color: #666666;
  list-style: none;
  padding: 5px;
  margin: 0;
}
li {
  text-align: left;
  padding: 5px;
}
.stage-title {
  font-size: 20pt;
  padding: 20px 5px;
  white-space: nowrap;
  transition: transform 0.2s;
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
.apply-phase-message {
  padding: 0 10px;
  font-size: 16pt;
}
</style>
