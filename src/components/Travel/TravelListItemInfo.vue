<script setup>
import { defineProps,watch } from 'vue';
import GoogleMap from '@/components/Map/GoogleMap.vue';

const props = defineProps({
  item: {
    type: Object,
    required: false,
    default: () => ({})
  }
});

watch(() => props.item, (newItem) => {
  console.log('Selected Item:', newItem);
}, { immediate: true });
</script>

<template>
  <div v-if="item && Object.keys(item).length">
    <a-image-preview-group>
      <a-image v-if="item.firstimage" :width="200" :src="item.firstimage" />
      <a-image v-else-if="item.firstimage2" :width="200" :src="item.firstimage2" />
      <a-image v-else :width="200" src="@/assets/m-log-logo.png" />
    </a-image-preview-group>
    <h2>{{ item.title }}</h2>
    <div style="height: 400px; width: 100%; margin-top: 16px;">
      <GoogleMap :lat="item.mapy" :lng="item.mapx" />
    </div>
  </div>
  <div v-else>
    <p>항목이 선택되지 않았습니다.</p>
  </div>
</template>

<style scoped></style>
