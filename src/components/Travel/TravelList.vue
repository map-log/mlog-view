<script setup>
import { ref, onMounted } from 'vue';
import { useTravelStore } from '@/stores/travel';
import TravelListItem from '@/components/Travel/TravelListItem.vue';
import { storeToRefs } from 'pinia';

const store = useTravelStore();
const { travelList } = storeToRefs(store);

const props = defineProps({
  selectedItem: Object,
  itemDetailOpen: Boolean,
  showItemDetailDrawer: Function,
});

onMounted(async () => {
  await store.fetchTravelList();
});
</script>

<template>
  <div>
    <div v-for="travel in travelList" :key="travel.id">
      <TravelListItem :travel="travel" @itemClick="showItemDetailDrawer" />
    </div>
  </div>
</template>

<style scoped></style>
