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
        {
            coordinates: [2.2945, 48.8584], 
            img: eiffelTower, 
            name: "France: Eiffel Tower" 
        },
        {
            coordinates: [139.8107, 35.6586], 
            img: tokyoTower, 
            name: "Japan: Tokyo Tower" 
        },
        {
            coordinates: [-74.0445, 40.6892], 
            img: statueOfLiberty, 
            name: "USA: Statue of Liberty" 
        },
        {
            coordinates: [-0.1246, 51.5007], 
            img: bigBen, 
            name: "UK: Big Ben" 
        },
        {
            coordinates: [12.4924, 41.8902], 
            img: colosseum, 
            name: "Italy: Colosseum" 
        },
        {
            coordinates: [116.5704, 40.4319], 
            img: greatWall, 
            name: "China: Great Wall of China" 
        },
        {
            coordinates: [-43.2105, -22.9519], 
            img: christRedeemer, 
            name: "Brazil: Christ the Redeemer" 
        },
        {
            coordinates: [151.2153, -33.857], 
            img: sydneyOperaHouse, 
            name: "Australia: Sydney Opera House" 
        },
        {
            coordinates: [78.0421, 27.1751], 
            img: tajMahal, 
            name: "India: Taj Mahal" 
        },
        {
            coordinates: [126.9882, 37.5512], 
            img: nSeoulTower, 
            name: "South Korea: N Seoul Tower" 
        },
        {
            coordinates: [31.1342, 29.9792], 
            img: pyramids, 
            name: "Egypt: Pyramids of Giza" 
        },
        {
            coordinates: [37.6204, 55.7525], 
            img: saintBasilsCathedral, 
            name: "Russia: Saint Basil's Cathedral" 
        },
        {
            coordinates: [28.9795, 41.0086], 
            img: hagiaSophia, 
            name: "Turkey: Hagia Sophia" 
        },
        {
            coordinates: [13.3777, 52.5163], 
            img: brandenburgGate, 
            name: "Germany: Brandenburg Gate" 
        },
        {
            coordinates: [2.1744, 41.4036], 
            img: sagradaFamilia, 
            name: "Spain: Sagrada Familia" 
        },
        {
            coordinates: [100.4928, 13.7525], 
            img: grandPalace, 
            name: "Thailand: Grand Palace" 
        }
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

        let popup;
        if (marker.name) {
            popup = new mapboxgl.Popup({ offset: 50 })
                .setHTML(`
                    <div class="popup-content">
                        <div class="popup-header">${marker.name.split(": ")[1]}</div>
                        <div class="popup-subheader">${marker.name.split(": ")[0]}</div>
                    </div>
                `);
        }

        const newMarker = new mapboxgl.Marker(el)
            .setLngLat(marker.coordinates)
            .setPopup(popup || null)
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

.popup-content {
    text-align: center;
    font-family: 'Arial', sans-serif;
    color: #333;
    background: #fff;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.popup-header {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
}

.popup-subheader {
    font-size: 14px;
    color: #666;
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
