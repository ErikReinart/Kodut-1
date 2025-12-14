<template>
  <div class="app-container">
    <HeaderBar />
    <router-view />
    <FooterBar />
  </div>
</template>

<script>
import HeaderBar from './components/HeaderBar.vue';
import FooterBar from './components/FooterBar.vue';
import Posts from "./components/Posts.vue";

export default {

  components: { HeaderBar, Posts, FooterBar },

  computed: {
    showPosts() {
      // hide posts on signup page (BAD fix!!)
      return this.$route && this.$route.path !== '/signup';
    }
  },

  created() {
    this.$store.dispatch('loadPosts')
  }
};

</script>
