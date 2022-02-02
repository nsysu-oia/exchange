<template>
  <div id='window'>
    <h1>上傳{{ upload.title }}</h1>
    <input id="file" type="file" multiple>
    <div id="dropbox" class="dropbox" :style="{ '--color': accentStyle.color, '--background-color': accentStyle.backgroundColor }">
      <svg id="icon" class="icon" xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 50 43" :style="{ '--color': accentStyle.color }">
        <path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z" />
      </svg>
      <label for="file" :style="{ '--color': accentStyle.color }">
        選取檔案<span>或<span id="drag-label">拖曳至此</span></span>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Upload',
  props: {
    upload: {
      type: Object,
      required: true
    },
    accentStyle: {
      type: Object,
      required: true
    }
  },
  mounted () {
    const dropbox = document.getElementById('dropbox')
    'drag dragstart dragend dragover dragenter dragleave drop'.split(' ').forEach(event => {
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
        document.getElementById('drag-label').classList.remove('drag-label-active')
        document.getElementById('icon').classList.remove('icon-active')
      })
    })
    dropbox.addEventListener('drop', e => {
      // const droppedFiles = e.originalEvent.dataTransfer.files
    })
  }
}
</script>

<style scoped>
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
  width: calc(100% - 40px);
  height: 70%;
  padding: 60px 0;
  box-sizing: border-box;
  position: fixed;
  left: 20px;
  bottom: 20px;
  background: var(--background-color);
  color: var(--color);
  fill: var(--color);
  border-radius: 15px;
  outline: 2px dashed var(--color);
  outline-offset: -15px;
  transition: all .3s;
}
.is-dragover {
  background: white;
  color: #2c3e50;
  fill: #2c3e50;
  outline-color: var(--background-color);
  outline-offset: 0;
}
.icon {
  width: 100%;
  height: 80px;
  display: block;
  margin-bottom: 40px;
  transition: all .3s;
}
.icon-active {
  transform: scale(1.1);
}
label {
  font-size: 20px;
  cursor: pointer;
  letter-spacing: 1px;
  transition: all .3s;
}
label:hover {
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
  transition: all .3s;
}
.drag-label-active {
  letter-spacing: 0;
  font-size: 23px;
  font-weight: bold;
}
</style>
