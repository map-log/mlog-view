<template>
  <div v-if="travelDetail && Object.keys(travelDetail).length">
    <div class="image-row-wrapper">
      <button @click="scrollLeft" class="scroll-button left">
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
        </svg>
      </button>
      <div class="image-row" ref="imageRow">
        <div v-for="photo in photos" :key="photo.imageUrl" class="image-col">
          <div class="photo-card">
            <img :src="photo.imageUrl ? photo.imageUrl : require('@/assets/m-log-logo.png')" class="photo-image" />
          </div>
        </div>
      </div>
      <button @click="scrollRight" class="scroll-button right">
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"></path>
        </svg>
      </button>
    </div>
    <h2>{{ travelDetail.title }}</h2>
    <p>{{ travelDetail.description }}</p>
    <div style="margin-top: 16px;">
      <h3>Details:</h3>
      <p>ID: {{ travelDetail.id }}</p>
    </div>
  </div>
  <div v-else>
    <p>항목이 선택되지 않았습니다.</p>
  </div>
</template>

<script setup>
import { watch, ref } from 'vue';
import { useTravelStore } from '@/stores/travel';

const props = defineProps({
  travelDetail: {
    type: Object,
    required: false,
    default: () => ({})
  },
  travelId: {
    type: Number,
    required: true
  }
});

const photos = ref([]);
const imageRow = ref(null);

const travelStore = useTravelStore();

const fetchPhotos = async () => {
  if (props.travelId) {
    console.log("Fetching photos for travelId:", props.travelId);
    await travelStore.fetchPhotoDetail(props.travelId);
    photos.value = travelStore.photoDetail.response.travelPhotoList;
    console.log("Fetched photos:", photos.value);
  }
};

watch(() => props.travelId, (newTravelId) => {
  console.log('Selected Travel ID:', newTravelId);
  fetchPhotos();
}, { immediate: true });

watch(() => props.travelDetail, (newDetail) => {
  console.log('Selected Travel Detail:', newDetail);
}, { immediate: true });

const scrollLeft = () => {
  if (imageRow.value) {
    imageRow.value.scrollBy({ left: -200, behavior: 'smooth' });
  }
};

const scrollRight = () => {
  if (imageRow.value) {
    imageRow.value.scrollBy({ left: 200, behavior: 'smooth' });
  }
};
</script>

<style scoped>
.image-row-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}

.image-row {
  display: flex;
  overflow-x: hidden; /* 스크롤바 숨기기 */
  gap: 16px;
  padding: 8px; /* 스크롤바와 이미지가 겹치지 않도록 여백을 추가합니다 */
  scroll-behavior: smooth;
}

.image-col {
  flex: 0 0 auto;
  width: 200px;
}

.photo-card {
  width: 100%;
  height: 200px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.photo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.scroll-button {
  background: #f0f0f0;
  border: none;
  color: #333;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  border-radius: 50%; /* 둥근 모서리 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* 약간의 그림자 */
  transition: background 0.3s, transform 0.3s; /* 배경색과 변환 효과 */
}

.scroll-button:hover {
  background: #e0e0e0; /* 호버 시 배경색 */
  transform: translateY(-50%) scale(1.1); /* 호버 시 확대 효과 */
}

.scroll-button svg {
  width: 24px;
  height: 24px;
}

.scroll-button.left {
  left: 8px; /* 위치 조정 */
}

.scroll-button.right {
  right: 8px; /* 위치 조정 */
}
</style>
