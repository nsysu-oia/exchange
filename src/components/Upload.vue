<template>
  <div id='window'>
    <h1>{{ upload.title }}</h1>
    <input id="file" type="file">
    {{ upload }}
    <div id="dropbox"></div>
  </div>
</template>

<script>
export default {
  name: 'Upload',
  props: {
    upload: {
      type: Object,
      required: true
    }
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
#dropbox {
  position: fixed;
  width: 80%;
  height: 40%;
  left: 10%;
  bottom: 5%;
  z-index: 3;
}
#dropbox:hover {
  background: red;
}
</style>
