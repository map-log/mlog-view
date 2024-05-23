<script setup>
import { ref } from 'vue';
import axios from 'axios';
import TourListItem from './TourListItem.vue';
import { useMapStore } from '@/stores/map';
import { Dropdown, Menu, Button } from 'ant-design-vue';

const { VITE_OPEN_API_SERVICE_KEY, VITE_SEARCH_TRIP_URL } = import.meta.env;

const mapStore = useMapStore();

const params = ref({
    serviceKey: VITE_OPEN_API_SERVICE_KEY,
    numOfRows: 10,
    pageNo: 1,
    MobileOS: 'ETC',
    MobileApp: 'AppTest',
    _type: 'json',
    keyword: '',
    contentTypeId: '',
});

const tripStation = ref([]);

const searchAttraction = () => {
    const { contentTypeId } = params.value;
    if (!contentTypeId) {
        alert("관광 타입을 선택해주세요.");
        return;
    }

    axios
        .get(VITE_SEARCH_TRIP_URL, { params: params.value })
        .then(({ data }) => {
            if (data.response.body.items) {
                tripStation.value = data.response.body.items.item;
                addMarker(tripStation.value);
            } else {
                tripStation.value = [];
            }
        })
        .catch((error) => {
            console.error("API 요청 중 오류 발생:", error);
        });
};

const addMarker = (stations) => {
    mapStore.reset();
    const markers = [];
    for (const station of stations) {
        markers.push(
            createMarker(
                station.mapy,
                station.mapx,
                station.firstimage,
            )
        );
    }
    mapStore.markerList = markers;
};

const createMarker = (latitude, longitude, img) => {
    return {
        img: img,
        coordinates: [longitude, latitude],
    };
};

const emit = defineEmits(['itemClick'])

const itemClick = (station) => {
    emit("itemClick", station)
}

const find = (latitude, longitude) => {
    if (window.map) {
        window.map.flyTo({
            center: [longitude, latitude],
            essential: true,
            zoom: 9,
        });
    }
};

const handleMenuClick = ({ key }) => {
    params.value.contentTypeId = key;
};

const getTypeName = (contentTypeId) => {
    const types = {
        '12': '관광지',
        '14': '문화시설',
        '15': '축제공연행사',
        '25': '여행코스',
        '28': '레포츠',
        '32': '숙박',
        '38': '쇼핑',
        '39': '음식점',
    };
    return types[contentTypeId] || '타입 선택';
};
</script>

<template>
    <a-space direction="vertical" :size="12">
        <a-space direction="horizontal" :size="12" class="search-bar">
            <div class="input-container">
                <Dropdown>
                    <template #overlay>
                        <Menu @click="handleMenuClick">
                            <Menu.Item key="12">관광지</Menu.Item>
                            <Menu.Item key="14">문화시설</Menu.Item>
                            <Menu.Item key="15">축제공연행사</Menu.Item>
                            <Menu.Item key="25">여행코스</Menu.Item>
                            <Menu.Item key="28">레포츠</Menu.Item>
                            <Menu.Item key="32">숙박</Menu.Item>
                            <Menu.Item key="38">쇼핑</Menu.Item>
                            <Menu.Item key="39">음식점</Menu.Item>
                        </Menu>
                    </template>
                    <Button class="dropdown-button">
                        <template v-if="params.contentTypeId">
                            {{ getTypeName(params.contentTypeId) }}
                        </template>
                        <template v-else>
                            타입 선택
                        </template>
                    </Button>
                </Dropdown>
                <input type="text" v-model="params.keyword" class="search-input" placeholder="도시 검색" />
            </div>
            <a-button type="primary" @click="searchAttraction" class="search-button">검색</a-button>
        </a-space>
        <a-space direction="vertical" :size="10" style="width: 100%">
            <TourListItem v-for="station in tripStation" :key="station.contentid" :station="station"
                @click="find(station.mapy, station.mapx, station.firstimage)" @itemClick="itemClick(station)" />
        </a-space>
    </a-space>
</template>

<style scoped>
.search-bar {
    display: flex;
    align-items: center;
    gap: 10px;
}

.input-container {
    display: flex;
    align-items: center;
    border: 2px solid #ccc;
    border-radius: 5px;
    overflow: hidden;
    background-color: #fff;
}

.search-input {
    padding: 10px;
    border: none;
    font-size: 16px;
    outline: none;
    width: 140px;
    /* 크기 조정 */
}

.dropdown-button {
    border: 1px solid #ccc;
    /* 테두리 추가 */
    background: #f0f0f0;
    /* 배경색 */
    color: #333;
    /* 텍스트 색상 */
    padding: 10px 20px;
    /* 패딩 */
    cursor: pointer;
    width: 100px;
    /* 너비 설정 */
    margin-left: 7px;
    /* 왼쪽 여백 */
    transition: background-color 0.3s, color 0.3s;
    /* 전환 효과 */
    display: flex;
    align-items: center;
    justify-content: center;
    /* 중앙 정렬 */
}

.dropdown-button:hover {
    background: #007bff;
    /* 호버 배경색 */
    color: #fff;
    /* 호버 텍스트 색상 */
}

.search-button {
    border-radius: 5px;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    /* 중앙 정렬 */
}

.search-input:focus {
    border-color: #007bff;
}
</style>
