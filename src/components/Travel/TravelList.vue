<script setup>
import { ref, onMounted } from 'vue';
import { useTravelStore } from '@/stores/travel';
import TravelListItem from '@/components/Travel/TravelListItem.vue';

const travelList = ref([]);
const store = useTravelStore();

const fetchTravelList = async () => {
  try {
    // getMeInfo 호출하여 사용자 정보 가져오기
    await store.getMeInfo();
    if (store.userInfo && Array.isArray(store.userInfo.travelList)) {
      travelList.value = store.userInfo.travelList;
      console.log('Travel list fetched:', travelList.value);
    } else {
      travelList.value = [];
      console.log('Travel list is empty or not an array');
    }
  } catch (error) {
    console.error('Failed to fetch travel list:', error);
    travelList.value = [];
  }
};

onMounted(async () => {
  if (store.isLogin && store.isValidToken) {
    await fetchTravelList();
  } else {
    console.error('User is not logged in or userInfo is missing');
  }
});
</script>

<template>
  <div>
    <div v-for="travel in travelList" :key="travel.id">
      <TravelListItem :travel="travel" @itemClick="showItemDetailDrawer" />
    </div>
  </div>
</template>

<style scoped></style>
