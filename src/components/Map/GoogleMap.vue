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

const mapContainer = ref(null);
const map = ref(null);
const marker = ref(null);
const markerPosition = ref({ lat: parseFloat(props.lat) || 40.689247, lng: parseFloat(props.lng) || -74.044502 });

onMounted(() => {
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
    /* 맵 컨테이너의 가로 너비를 조절합니다. */
    height: 200px;
    /* 맵 컨테이너의 높이를 조절합니다. */
    border-radius: 10px;
    /* 가장자리를 둥글게 만듭니다. */
}
</style>