<script setup>
defineProps({
  station: Object,
});
</script>

<template>
  <a-card hoverable style="width: 350px; margin-bottom: 12px;" @click="$emit('itemClick', station)">
    <template #cover>
      <img v-if="station.firstimage" :alt="station.title" :src="station.firstimage"
        style="height: 250px; width: 100%; object-fit: contain;" />
      <img v-else-if="station.firstimage2" :alt="station.title" :src="station.firstimage2"
        style="height: 250px; width: 100%; object-fit: contain;" />
      <img v-else :alt="station.title" src="@/assets/m-log-logo.png"
        style="height: 250px; width: 100%; object-fit: contain;" />
    </template>
    <a-card-meta :title="station.title" :description="station.addr1 + ' ' + station.addr2"></a-card-meta>
  </a-card>
</template>

<style>
.search-input {
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #007bff;
}

a-space.horizontal {
  display: flex;
  align-items: center;
}

a-button[type="primary"] {
  margin-left: 10px;
}
</style>
