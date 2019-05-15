<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!-- or name="fade" -->
      <!-- <router-view :key="key"></router-view> -->
      <router-view/>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    // cachedViews() {
    //   return this.$store.state.tagsView.cachedViews
    // },
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar 30 = tab  */
  min-height: calc(100vh - 50px - 34px);
  position: relative;
  overflow: hidden;
}
</style>
