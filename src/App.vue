<script setup>
import { RouterLink, RouterView } from 'vue-router'
import TourView from "./components/Tab.vue";
import UserView from "./components/UserView.vue";
import TourCreateView from "./components/CreateView.vue";
import MapboxGlobe from './components/Map/MapboxGlobe.vue'
</script>

<template>
  <RouterView />
</template>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
}

body:-webkit-scrollbar {
  display: none;
}
</style>
