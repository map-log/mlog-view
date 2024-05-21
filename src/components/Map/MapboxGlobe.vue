<script setup>
import { ref, watch, onMounted } from 'vue';
import { useMapStore } from "@/stores/map";
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { storeToRefs } from "pinia";
const { VITE_MAPBOX_ACCESSTOKEN, VITE_MAPBOX_STYLE } = import.meta.env;

mapboxgl.accessToken = VITE_MAPBOX_ACCESSTOKEN;

const mapStore = useMapStore();
const mapContainer = ref(null);
const geocoderContainer = ref(null);
const secondsPerRevolution = 120;
const maxSpinZoom = 5;
let userInteracting = false;
let spinEnabled = true;
let zoomTimer = null;

let currentMarkers = [];

// 전역 변수를 window 객체에 추가하여 어디서든 접근 가능하도록 설정
window.map = null;

const getMap = () => {
    return new mapboxgl.Map({
        container: mapContainer.value,
        style: VITE_MAPBOX_STYLE,
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

    const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        placeholder: '검색'  // 여기서 플레이스홀더 텍스트를 설정합니다.
    });

    geocoderContainer.value.appendChild(geocoder.onAdd(window.map));

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
    // 기존 마커 제거
    currentMarkers.forEach(marker => marker.remove());
    currentMarkers = [];

    for (const marker of mapStore.markerList) {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = `url(${marker.img})`;
        el.style.width = `60px`;
        el.style.height = `60px`;
        el.style.backgroundSize = '100%';

        const popup = new mapboxgl.Popup({ offset: 50 })
            .setHTML('<h1>Hello World!</h1>');

        const newMarker = new mapboxgl.Marker(el)
            .setLngLat(marker.coordinates)
            .setPopup(popup)
            .addTo(map);

        el.addEventListener('click', () => {
            map.easeTo({ center: marker.coordinates, duration: 1000 });
        });

        currentMarkers.push(newMarker);
    }
};
</script>

<template>
    <div class="header">
        <img class="logo" width="300" src="@/assets/m-log-logo.png" />
        <div ref="geocoderContainer" class="geocoder-container"></div>
    </div>
    <div ref="mapContainer" class="map-container"></div>
</template>

<style>
@import url('https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css');
@import url('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.css');

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

.header {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
}
</style>
