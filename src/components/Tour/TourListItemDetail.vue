<template>
  <div v-if="item && Object.keys(item).length">
    <div class="image-container">
      <img v-if="item.firstimage" :src="item.firstimage" alt="First Image" />
      <img v-else-if="item.firstimage2" :src="item.firstimage2" alt="Second Image" />
      <img v-else src="@/assets/m-log-logo.png" alt="Default Logo" />
    </div>
    <h2>{{ item.title }}</h2>
    <div class="map-container">
      <GoogleMap :lat="item.mapy" :lng="item.mapx" />
    </div>
  </div>
  <div v-else>
    <p>항목이 선택되지 않았습니다.</p>
  </div>
</template>

<script setup>
import { watch } from 'vue';
import GoogleMap from '@/components/Map/GoogleMap.vue';

const props = defineProps({
  item: {
    type: Object,
    required: false,
    default: () => ({})
  }
});

console.log(props.item)

watch(() => props.item, (newItem) => {
  console.log('Selected Item:', newItem);
}, { immediate: true });
</script>

<style scoped>
.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
}

.image-container img {
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.map-container {
  height: 400px;
  width: 100%;
  margin-top: 16px;
}
</style>
