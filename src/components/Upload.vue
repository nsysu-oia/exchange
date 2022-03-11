<template>
  <div id="window">
    <h1>上傳{{ item.title }}</h1>
    接受檔案格式：<b>{{ item.extension }}</b>
    <input
      id="file"
      type="file"
      :accept="'.' + item.extension"
      :multiple="!!item.multiple"
      @change="filesSelected"
    />
    <div
      id="dropbox"
      class="dropbox"
      :style="{
        '--color': accentStyle.color,
        '--background-color': accentStyle.backgroundColor
      }"
    >
      <transition>
        <UploadPreview v-if="showUploadPreview" :item="item" :accentStyle="accentStyle" />
      </transition>
      <transition>
        <ul v-if="files">
          <li v-for="(file, index) in files" :key="index">
            <Spinner :state="fileStates[index]" :color="accentStyle.color" />
            <span>{{ file.name }}</span>
          </li>
        </ul>
      </transition>
      <transition>
        <svg
          v-show="!files && !showUploadPreview"
          id="icon"
          class="icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 50 43"
          :style="{ '--color': accentStyle.color }"
          @mouseover="mouseover"
          @mouseout="mouseout"
          @click="clickIcon"
        >
          <path
            d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z"
          />
        </svg>
      </transition>
      <label
        id="label"
        for="file"
        :style="{ '--color': accentStyle.color }"
        @mouseover="mouseover"
        @mouseout="mouseout"
      >
        選取檔案<span>或<span id="drag-label">拖曳至此</span></span>
      </label>
      <transition>
        <svg
          v-if="files && files[0].size"
          id="upload"
          class="upload"
          viewBox="0 0 212 160"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          @click="upload"
        >
          <g transform="matrix(1 0 0 1 36.20625732421877 115.221435546875)">
            <path
              d="M 37.9883 -2.00195 L 55.957 -2.00195 L 55.957 -9.86328 L 37.9883 -9.86328 C 25.6836 -9.86328 16.6016 -17.9688 16.6016 -27.8809 C 16.6016 -37.207 22.5098 -44.9219 32.8613 -44.9219 C 33.5449 -44.9219 33.7891 -45.3125 33.7891 -45.9473 C 33.7891 -60.9375 44.5801 -65.0879 54.6387 -62.1582 C 55.2246 -61.9629 55.5664 -62.0605 55.8594 -62.5977 C 60.5957 -71.0449 67.8711 -78.0273 80.5176 -78.0273 C 96.5332 -78.0273 107.617 -65.332 108.447 -50.7812 C 108.594 -48.584 108.447 -45.9473 108.252 -43.6523 C 108.203 -43.0176 108.447 -42.627 109.033 -42.5293 C 117.92 -40.5762 123.633 -34.082 123.633 -25.7324 C 123.633 -16.6016 115.625 -9.86328 105.225 -9.86328 L 84.7168 -9.86328 L 84.7168 -2.00195 L 105.225 -2.00195 C 119.971 -2.00195 131.494 -12.3047 131.494 -25.7324 C 131.494 -35.4492 125.586 -44.3848 116.064 -48.3887 C 116.162 -70.166 100.488 -85.8887 80.5176 -85.8887 C 67.2852 -85.8887 57.8613 -78.8086 52.002 -70.2637 C 40.918 -73.2422 26.9043 -64.6484 26.6602 -50.9277 C 15.625 -49.1699 8.74023 -39.3555 8.74023 -27.8809 C 8.74023 -13.5742 21.2891 -2.00195 37.9883 -2.00195 Z M 70.3613 19.2871 C 72.4609 19.2871 74.2188 17.5781 74.2188 15.5273 L 74.2188 -30.2734 L 73.9258 -39.3066 L 77.1973 -35.8398 L 84.6191 -28.4668 C 85.3516 -27.7344 86.3281 -27.2949 87.2559 -27.2949 C 89.2578 -27.2949 90.8203 -28.7109 90.8203 -30.7129 C 90.8203 -31.7383 90.4297 -32.6172 89.6484 -33.3008 L 73.1445 -48.7305 C 72.1191 -49.6582 71.3379 -50 70.3613 -50 C 69.3359 -50 68.5547 -49.6582 67.5293 -48.7305 L 51.0254 -33.3008 C 50.1953 -32.6172 49.8535 -31.7383 49.8535 -30.7129 C 49.8535 -28.7109 51.3184 -27.2949 53.3691 -27.2949 C 54.2969 -27.2949 55.3223 -27.7344 56.0547 -28.4668 L 63.4766 -35.8398 L 66.748 -39.3066 L 66.4551 -30.2734 L 66.4551 15.5273 C 66.4551 17.5781 68.2617 19.2871 70.3613 19.2871 Z"
            ></path>
          </g>
        </svg>
      </transition>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Spinner from '@/components/Spinner.vue'
