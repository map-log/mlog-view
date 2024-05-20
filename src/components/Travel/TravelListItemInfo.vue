<template>
  <div v-if="travelDetail">
    <!-- 카드 이미지와 기본 정보 -->
    <div class="card">
      <div class="image-container">
        <img v-if="travelDetail.imageUrl" :src="travelDetail.imageUrl" alt="Main Image" class="main-image" />
        <img v-else src="@/assets/m-log-logo.png" alt="Main Image" class="main-image" />
      </div>
      <div class="card-content">
        <h2>{{ travelDetail.title }}</h2>
        <p>{{ travelDetail.description }}</p>
        <p><strong>Rating:</strong> {{ travelDetail.rating }}</p>
        <p><strong>Location:</strong> {{ travelDetail.lat }}, {{ travelDetail.lng }}</p>
        <p><strong>Start Date:</strong> {{ travelDetail.startDate }}</p>
        <p><strong>End Date:</strong> {{ travelDetail.endDate }}</p>
      </div>
    </div>

    <!-- 디테일 정보들 -->
    <div class="details" v-if="travelDetail.detailedSchedules && travelDetail.detailedSchedules.length">
      <h3>Details</h3>
      <div v-for="(detail, index) in travelDetail.detailedSchedules" :key="index" class="detail-item">
        <div class="image-col">
          <img v-if="assignedPhotos[index]" :src="assignedPhotos[index]" alt="Detail Image" class="detail-image" />
        </div>
        <div class="detail-content">
          <h4>{{ detail.title }}</h4>
          <p>{{ detail.description }}</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p>항목이 선택되지 않았습니다.</p>
  </div>
</template>

<script setup>
import { watch, ref, onMounted } from 'vue';
import { useTravelStore } from '@/stores/travel';

const props = defineProps({
  travelId: {
    type: Number,
    required: true
  }
});

const travelDetail = ref(null);
const photoDetail = ref([]); // 사진 배열을 담을 ref
const assignedPhotos = ref([]); // 순서대로 할당된 사진 배열

const travelStore = useTravelStore();

const fetchTravelDetail = async (id) => {
  if (id !== null && id !== undefined) {
    try {
      console.log('Fetching travel detail for id:', id);
      const { response } = await travelStore.fetchTravelDetail(id);
      console.log('Travel detail response:', response);
      travelDetail.value = response;  // 직접 응답 데이터 할당
      assignPhotosToDetails(); // 사진 할당 함수 호출
    } catch (error) {
      console.error('Error fetching travel detail:', error);
    }
  }
};

const fetchPhotoDetail = async (id) => {
  if (id !== null && id !== undefined) {
    try {
      console.log('Fetching photo detail for id:', id);
      const { response } = await travelStore.fetchPhotoDetail(id);
      console.log('Photo detail response:', response);
      photoDetail.value = response.travelPhotoList; // 사진 데이터를 배열로 저장
      assignPhotosToDetails(); // 사진 할당 함수 호출
    } catch (error) {
      console.error('Error fetching photo detail:', error);
    }
  }
};

const assignPhotosToDetails = () => {
  assignedPhotos.value = [];
  let photoIndex = 0;

  if (travelDetail.value && travelDetail.value.detailedSchedules) {
    travelDetail.value.detailedSchedules.forEach((detail, index) => {
      if (photoDetail.value.length > photoIndex) {
        assignedPhotos.value[index] = photoDetail.value[photoIndex].imageUrl;
        photoIndex++;
      } else {
        assignedPhotos.value[index] = null; // 할당할 사진이 없을 경우
      }
    });
  }
};

onMounted(() => {
  fetchTravelDetail(props.travelId);
  fetchPhotoDetail(props.travelId);
});

watch(() => props.travelId, (newId) => {
  fetchTravelDetail(newId);
  fetchPhotoDetail(newId);
});
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  /* 이미지와 내용을 위아래로 정렬 */
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.image-container {
  width: 100%;
  margin-bottom: 20px;
}

.main-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
}

.card-content {
  flex: 1;
}

.details {
  margin-top: 20px;
}

.detail-item {
  display: flex;
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.image-col {
  flex-shrink: 0;
  /* 이미지 크기 고정 */
  width: 100px;
  height: 100px;
  margin-right: 20px;
  /* 이미지와 내용 사이 여백 */
}

.detail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.detail-content {
  flex: 1;
  /* 내용이 남은 공간을 차지 */
}
</style>
