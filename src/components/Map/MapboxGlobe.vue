<script setup>
import { ref, watch, onMounted } from 'vue';
import { useMapStore } from "@/stores/map";
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { storeToRefs } from "pinia";
import eiffelTower from '@/assets/eiffel_tower.png';
import tokyoTower from '@/assets/tokyo_tower.png';
import statueOfLiberty from '@/assets/statue_of_liberty.png';
import bigBen from '@/assets/big_ben.png';
import colosseum from '@/assets/colosseum.png';
import greatWall from '@/assets/great_wall.png';
import christRedeemer from '@/assets/christ_redeemer.png';
import sydneyOperaHouse from '@/assets/sydney_opera_house.png';
import tajMahal from '@/assets/taj_mahal.png';
import nSeoulTower from '@/assets/n_seoul_tower.png';
import pyramids from '@/assets/pyramids.png';
import saintBasilsCathedral from '@/assets/saint_basils_cathedral.png';
import hagiaSophia from '@/assets/hagia_sophia.png';
import brandenburgGate from '@/assets/brandenburg_gate.png';
import sagradaFamilia from '@/assets/sagrada_familia.png';
import grandPalace from '@/assets/grand_palace.png';

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

    setDefaultMarkers();
    printMarker(window.map);
});

const { markerList } = storeToRefs(mapStore);

const watchMarker = watch(markerList, () => {
    printMarker(window.map);
});

const setDefaultMarkers = () => {
    const defaultMarkers = [
        { coordinates: [2.2945, 48.8584], img: eiffelTower },
        { coordinates: [139.8107, 35.6586], img: tokyoTower },
        { coordinates: [-74.0445, 40.6892], img: statueOfLiberty },
        { coordinates: [-0.1246, 51.5007], img: bigBen },
        { coordinates: [12.4924, 41.8902], img: colosseum },
        { coordinates: [116.5704, 40.4319], img: greatWall },
        { coordinates: [-43.2105, -22.9519], img: christRedeemer },
        { coordinates: [151.2153, -33.857], img: sydneyOperaHouse },
        { coordinates: [78.0421, 27.1751], img: tajMahal },
        { coordinates: [126.9882, 37.5512], img: nSeoulTower },
        { coordinates: [31.1342, 29.9792], img: pyramids },
        { coordinates: [37.6204, 55.7525], img: saintBasilsCathedral },
        { coordinates: [28.9795, 41.0086], img: hagiaSophia },
        { coordinates: [13.3777, 52.5163], img: brandenburgGate },
        { coordinates: [2.1744, 41.4036], img: sagradaFamilia },
        { coordinates: [100.4928, 13.7525], img: grandPalace }
    ];
    mapStore.markerList.push(...defaultMarkers);
};

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
