<template>
  <div class="about">
    <img alt="Vue logo" src="../assets/logos/logo.png">
    <div>{{ $store.state.windowWidth }}</div>
    <div>{{ $store.state.windowSize }}</div>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  }
}
</script>
