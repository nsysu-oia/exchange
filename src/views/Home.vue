<template>
  <div
    v-if="!!stages"
    class="grid-wrapper"
    :style="(mobileDevice) ? '' : { 'grid-template-columns': 'repeat(5, 1fr)' }"
  >
    <Stage
      v-for="stage in stages"
      :key="stage.id"
      :stage="stage"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'
import Stage from '@/components/Stage.vue'
const backendHost = process.env.VUE_APP_BACKEND_HOST || 'localhost'

export default {
  name: 'Home',
  components: {
    Stage
  },
  data () {
    return {
      stages: null
    }
  },
  created: function () {
    // fetch UI content
    axios
      .post('//' + backendHost + ':3000/content', { content: 'stages' })
      .then(({ data }) => { this.stages = data })
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
