<template>
  <ul v-if="content.applies">
    <li
      v-for="(apply, index) in content.applies"
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
  <ul v-if="content.uploads">
    <li
      v-for="(upload, index) in content.uploads"
      :key="index"
      :style="{ listStyle:
        svgBullet(
          upload.done ? '已上傳' : '上傳',
          upload.done ? 'rgb(52,199,89)' : 'rgb(0,122,255)'
        )
      }"
      @click="openUploadWindow(upload)"
    ><span>{{ upload.title }}</span></li>
  </ul>
  <ul v-if="content.downloads">
    <li
      v-for="(download, index) in content.downloads"
      :key="index"
      :style="{ listStyle: svgBullet('下載', 'rgb(52,199,89)') }"
    ><span>{{ download.title }}</span></li>
  </ul>

  <div v-if="uploadWindow" class='overlay' @click="uploadWindow = !uploadWindow"></div>
  <Upload v-if="uploadWindow" :upload="uploadItem" />
</template>

<script>
import router from '@/router'
import Upload from '@/components/Upload.vue'
export default {
  name: 'StageContent',
  props: {
    content: {
      type: Object,
      required: true
    }
  },
  components: {
    Upload
  },
  data () {
    return {
      uploadWindow: false,
      uploadItem: null
    }
  },
  methods: {
    svgBullet (text, color) {
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="54" height="26">
          <rect x="2" y="2" width="50" height="22" rx="11" ry="11" style="fill:white;stroke:${color};stroke-width:2;" />
          <text
            x="${24 - 5 * text.length}" y="17"
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
    },
    openUploadWindow (item) {
      this.uploadItem = item
      this.uploadWindow = !this.uploadWindow
    }
  }
}
</script>

<style scoped>
ul {
  margin: 0;
}
li span {
  position: relative;
  top: -6px;
}
li {
  text-align: left;
  padding: 5px;
  border-radius: 5px;
  margin: 0 10px 0 30px;
  transition: background-color .3s;
  cursor: pointer;
}
li:hover {
  background-color: #d6d6d6;
}
.overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(255,255,255,0);
  z-index: 1;

  backdrop-filter: blur(5px);
}
</style>
