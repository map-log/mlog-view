<script setup>
import { ref } from 'vue';
import TravelDetailItem from '@/components/TravelDetailItem.vue'

</script>
<template>
    <a-timeline>
        <h3>대제목</h3>
        <TravelDetailItem />
        <TravelDetailItem />
    </a-timeline>
</template>

<style scoped></style>