import UploadPreview from '@/components/UploadPreview.vue'
const backendHost = import.meta.env.VITE_BACKEND_HOST || 'localhost'
export default {
  name: 'Upload',
  props: {
    item: {
      type: Object,
      required: true
    },
    accentStyle: {
      type: Object,
      required: true
    }
  },
  components: {
    Spinner,
    UploadPreview
  },
  data() {
    return {
      files: null,
      fileStates: [],
      nItemsUploading: 0,
      showUploadPreview: this.item.done
    }
  },
  watch: {
    files(newFiles) {
      this.showUploadPreview = false
      this.fileStates = Array(newFiles.length).fill('none')
    },
    nItemsUploading(newNItemsUploading, oldNItemsUploading) {
      if (oldNItemsUploading === 0) {
        this.$emit('uploading')
      } else {
        if (newNItemsUploading === 0) {
          this.$emit('uploaded')
        }
      }
    }
  },
  mounted() {
    const dropbox = document.getElementById('dropbox')
    'drag dragstart dragend dragover dragenter dragleave drop'
      .split(' ')
      .forEach(event => {
        dropbox.addEventListener(event, e => {
          e.preventDefault()
          e.stopPropagation()
        })
      })
    'dragover dragenter'.split(' ').forEach(event => {
      dropbox.addEventListener(event, () => {
        dropbox.classList.add('is-dragover')
        document.getElementById('drag-label').classList.add('drag-label-active')
        document.getElementById('icon').classList.add('icon-active')
      })
    })
    'dragleave dragend drop'.split(' ').forEach(event => {
      dropbox.addEventListener(event, () => {
        dropbox.classList.remove('is-dragover')
        document
          .getElementById('drag-label')
          .classList.remove('drag-label-active')
        document.getElementById('icon').classList.remove('icon-active')
      })
    })
    dropbox.addEventListener('drop', e => {
      if (this.item.multiple) {
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          const file = e.dataTransfer.files[i]
          if (!
            new RegExp('^' + (this.item.extension === 'jpeg' ? 'jpe?g' : this.item.extension) + '$', 'i')
            .test(file.name.split('.').slice(-1)[0])
          ) {
            alert(`
              無法上傳 ${file.name}！
              此項目僅接受 ${this.item.extension} 格式。
            `)
            return
          }
        }
        this.files = e.dataTransfer.files
      } else {
        if (!
          new RegExp('^' + (this.item.extension === 'jpeg' ? 'jpe?g' : this.item.extension) + '$', 'i')
          .test(e.dataTransfer.files[0].name.split('.').slice(-1)[0])
        ) {
          alert(`
            無法上傳 ${e.dataTransfer.files[0].name}！
            此項目僅接受 ${this.item.extension} 格式。
          `)
        } else {
          const container = new DataTransfer()
          container.items.add(e.dataTransfer.files[0])
          this.files = container.files
        }
      }
    })
  },
  methods: {
    mouseover() {
      document.getElementById('label').classList.add('active')
      document.getElementById('icon').classList.add('icon-active')
    },
    mouseout() {
      document.getElementById('label').classList.remove('active')
      document.getElementById('icon').classList.remove('icon-active')
    },
    clickIcon() {
      document.getElementById('label').click()
    },
    filesSelected(e) {
      this.files = e.target.files
    },
    upload(e) {
      this.fileStates.fill('spinner')
      if (this.item.multiple) {
        const path =
          this.item.path + '/' +
          this.$store.state.user.semester.substring(0, 5) + '/' +
          this.$store.state.user.countryChi + '_' +
          this.$store.state.user.universityChi + '_' +
          this.$store.state.user.nameChi
        this.nItemsUploading = this.files.length
        for (let i = 0; i < this.files.length; i++) {
          const formData = new FormData()
          formData.append('path', path)
          formData.append(
            'filename',
            parseInt(i) + '.' + this.item.extension
          )
          formData.append('file', this.files[i])

          axios
            .post('//' + backendHost + ':3000/syno/upload', formData)
            .then(() => {
              this.fileStates[i] = 'done'
              this.nItemsUploading -= 1
            })
            .catch(e => {
              // console.log(e)
            })
        }
      } else {
        const formData = new FormData()
        formData.append(
          'path',
          this.item.path + '/' + this.$store.state.user.semester.substring(0, 5)
        )
        formData.append(
          'filename',
          this.$store.state.user.countryChi + '_' +
            this.$store.state.user.universityChi + '_' +
            this.$store.state.user.nameChi + '.' +
            this.item.extension
        )
        formData.append('file', this.files[0])

        this.nItemsUploading = 1
        axios
          .post('//' + backendHost + ':3000/syno/upload', formData)
          .then(() => {
            this.fileStates[0] = 'done'
            this.nItemsUploading -= 1
          })
          .catch(e => {
            // console.log(e)
          })
      }
    }
  }
}
</script>

