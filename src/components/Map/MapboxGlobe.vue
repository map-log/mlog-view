<script setup>
import { ref, onMounted } from 'vue';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiaGVsbG9tYXRpYSIsImEiOiJjbHcwYmgwNG8xaWFiMnFvZzA0N2F0bHR5In0.mtCVIIEYY0CyDn7uQCg4Mg';

const mapContainer = ref(null);
const secondsPerRevolution = 120;
const maxSpinZoom = 5; // 5초 동안 확대 상태 유지
let userInteracting = false;
let spinEnabled = true;
let zoomTimer = null;

onMounted(() => {
    const map = new mapboxgl.Map({
        container: mapContainer.value,
        style: 'mapbox://styles/hellomatia/cluw85rzw001u01rjaw85873u',
        center: [126, 35],
        zoom: 2
    });

    const spinGlobe = () => {
        if (spinEnabled && !userInteracting && map.getZoom() < maxSpinZoom) {
            const distancePerSecond = 360 / secondsPerRevolution;
            const center = map.getCenter();
            center.lng -= distancePerSecond;
            map.easeTo({ center, duration: 1000, easing: (n) => n });
        }
    };

    map.on('zoomstart', () => {
        spinEnabled = false; // Zoom 시작 시 회전 비활성화
    });

    map.on('zoomend', () => {
        if (map.getZoom() < maxSpinZoom) {
            setTimeout(() => {
                spinEnabled = true;
                spinGlobe(); // Zoom 종료 후 회전 재개
            }, 1000); // 잠시 후 회전 재개를 위해 지연 시간 설정
        }
    });

    map.on('mousedown', () => {
        userInteracting = true;
        clearTimeout(zoomTimer);
    });

    map.on('mouseup', () => {
        userInteracting = false;
        spinGlobe();
    });

    map.on('dragend', () => {
        userInteracting = false;
        spinGlobe();
    });
    map.on('pitchend', () => {
        userInteracting = false;
        spinGlobe();
    });
    map.on('rotateend', () => {
        userInteracting = false;
        spinGlobe();
    });

    map.on('moveend', () => {
        spinGlobe();
    });

    // 마커
    const geojson = {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'properties': {
                    'message': 'Foo',
                    'imageId': 1011,
                    'iconSize': [60, 60]
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [-66.324462, -16.024695]
                }
            },
            {
                'type': 'Feature',
                'properties': {
                    'message': 'Bar',
                    'imageId': 870,
                    'iconSize': [50, 50]
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [-61.21582, -15.971891]
                }
            },
            {
                'type': 'Feature',
                'properties': {
                    'message': 'Baz',
                    'imageId': 837,
                    'iconSize': [40, 40]
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [-63.292236, -18.281518]
                }
            }
        ]
    };

    for (const marker of geojson.features) {
        // Create a DOM element for each marker.
        const el = document.createElement('div');
        const width = marker.properties.iconSize[0];
        const height = marker.properties.iconSize[1];
        el.className = 'marker';
        el.style.backgroundImage = `url(https://picsum.photos/id/${marker.properties.imageId}/${width}/${height})`;
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
        el.style.backgroundSize = '100%';

        el.addEventListener('click', () => {
            window.alert(marker.properties.message);
        });

        // Add markers to the map.
        new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);
    }

    // 검색
    // Pause spinning on interaction
    map.addControl(
        new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl
        })
    );
    spinGlobe();
});
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