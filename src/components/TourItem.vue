<script setup>
import { ref, onMounted } from 'vue';
import axios from "axios";

const { VITE_OPEN_API_SERVICE_KEY } = import.meta.env
const { VITE_SEARCH_TRIP_URL } = import.meta.env

const tripStation = ref([])

onMounted(() => {
    getTripStation()
})

const getTripStation = () => {
    axios.get(VITE_SEARCH_TRIP_URL, {
        params: {
            serviceKey: VITE_OPEN_API_SERVICE_KEY,
            numOfRows: 10,
            pageNo: 1,
            MobileOS: "ETC",
            MobileApp: "AppTest",
            _type: "json",
            keyword: "해운대",
        },
    })
        .then(({ data }) => {
            console.log(data)
            tripStation.value = data.items[0].item
        })
        .catch((err) => {
            console.log(err)
        })
}

</script>
<template>
    <a-space :size="10">
        <a-card hoverable style=" width: 300">
            <template #cover>
                <!-- <img alt="example" src= /> -->
            </template>
            <a-card-meta title="Card title" description="This is the description">
            </a-card-meta>
        </a-card>
        <!-- <TravelDetail v-if="open" /> -->
    </a-space>
</template>
