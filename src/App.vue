<script setup>
import { RouterLink, RouterView } from 'vue-router'
import TourView from "./views/TourView.vue";
import UserView from "./views/UserView.vue";
import TourCreateView from "./views/TourCreateView.vue";
import MapboxGlobe from './components/MapboxGlobe.vue'
</script>

<template>
  <img src="" />
  <TourView />
  <UserView />
  <TourCreateView />
  <RouterView />
  <MapboxGlobe />
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
