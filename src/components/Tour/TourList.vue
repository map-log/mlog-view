<script setup>
import {  ref } from 'vue';
import axios from "axios";
import TourListItem from "./TourListItem.vue";
import { useMapStore } from "@/stores/map";

const { VITE_OPEN_API_SERVICE_KEY, VITE_SEARCH_TRIP_URL } = import.meta.env;

const mapStore = useMapStore();

const params = ref({
    serviceKey: VITE_OPEN_API_SERVICE_KEY,
    numOfRows: 10,
    pageNo: 1,
    MobileOS: "ETC",
    MobileApp: "AppTest",
    _type: "json",
    keyword: "",
});

const tripStation = ref([]);

const searchAttraction = () => {
    axios
        .get(VITE_SEARCH_TRIP_URL, { params: params.value })
        .then(({ data }) => {
            tripStation.value = data.response.body.items.item;
            addMarker(tripStation.value);
        });
};

const addMarker = (stations) => {
    mapStore.reset();
    const markers = [];
    for (const station of stations) {
        markers.push(
            createMarker(
                station.mapy,  // 위도와 경도 순서 변경
                station.mapx,  // 위도와 경도 순서 변경
                station.firstimage,
            )
        );
    }
    mapStore.markerList = markers;
};

const createMarker = (latitude, longitude, img) => {
    return {
        img: img,
        coordinates: [longitude, latitude], // 좌표 배열 순서 수정
    };
};

// find 함수는 global map 변수를 사용해야 합니다.
const find = (latitude, longitude) => {
    if (window.map) {
        window.map.flyTo({
            center: [longitude, latitude], // 위도와 경도 순서 변경
            essential: true,
            zoom: 14
        });

        const marker = createMarker(latitude, longitude, '');
        mapStore.markerList = [marker];
    }
};
</script>

<template>
    <a-space direction="vertical" :size="12">
        <a-space direction="horizontal" :size="12">
            <input type="text" v-model="params.keyword" class="search-input" placeholder="키워드를 입력하세요" />
            <a-button type="primary" @click="searchAttraction">검색</a-button>
        </a-space>
        <a-space direction="vertical" :size="10" style="width: 100%">
            <TourListItem v-for="station in tripStation" :key="station.contentid" :station="station"
                @click="find(station.mapy, station.mapx)" /> <!-- 위도와 경도 순서 변경 -->
        </a-space>
    </a-space>
</template>

<style scoped>
.search-input {
    padding: 10px;
    border: 2px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    outline: none;
    transition: border-color 0.3s;
}

.search-input:focus {
    border-color: #007bff;
}

a-space.horizontal {
    display: flex;
    align-items: center;
}

a-button[type="primary"] {
    margin-left: 10px;
}
</style>
