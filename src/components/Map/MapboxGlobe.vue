<script setup>
import { ref, watch, onMounted } from 'vue';
import { useMapStore } from "@/stores/map";
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { storeToRefs } from "pinia";

mapboxgl.accessToken = 'pk.eyJ1IjoiaGVsbG9tYXRpYSIsImEiOiJjbHcwYmgwNG8xaWFiMnFvZzA0N2F0bHR5In0.mtCVIIEYY0CyDn7uQCg4Mg';

const mapStore = useMapStore();
const mapContainer = ref(null);
const secondsPerRevolution = 120;
const maxSpinZoom = 5; // 5초 동안 확대 상태 유지
let userInteracting = false;
let spinEnabled = true;
let zoomTimer = null;

var map;

const getMap = () => {
    return new mapboxgl.Map({
        container: mapContainer.value,
        style: 'mapbox://styles/hellomatia/cluw85rzw001u01rjaw85873u',
        center: [126, 35],
        zoom: 2
    });
}

const spinGlobe = (map) => {
    if (spinEnabled && !userInteracting) {
        const distancePerSecond = 360 / secondsPerRevolution;
        const center = map.getCenter();
        center.lng -= distancePerSecond;
        map.easeTo({ center, duration: 1000, easing: (n) => n });
    }
};

onMounted(() => {
    map = getMap();

    map.on('zoomstart', () => {
        spinEnabled = false; // Zoom 시작 시 회전 비활성화
    });

    map.on('zoomend', () => {
        if (map.getZoom() < maxSpinZoom) {
            setTimeout(() => {
                spinEnabled = true;
                spinGlobe(map); // Zoom 종료 후 회전 재개
            }, 5000); // 잠시 후 회전 재개를 위해 지연 시간 설정
        }
    });

    map.on('mousedown', () => {
        userInteracting = true;
        clearTimeout(zoomTimer);
    });

    map.on('mouseup', () => {
        userInteracting = false;
        spinGlobe(map);
    });

    map.on('dragend', () => {
        userInteracting = false;
        spinGlobe(map);
    });
    map.on('pitchend', () => {
        userInteracting = false;
        spinGlobe(map);
    });
    map.on('rotateend', () => {
        userInteracting = false;
        spinGlobe(map);
    });

    map.on('moveend', () => {
        spinGlobe(map);
    });

    const mapStore = useMapStore();

    for (const marker of mapStore.markerList) {
        // Create a DOM element for each marker.
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = `url(${marker.img})`;
        el.style.width = `40px`;
        el.style.height = `40px`;
        el.style.backgroundSize = '100%';

        el.addEventListener('click', () => {
            window.alert("click");
        });

        // Add markers to the map.
        new mapboxgl.Marker(el)
            .setLngLat(marker.coordinates)
            .addTo(map);
    }

    // 검색
    map.addControl(
        new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl
        })
    );
    spinGlobe(map);
});

const { markerList } = storeToRefs(mapStore)

const watchMarker = watch(markerList, () => {
    printMarker(map);
})

const printMarker = (map) => {
    for (const marker of mapStore.markerList) {
        // Create a DOM element for each marker.
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = `url(${marker.img})`;
        el.style.width = `80px`;
        el.style.height = `80px`;
        el.style.backgroundSize = '100%';

        el.addEventListener('click', () => {
            window.alert("click");
        });

        // Add markers to the map.
        new mapboxgl.Marker(el)
            .setLngLat(marker.coordinates)
            .addTo(map);
    }
}



</script>

<template>
    <img class="logo" width="250" src="@/assets/m-log-logo.png" />
    <div ref="mapContainer" class="map-container"></div>
</template>

<style scoped>
.map-container {
    width: 100vw;
    height: 100vh;
    background-color: white;
    position: relative;
}

.logo {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
    /* 이미지가 맵 위에 겹치도록 설정 */
}
</style>