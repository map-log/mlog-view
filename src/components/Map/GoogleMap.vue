<template>
    <div>
      <div ref="mapContainer" class="map-container"></div>
      <!-- <p>마커의 위치: {{ markerPosition }}</p> -->
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import { Loader } from '@googlemaps/js-api-loader';
  
  const { VITE_GOOGLE_MAP_API } = import.meta.env;
  
  const props = defineProps({
    lat: Number,
    lng: Number
  });
  
  const emit = defineEmits(['changePosition']);
  
  const mapContainer = ref(null);
  const map = ref(null);
  const marker = ref(null);
  const markerPosition = ref({ lat: parseFloat(props.lat) || 35.20448840587912, lng: parseFloat(props.lng) || 126.80853775734465 });
  
  onMounted(() => {
    console.log(`Initial position: Latitude: ${markerPosition.value.lat}, Longitude: ${markerPosition.value.lng}`);
  
    const loader = new Loader({
      apiKey: VITE_GOOGLE_MAP_API,
      version: 'weekly',
      libraries: ['places'],
    });
  
    loader.load().then(() => {
      map.value = new google.maps.Map(mapContainer.value, {
        center: markerPosition.value,
        zoom: 15,
      });
  
      marker.value = new google.maps.Marker({
        position: markerPosition.value,
        map: map.value,
        draggable: true,
      });
  
      map.value.addListener('center_changed', () => {
        markerPosition.value = map.value.getCenter().toJSON();
        marker.value.setPosition(markerPosition.value);
        emit('changePosition', markerPosition.value.lat, markerPosition.value.lng);
      });
    });
  });
  
  watch(() => props.lat, (newLat) => {
    markerPosition.value.lat = parseFloat(newLat);
    if (map.value) {
      map.value.setCenter(markerPosition.value);
      marker.value.setPosition(markerPosition.value);
    }
  });
  
  watch(() => props.lng, (newLng) => {
    markerPosition.value.lng = parseFloat(newLng);
    if (map.value) {
      map.value.setCenter(markerPosition.value);
      marker.value.setPosition(markerPosition.value);
    }
  });
  </script>
  
  <style scoped>
  .map-container {
    width: 100%;
    height: 200px;
    border-radius: 10px;
  }
  </style>
  