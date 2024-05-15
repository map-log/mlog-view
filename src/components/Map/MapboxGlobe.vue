<script setup>
import { ref, watch, onMounted } from 'vue';
import { useMapStore } from "@/stores/map";
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { storeToRefs } from "pinia";

mapboxgl.accessToken = 'pk.eyJ1IjoiaGVsbG9tYXRpYSIsImEiOiJjbHcwYmgwNG8xaWFiMnFvZzA0N2F0bHR5In0.mtCVIIEYY0CyDn7uQCg4Mg';

const mapStore = useMapStore();
const mapContainer = ref(null);
const secondsPerRevolution = 120;
const maxSpinZoom = 5;
let userInteracting = false;
let spinEnabled = true;
let zoomTimer = null;

// 전역 변수를 window 객체에 추가하여 어디서든 접근 가능하도록 설정
window.map = null;

const getMap = () => {
    return new mapboxgl.Map({
        container: mapContainer.value,
        style: 'mapbox://styles/hellomatia/cluw85rzw001u01rjaw85873u',
        center: [126, 35],
        zoom: 2
    });
};

const spinGlobe = (map) => {
    if (spinEnabled && !userInteracting) {
        const distancePerSecond = 360 / secondsPerRevolution;
        const center = map.getCenter();
        center.lng -= distancePerSecond;
        map.easeTo({ center, duration: 1000, easing: (n) => n });
    }
};

onMounted(() => {
    window.map = getMap();

    window.map.on('zoomstart', () => {
        spinEnabled = false;
    });

    window.map.on('zoomend', () => {
        if (window.map.getZoom() < maxSpinZoom) {
            setTimeout(() => {
                spinEnabled = true;
                spinGlobe(window.map);
            }, 5000);
        }
    });

    window.map.on('mousedown', () => {
        userInteracting = true;
        clearTimeout(zoomTimer);
    });

    window.map.on('mouseup', () => {
        userInteracting = false;
        spinGlobe(window.map);
    });

    window.map.on('dragend', () => {
        userInteracting = false;
        spinGlobe(window.map);
    });
    window.map.on('pitchend', () => {
        userInteracting = false;
        spinGlobe(window.map);
    });
    window.map.on('rotateend', () => {
        userInteracting = false;
        spinGlobe(window.map);
    });

    window.map.on('moveend', () => {
        spinGlobe(window.map);
    });

    printMarker(window.map);
});

const { markerList } = storeToRefs(mapStore);

const watchMarker = watch(markerList, () => {
    printMarker(window.map);
});

const printMarker = (map) => {
    for (const marker of mapStore.markerList) {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = `url(${marker.img})`;
        el.style.width = `60px`;
        el.style.height = `60px`;
        el.style.backgroundSize = '100%';

        const popup = new mapboxgl.Popup({ offset: 50 })
            .setHTML('<h1>Hello World!</h1>');

        new mapboxgl.Marker(el)
            .setLngLat(marker.coordinates)
            .setPopup(popup)
            .addTo(map);

        el.addEventListener('click', () => {
            map.easeTo({ center: marker.coordinates, duration: 1000 });
        });
    }
};
</script>

<template>
    <img class="logo" width="250" src="@/assets/m-log-logo.png" />
    <div ref="mapContainer" class="map-container"></div>
</template>

<style>
.marker {
    display: block;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    padding: 0;
}
</style>

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
}
</style>
