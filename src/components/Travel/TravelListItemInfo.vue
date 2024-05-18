<template>
  <div v-if="item && Object.keys(item).length">
    <a-image-preview-group>
      <a-image v-if="item.imageUrl" :width="200" :src="item.imageUrl" />
      <a-image v-else :width="200" src="@/assets/m-log-logo.png" />
    </a-image-preview-group>
    <h2>{{ item.title }}</h2>
    <p>{{ item.description }}</p>
    <div style="margin-top: 16px;">
      <h3>Details:</h3>
      <p>ID: {{ item.id }}</p>
    </div>
  </div>
  <div v-else>
    <p>항목이 선택되지 않았습니다.</p>
  </div>
</template>

<script setup>
import { watch } from 'vue';

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

<style scoped></style>
