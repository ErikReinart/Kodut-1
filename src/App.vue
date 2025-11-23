<template>
  <HeaderBar />
  <router-view />
  <FooterBar />
</template>

<script>
import HeaderBar from './component/HeaderBar.vue';
import FooterBar from './component/FooterBar.vue';

export default {
  components: { HeaderBar, FooterBar }
};
</script>
