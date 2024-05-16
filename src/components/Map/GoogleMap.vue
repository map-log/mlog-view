<template>
    <div>
        <div ref="mapContainer" class="map-container"></div>
        <p>마커의 위치: {{ markerPosition }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';

const { VITE_GOOGLE_MAP_API } = import.meta.env;


const mapContainer = ref(null);
const marker = ref(null);
const markerPosition = ref({ lat: 40.689247, lng: -74.044502 });


onMounted(() => {

    const loader = new Loader({
        apiKey: VITE_GOOGLE_MAP_API,
        version: 'weekly',
        libraries: ['places'],
    });

    loader.load().then(() => {
        const map = new google.maps.Map(mapContainer.value, {
            center: markerPosition.value,
            zoom: 8,
        });

        marker.value = new google.maps.Marker({
            position: markerPosition.value,
            map,
            draggable: true,
        });

        map.addListener('center_changed', () => {
            markerPosition.value = map.getCenter().toJSON(); // 마커의 위치를 지도의 중심으로 설정
            marker.value.setPosition(markerPosition.value); // 마커의 위치 업데이트
        });
    });
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