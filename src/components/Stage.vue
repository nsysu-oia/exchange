<template>
  <div :style="sectionStyle(1, stage.style)">
    <router-link
      :to="{ name: 'StageDetails', params: { stageTitle: stage.title } }"
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
    <!--<div v-if="!mobileDevice || !!stage.applies.length" class="section-title" :style="stage.style">申請或登錄</div>-->
    <ul v-if="stage.applies.length">
      <li
        v-for="(apply, index) in stage.applies"
        :key="index"
        :style="{ listStyle:
          svgBullet(
            apply.done ? '已填寫' : '填寫',
            apply.done ? 'rgb(52,199,89)' : 'rgb(0,122,255)'
          )
        }"
        @click="routerPush(apply.route)"
      ><span>{{ apply.title }}</span></li>
    </ul>
    <ul v-if="stage.uploads.length">
      <li
        v-for="(upload, index) in stage.uploads"
        :key="index"
        :style="{ listStyle:
          svgBullet(
            upload.done ? '已上傳' : '上傳',
            upload.done ? 'rgb(52,199,89)' : 'rgb(0,122,255)'
          )
        }"
      ><span>{{ upload.title }}</span></li>
    </ul>
    <ul v-if="stage.downloads.length">
      <li
        v-for="(download, index) in stage.downloads"
        :key="index"
        :style="{ listStyle: svgBullet('下載', 'rgb(52,199,89)') }"
      ><span>{{ download.title }}</span></li>
    </ul>
  </div>

  <div :style="sectionStyle(4, stage.style)">
    <div v-if="!mobileDevice || !!Object.keys(stage.forScholarship).length" class="section-title" :style="stage.style">獎助生專區</div>
    <template v-if="!!Object.keys(stage.forScholarship).length">
    <ul v-if="stage.forScholarship.applies.length">
      <li
        v-for="(apply, index) in stage.forScholarship.applies"
        :key="index"
        :style="{ listStyle:
          svgBullet(
            apply.done ? '已填寫' : '填寫',
            apply.done ? 'rgb(52,199,89)' : 'rgb(0,122,255)'
          )
        }"
      ><span>
      <router-link v-if="!!apply.route" :to="{ name: apply.route }">{{ apply.title }}</router-link>
        <template v-else>{{ apply.title }}</template>
      </span></li>
    </ul>
    <ul v-if="stage.forScholarship.uploads.length">
      <li
        v-for="(upload, index) in stage.forScholarship.uploads"
        :key="index"
        :style="{ listStyle:
          svgBullet(
            upload.done ? '已上傳' : '上傳',
            upload.done ? 'rgb(52,199,89)' : 'rgb(0,122,255)'
          )
        }"
      ><span>{{ upload.title }}</span></li>
    </ul>
    <ul v-if="stage.forScholarship.downloads.length">
      <li
        v-for="(download, index) in stage.forScholarship.downloads"
        :key="index"
        :style="{ listStyle: svgBullet('下載', 'rgb(52,199,89)') }"
      ><span>{{ download.title }}</span></li>
    </ul>
    </template>
    <ul v-else></ul>
    <!-- we will need this ul on the mobile devices even if no forScholarship.
         So we can present the bottom border-radius --->
  </div>
</template>

<script>
import router from '@/router'
export default {
  name: 'Stage',
  props: {
    stage: {
      type: Object,
      required: true
    }
  },
  /*
  data () {
    return {
    }
  },
  */
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
      if (index === 4) {
        style.borderRadius = '0 0 10px 10px'
        style.borderBottom = '3px solid ' + stageStyle.backgroundColor
      }
      if (!this.mobileDevice) {
        style.gridRow = index
      }
      return style
    },
    svgBullet (text, color) {
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="54" height="26">
          <rect x="2" y="2" width="50" height="22" rx="11" ry="11" style="fill:white;stroke:${color};stroke-width:2;" />
          <text x="${24 - 5 * text.length}" y="17"
                font-size="12"
                font-family="Avenir, Helvetica, Arial, sans-serif"
                fill="${color}"
          >${text}</text>
        </svg>
      `
      return `url('data:image/svg+xml;utf8,${encodeURIComponent(svg)}')`
    },
    routerPush (name) {
      if (!name) {
        return
      }
      router.push({ name })
    }
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
  display: block;
  width: 100%;
  height: 100%;
  color: inherit;
}
li span {
  position: relative;
  top: -6px;
}
li {
  text-align: left;
  padding: 5px;
  border-radius: 5px;
  margin-right: 10px;
  transition: background-color .3s;
}
ul:not(.note) li {
  margin-left: 30px;
  cursor: pointer;
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
