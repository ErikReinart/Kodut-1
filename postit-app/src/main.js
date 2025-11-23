//imports Vue and your top-level App component.
import { createApp } from 'vue';
import App from './App.vue';

//import router
import router from './router';

// Import CSS
import './style.css';
import store from "./store/index.js";

// Create the Vue app, and tell it to use router + store.
// Then mount it into #app inside public/index.html.
createApp(App)
  .use(router).use(store)
  .mount('#app');
