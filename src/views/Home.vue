<template>
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

export default {
  name: 'Home',
  components: {
    Stage
  },
  data () {
    return {
      stages: require('@/assets/data/stages.yaml')
    }
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
