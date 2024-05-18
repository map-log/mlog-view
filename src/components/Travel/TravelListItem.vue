<template>
    <div v-if="travel">
      <a-card hoverable style="width: 350px; margin-bottom: 12px;" @click="$emit('itemClick', travel)">
        <template #cover>
          <img v-if="travel.imageUrl" :alt="travel.title" :src="travel.imageUrl"
            style="height: 250px; width: 100%; object-fit: contain;" />
          <img v-else :alt="travel.title" src="@/assets/m-log-logo.png"
            style="height: 250px; width: 100%; object-fit: contain;" />
        </template>
        <a-card-meta :title="travel.title" :description="travel.description"></a-card-meta>
      </a-card>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    travel: Object,
  });
  
  const emit = defineEmits(['itemClick']);
  </script>
  
  <style scoped>
  a-card {
    width: 350px;
    margin-bottom: 12px;
  }
  
  a-card-meta {
    margin-top: 10px;
  }
  </style>
  