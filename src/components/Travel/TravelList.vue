<script setup>
import { ref } from 'vue';
import TravelListItem from '@/components/Travel/TravelListItem.vue'

</script>
<template>
    <a-timeline>
        <h3>대제목</h3>
        <TravelListItem />
        <TravelListItem />
    </a-timeline>
</template>

<style scoped></style>