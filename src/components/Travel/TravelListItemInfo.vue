<script setup>
defineProps({
  item: {
    type: Object,
    required: false,
    default: () => ({})
  }
});
</script>

<template>
  <div v-if="item">
    <h2>{{ item.title }}</h2>
    <a-image-preview-group>
      <a-image v-for="img in item.images" :key="img" :width="200" :src="img" />
    </a-image-preview-group>
    <a-rate :value="item.rating" allow-half />
    <p>{{ item.content }}</p>
  </div>
  <div v-else>
    <p>항목이 선택되지 않았습니다.</p>
  </div>
</template>

<style scoped></style>
