<template>
  <Spinner v-if="filenames.length === 0" :state="'spinner'" :color="accentStyle.color" />

  <ul v-else>
    <li v-for="(filename, index) in filenames" :key="index" @click="previewInNewWindow(filename)">
      <Spinner :state="'done'" :color="accentStyle.color" />
      <span>{{ filename }}</span>
    </li>
  </ul>
</template>

<script>
import Spinner from '@/components/Spinner.vue'
import axios from 'axios'
const backendHost = import.meta.env.VITE_BACKEND_HOST || 'localhost'
export default {
  name: 'UploadPreview',
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
    Spinner
  },
  data () {
    return {
      filenames: []
    }
  },
  created() {
    if (this.item.done) {
      if (this.item.multiple) {
        const folder_path = this.item.path + '/' +
          this.$store.state.user.semester.substring(0, 5) + '/' +
          this.$store.state.user.countryChi + '_' +
          this.$store.state.user.universityChi + '_' +
          this.$store.state.user.nameChi
        axios
          .post('//' + backendHost + ':3000/syno/list', { folder_path })
          .then(({ data }) => {
            this.filenames = data.map(file => file.name)
          })
      } else {
        this.filenames = [
          this.$store.state.user.countryChi + '_' +
          this.$store.state.user.universityChi + '_' +
          this.$store.state.user.nameChi + '.' +
          this.item.extension
        ]
      }
    }
  },
  methods: {
    previewInNewWindow(filename) {
      const win = window.open('', '_blank')
      win.focus()
      let path = `${this.item.path}/${this.$store.state.user.semester.substring(0, 5)}`
      if (this.item.multiple) {
        path += '/' +
          this.$store.state.user.countryChi + '_' +
          this.$store.state.user.universityChi + '_' +
          this.$store.state.user.nameChi
      }
      path += `/${filename}`
      axios
        .post('//' + backendHost + ':3000/syno/download', { path })
        .then(({ data }) => {
          win.location.href = data
        })
    }
  }
}
</script>

<style scoped>
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
  transition: all .2s;
}
li:hover {
  cursor: pointer;
  transform: scale(1.05);
}
li span {
  position: relative;
  top: 4px;
}
</style>
