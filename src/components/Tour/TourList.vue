<script setup>
import { computed, ref, watch } from 'vue';
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
})

const tripStation = ref([]);

// const computedTripStation = computed(() => {
//     return tripStation.value;
// })

// 키워드에 따른 데이터 조회, debounce로 호출 지연
const searchAttraction = () => {
    axios
        .get(VITE_SEARCH_TRIP_URL, { params: params.value })
        .then(({ data }) => {
            console.log(params.value.keyword)
            tripStation.value = data.response.body.items.item
            console.log(tripStation.value)
            addMarker(tripStation.value)
        })
}

// const watchStations = watch((tripStation), (newValue) => {
//     addMarker(newValue)
// })

const addMarker = (stations) => {
    mapStore.reset()
    const markers = []
    for (const station of stations) {
        markers.push(
            createMarker(
                station.mapx,
                station.mapy,
                station.firstimage,
            )
        )
    }
    mapStore.markerList = markers
}


const createMarker = (latitude, longitude, img) => {
    return {
        img: img,
        coordinates: [latitude, longitude],
    };
}

const find = (latitude, longitude) => {
    console.log(`${latitude} ${longitude}`),
        { coordinates: [latitude, longitude], }
}

</script>

<template>
    <a-space direction="vertical" :size="12">
        <a-space direction="horizontal" :size="12">
            <input type="text" v-model="params.keyword" class="search-input" placeholder="키워드를 입력하세요" />
            <a-button type="primary" @click="searchAttraction">검색</a-button>
        </a-space>
        <a-space direction="vertical" :size="10" style="width: 100%">
            <TourListItem v-for="station in tripStation" :key="station.contentid" :station="station"
                @click="find(station.mapx, station.mapy)" />
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

/* 추가한 스타일 */
a-space.horizontal {
    display: flex;
    align-items: center;
}

a-button[type="primary"] {
    margin-left: 10px;
}
</style>