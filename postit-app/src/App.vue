<template>
  <HeaderBar />
  <router-view />
  <FooterBar />
</template>

<script>
import HeaderBar from './components/HeaderBar.vue';
import FooterBar from './components/FooterBar.vue';

export default {
  components: { HeaderBar, FooterBar }
};
</script>
