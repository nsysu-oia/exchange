<template>
  <div
    class="wrapper"
    :style="{ 'grid-template-columns': (mobileDevice) ? 'none' : '1fr 1fr 1fr 1fr 1fr'}"
  >
    <Stage
      class="stage"
      v-for="stage in stages"
      :key="stage.id"
      :stage="stage"
      :divHeight="divHeight"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import Stage from '@/components/Stage.vue'
import stages from '@/assets/data/stages.js'

export default {
  name: 'Home',
  components: {
    Stage
  },
  data () {
    return {
      stages: stages,
      divHeight: {
        id: 100,
        note: 110,
        apply: 130,
        upload: 130,
        download: 140
      }
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
.space {
  height: 20px;
}
.wrapper {
  display: grid;
}
.stage {
  margin: 5px;
  border-radius: 10px;
}
</style>
