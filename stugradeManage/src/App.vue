<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {
  mounted() {
    window.onbeforeunload=function(){
      window.localStorage.clear()
    }
  }
}
</script>
