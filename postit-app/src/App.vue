<template>
  <HeaderBar />
  <router-view />
  <Posts />
  <FooterBar />
</template>

<script>
import HeaderBar from './components/HeaderBar.vue';
import FooterBar from './components/FooterBar.vue';
import Posts from "./components/Posts.vue";

export default {

  components: { HeaderBar, Posts, FooterBar },

  created() {
    this.$store.dispatch('loadPosts')
  }
};

</script>
