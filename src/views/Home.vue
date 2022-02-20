<template>
  <h1>
    國立中山大學<br />
    學生出國交換獎助計畫<template v-if="$store.state.windowSize === 'xs'"><br /></template>各階段應完成項目
  </h1>
  <div
    class="grid-wrapper"
    :style="(mobileDevice) ? '' : { 'grid-template-columns': 'repeat(5, 1fr)' }"
  >
    <Stage
      v-for="(stage, index) in stages"
      :key="index"
      :stage="stage"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import Stage from '@/components/Stage.vue'
import axios from 'axios'
const backendHost = process.env.VUE_APP_BACKEND_HOST || 'localhost'

export default {
  name: 'Home',
  components: {
    Stage
  },
  data () {
    return {
      stages: require('@/assets/contents/stages.yaml')
    }
  },
  created () {
    // merge the scholarship items
    for (let i = 0; i < this.stages.length; i++) {
      if (this.$store.state.user.scholarship !== '無' && this.stages[i].forScholarship) {
        ['applies', 'uploads', 'downloads'].forEach(id => {
          if (this.stages[i].forScholarship[id]) {
            this.stages[i][id] = (this.stages[i][id])
              ? this.stages[i][id].concat(this.stages[i].forScholarship[id])
              : this.stages[i].forScholarship[id]
          }
        })
      }
    }

    // collect the uploaded documents' paths
    const paths = []
    const userPath = '/' +
      this.$store.state.user.semester.substring(0, 5) + '/' +
      this.$store.state.user.countryChi + '_' +
      this.$store.state.user.universityChi + '_' +
      this.$store.state.user.nameChi
    this.stages.forEach(stage => {
      ['applies', 'uploads'].forEach(id => {
        if (stage[id]) {
          stage[id].forEach(item => {
            if (item.path) {
              paths.push(item.path + userPath +
                ((item.extension === 'folder') ? '' : '.' + item.extension)
              )
            }
          })
        }
      })
    })

    // compare with syno
    axios
      .post('//' + backendHost + ':3000/syno/getinfo', { paths })
      .then(res => {
        console.log(res.data)
        // update the completed item
        this.stages.forEach(stage => {
          ['applies', 'uploads'].forEach(id => {
            if (stage[id]) {
              stage[id].forEach(item => {
                if (item.path) {
                  item.done = !res.data.shift().code
                }
              })
            }
          })
        })
      })
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
  }
}
</script>

<style scoped>
.grid-wrapper {
  display: grid;
  grid-column-gap: 1em;
  padding: 0 1em 1em 1em;
}
</style>