<style scoped>
h1 {
  margin-block-end: 0.25em;
}
#window {
  position: fixed;
  width: 70%;
  height: 70%;
  left: 15%;
  top: 15%;
  background: white;
  z-index: 2;
  border-radius: 15px;
  filter: drop-shadow(4px 4px 10px #666);
}
#file {
  display: none;
}
.dropbox {
  position: absolute;
  width: calc(100% - 40px);
  height: 70%;
  padding: 60px 0;
  box-sizing: border-box;
  left: 20px;
  bottom: 20px;
  background: var(--background-color);
  color: var(--color);
  fill: var(--color);
  border-radius: 15px;
  outline: 2px dashed var(--color);
  outline-offset: -15px;
  transition: all 0.3s;
}
.is-dragover {
  background: white;
  color: #2c3e50;
  fill: #2c3e50;
  outline-color: var(--background-color);
  outline-offset: 0;
}
.icon {
  height: 80px;
  position: absolute;
  transition: all 0.3s;
  top: 25%;
  left: 50%;
  cursor: pointer;
  margin-left: -50px; /* Negative half of width. */
}
.icon-active {
  transform: scale(1.1);
}
label {
  position: absolute;
  font-size: 20px;
  cursor: pointer;
  letter-spacing: 1px;
  transition: all 0.3s;
  margin: 0 calc(50% - 100px);
  left: 0;
  right: 0;
  bottom: 18%;
}
label.active {
  letter-spacing: 0;
  font-size: 23px;
  font-weight: bold;
}
span {
  font-size: 20px;
  font-weight: normal;
  letter-spacing: 1px;
}
#drag-label {
  transition: all 0.3s;
}
.drag-label-active {
  letter-spacing: 0;
  font-size: 23px;
  font-weight: bold;
}
ul {
  list-style: none;
  margin: 0 auto;
  padding: 0;
  width: 50%;
  height: 70%;
  white-space: nowrap;
  overflow: auto;
  border-radius: 15px;
  box-shadow: 0px 0px 10px;
}
li {
  display: flex;
  justify-content: flex-start;
  font-size: 18px;
  padding: 10px 0 0 20%;
  gap: 5px;
}
li span {
  position: relative;
  top: 4px;
}
.upload {
  cursor: pointer;
  position: absolute;
  width: 40px;
  left: calc(50% - 20px); /* half of the width */
  bottom: 8%;
  transition: all 0.3s;
}
.upload:hover {
  width: 50px;
  left: calc(50% - 25px); /* half of the width */
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
