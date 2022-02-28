<template>
  <h1>
    國立中山大學<br />
    學生出國交換獎助計畫<template v-if="$store.state.windowSize === 'xs'"
      ><br /></template
    >各階段應完成項目
  </h1>
  <div
    class="grid-wrapper"
    :style="mobileDevice ? '' : { 'grid-template-columns': 'repeat(5, 1fr)' }"
  >
    <Stage v-for="(stage, index) in stages" :key="index" :stage="stage" />
  </div>
  <transition>
    <div class="overlay" v-if="!fetched">
      <div class="zoom">
        <Spinner :color="'#555'" :state="'spinner'" />
      </div>
    </div>
  </transition>
</template>

<script>
// @ is an alias to /src
import Stage from '@/components/Stage.vue'
import Spinner from '@/components/Spinner.vue'
import axios from 'axios'
const backendHost = import.meta.env.VITE_BACKEND_HOST || 'localhost'
import stages from '@/assets/contents/stages.yaml'

export default {
  name: 'Home',
  components: {
    Stage,
    Spinner
  },
  data() {
    return {
      stages: null,
      fetched: true
    }
  },
  created() {
    this.stages = JSON.parse(JSON.stringify(stages)) // make a deep clone to avoid cache

    // merge the scholarship items
    for (let i = 0; i < this.stages.length; i++) {
      if (
        this.$store.state.user.scholarship !== '無' &&
        this.stages[i].forScholarship
      ) {
        ;['applies', 'uploads', 'downloads'].forEach(id => {
          if (this.stages[i].forScholarship[id]) {
            this.stages[i][id] = this.stages[i][id]
              ? this.stages[i][id].concat(this.stages[i].forScholarship[id])
              : this.stages[i].forScholarship[id]
          }
        })
      }
    }

    // collect the uploaded documents' paths
    const paths = []
    const userPath =
      '/' +
      this.$store.state.user.semester.substring(0, 5) +
      '/' +
      this.$store.state.user.countryChi +
      '_' +
      this.$store.state.user.universityChi +
      '_' +
      this.$store.state.user.nameChi
    this.stages.forEach(stage => {
      ;['applies', 'uploads'].forEach(id => {
        if (stage[id]) {
          stage[id].forEach(item => {
            if (item.path) {
              paths.push(
                item.path +
                  userPath +
                  (item.multiple? '' : '.' + item.extension)
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
        // update the completed item
        this.stages.forEach(stage => {
          ;['applies', 'uploads'].forEach(id => {
            if (stage[id]) {
              stage[id].forEach(item => {
                if (item.path) {
                  item.done = !res.data.shift().code
                }
              })
            }
          })
        })
        this.fetched = true
      })
  },
  mounted() {
    this.fetched = false
  },
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
  }
}
</script>

<style scoped>
.grid-wrapper {
  display: grid;
  grid-column-gap: 1em;
  padding: 0 1em 1em 1em;
}
.overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0);
  z-index: 1;
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
}
.zoom {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: scale(1.5);
}
.v-enter-active,
.v-leave-active {
  transition: all 1s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: scale(1.5) translate(-5px, -5px);
}
</style>
