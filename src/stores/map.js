import { ref } from "vue";
import { defineStore } from "pinia";

export const useMapStore = defineStore("mapStore", () => {
  const markerList = ref([]);

  function addMarker(latitude, longitude, img) {
    markerList.value.push({
      img: img,
      coordinates: [latitude, longitude],
    });
  }

  function reset() {
    markerList.value = [];
  }

  return { markerList, addMarker, reset };
});
