<script setup>
import { ref, onMounted } from 'vue';
import { useTravelStore } from '@/stores/travel';
import TravelListItem from '@/components/Travel/TravelListItem.vue';
import { storeToRefs } from 'pinia';
import { useMapStore } from '@/stores/map';

const store = useTravelStore();
const { travelList } = storeToRefs(store);
const mapStore = useMapStore();

const props = defineProps({
  selectedItem: Object,
  itemDetailOpen: Boolean,
  showItemDetailDrawer: Function,
});

onMounted(async () => {
  await store.fetchTravelList();
  addAllMarkers();
});

const handleItemClick = (item) => {
  props.showItemDetailDrawer(item);
  moveMapToLocation(item.lat, item.lng, item.imageUrl);
};

const moveMapToLocation = (latitude, longitude, Url) => {
  if (window.map) {
    window.map.flyTo({
      center: [longitude, latitude],
      essential: true,
      zoom: 3,
    });

    const marker = createMarker(latitude, longitude, Url);
    mapStore.markerList = [marker];
  }
};

const createMarker = (latitude, longitude, img) => {
  return {
    img: img,
    coordinates: [longitude, latitude],
  };
};

const addAllMarkers = () => {
  const markers = travelList.value.map(travel => createMarker(travel.lat, travel.lng, travel.imageUrl));
  mapStore.markerList = markers;
};
</script>

<template>
  <div>
    <TravelListItem v-for="travel in travelList" :key="travel.id" :travel="travel" @itemClick="handleItemClick" />
  </div>
</template>

<style scoped></style>
