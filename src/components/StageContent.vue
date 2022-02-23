<template>
  <ul>
    <li
      v-for="(item, index) in items"
      :key="index"
      :style="itemStyle(item)"
      @click="itemCallback(item)"
    >
      <span>{{ item.title }}</span>
    </li>
  </ul>

  <div v-if="uploadWindow" class="overlay" @click="closeUploadWindow"></div>
  <transition>
    <Upload
      v-if="uploadWindow"
      :item="uploadItem"
      :accentStyle="accentStyle"
      @uploading="uploadWindowLock = newUpload = true"
      @uploaded="uploadWindowLock = false"
    />
  </transition>
</template>

<script>
import router from '@/router'
import Upload from '@/components/Upload.vue'
export default {
  name: 'StageContent',
  props: {
    items: {
      type: Array,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    accentStyle: {
      type: Object,
      required: true
    }
  },
  components: {
    Upload
  },
  data() {
    return {
      uploadWindow: false,
      uploadItem: null,
      uploadWindowLock: false,
      newUpload: false
    }
  },
  methods: {
    svgBullet(text, color, invert) {
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="54" height="26">
          <rect x="2" y="2" width="50" height="22" rx="11" ry="11"
                style="fill:${
                  invert ? color : 'white'
                };stroke:${color};stroke-width:2;" />
          <text
            x="${24 - 5 * text.length}" y="17"
            font-size="12"
            font-family="Avenir, Helvetica, Arial, sans-serif"
            fill="${invert ? 'white' : color}"
          >${text}</text>
        </svg>
      `
      return `url('data:image/svg+xml;utf8,${encodeURIComponent(svg)}')`
    },
    itemStyle(item) {
      switch (this.type) {
        case 'applies':
          return {
            '--list-style': this.svgBullet(
              item.done ? '已填寫' : '填寫',
              item.done ? 'rgb(52,199,89)' : 'rgb(0,122,255)'
            ),
            '--list-style-hover': this.svgBullet(
              item.done ? '已填寫' : '填寫',
              item.done ? 'rgb(52,199,89)' : 'rgb(0,122,255)',
              true
            )
          }
        case 'uploads':
          return {
            '--list-style': this.svgBullet(
              item.done ? '已上傳' : '上傳',
              item.done ? 'rgb(52,199,89)' : 'rgb(0,122,255)'
            ),
            '--list-style-hover': this.svgBullet(
              item.done ? '已上傳' : '上傳',
              item.done ? 'rgb(52,199,89)' : 'rgb(0,122,255)',
              true
            )
          }
        case 'downloads':
          return {
            '--list-style': this.svgBullet('下載', 'rgb(52,199,89)'),
            '--list-style-hover': this.svgBullet('下載', 'rgb(52,199,89)', true)
          }
        default:
          break
      }
    },
    itemCallback(item) {
      switch (this.type) {
        case 'applies':
          this.routerPush(item.route)
          break
        case 'uploads':
          this.openUploadWindow(item)
          break
        case 'downloads':
          break
        default:
          break
      }
    },
    routerPush(name) {
      if (!name) {
        return
      }
      router.push({ name })
    },
    openUploadWindow(item) {
      this.uploadItem = item
      this.uploadWindow = true
    },
    closeUploadWindow() {
      if (this.uploadWindowLock) {
        return
      }
      this.uploadWindow = false
      if (this.newUpload) {
        // reload to fetch completed items
        this.$router.go()
      }
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
  list-style: var(--list-style);
  transition: all 0.3s;
  cursor: pointer;
}
li:hover {
  background-color: #d6d6d6;
  list-style: var(--list-style-hover);
}
.overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0);
  z-index: 1;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
