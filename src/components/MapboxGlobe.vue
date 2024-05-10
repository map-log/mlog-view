<script setup>
import { ref, onMounted } from 'vue';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';



mapboxgl.accessToken = 'pk.eyJ1IjoiaGVsbG9tYXRpYSIsImEiOiJjbHcwYmgwNG8xaWFiMnFvZzA0N2F0bHR5In0.mtCVIIEYY0CyDn7uQCg4Mg'

const mapContainer = ref(null);

// At low zooms, complete a revolution every two minutes.
const secondsPerRevolution = 120;
// Above zoom level 5, do not rotate.
const maxSpinZoom = 5;
// Rotate at intermediate speeds between zoom levels 3 and 5.
const slowSpinZoom = 3;

let userInteracting = false;
let spinEnabled = true;

onMounted(() => {
    if (mapContainer.value) {

        const map = new mapboxgl.Map({
            container: mapContainer.value,  //'map', // container ID
            // style: 'mapbox://styles/hellomatia/cluw85rzw001u01rjaw85873u', // style URL
            style: 'mapbox://styles/hellomatia/cluw85rzw001u01rjaw85873u',
            center: [126, 35], // starting position [lng, lat]
            zoom: 2, // starting zoom

        });
        map.on('style.load', () => {
            map.setFog({
                color: 'rgb(255, 255, 255)', // Lower atmosphere
                'high-color': 'rgb(255, 255, 255)', // Upper atmosphere
                // 'horizon-blend': 0.02, // Atmosphere thickness (default 0.2 at low zooms)
                'space-color': 'rgb(255, 255, 255)', // Background color
                'star-intensity': 0.6 // Background star brightness (default 0.35 at low zoooms )
            });
        });

        // 회전
        const spinGlobe = () => {
            const zoom = map.getZoom();
            if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
                let distancePerSecond = 360 / secondsPerRevolution;
                if (zoom > slowSpinZoom) {
                    // Slow spinning at higher zooms
                    const zoomDif =
                        (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
                    distancePerSecond *= zoomDif;
                }
                const center = map.getCenter();
                center.lng -= distancePerSecond;
                // Smoothly animate the map over one second.
                // When this animation is complete, it calls a 'moveend' event.
                map.easeTo({ center, duration: 1000, easing: (n) => n });
            }
        }

        map.on('mousedown', () => {
            userInteracting = true;
        });

        map.on('mouseup', () => {
            userInteracting = true;
            spinGlobe();
        });

        map.on('dragend', () => {
            userInteracting = true;
            spinGlobe();
        });
        map.on('pitchend', () => {
            userInteracting = true;
            spinGlobe();
        });
        map.on('rotateend', () => {
            userInteracting = true;
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
    }
})
</script>

<template>
    <div ref="mapContainer" class="map-container"></div>
</template>

<style scoped>
.map-container {
    width: 100vw;
    height: 100vh;
    background-color: white;
}
</style>