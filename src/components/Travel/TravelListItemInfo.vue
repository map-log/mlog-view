<template>
  <div v-if="travelDetail">
    <!-- 여행 기록 추가 form -->
    <div class="travel-detail">

      <!-- 사진 추가 -->
      <h3>사진</h3>
      <div class="photo-container">
        <div class="photo-scroll">
          <img v-for="(photo, index) in photoDetail" :key="index" :src="photo.imageUrl" alt="Uploaded Image" class="uploaded-image" />
        </div>
      </div>

      <h3>위치</h3>
      <GoogleMap @change-position="onChangePosition" />

      <h3>제목</h3>
      <a-input v-model:value="travelDetail.title" placeholder="나의 행복한 여행..." class="input-title" readonly />

      <h3>일정</h3>
      <a-range-picker v-model:value="dateRange" class="date-picker" readonly />

      <h3>별점</h3>
      <a-rate v-model:value="travelDetail.rating" class="rating" disabled />

      <h3>한줄평!</h3>
      <a-textarea v-model:value="travelDetail.description" placeholder="여행을 설명해주세요..." class="input-description" rows="4" readonly />

      <div class="wavy"></div>

      <div v-for="(detail, index) in travelDetail.detailedSchedules" :key="index" class="detail-schedule">
        <a-flex justify="space-between" align="center">
          <h2>{{ index + 1 }}.</h2>
        </a-flex>

        <h3>제목</h3>
        <p>{{ detail.title }}</p>

        <h3>사진</h3>
        <div class="photo-container">
          <div class="photo-scroll">
            <img v-if="assignedPhotos[index]" :src="assignedPhotos[index]" alt="Detail Image" class="detail-image" />
          </div>
        </div>

        <h3>설명</h3>
        <p>{{ detail.description }}</p>
        <div class="wavy"></div>
      </div>
    </div>
  </div>
  <div v-else>
    <p>로딩 중...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useTravelStore } from '@/stores/travel';
import GoogleMap from '@/components/Map/GoogleMap.vue';
import moment from 'moment';

const props = defineProps({
  travelId: {
    type: Number,
    required: true
  }
});

const travelDetail = ref(null);
const photoDetail = ref([]);
const dateRange = ref([]);
const assignedPhotos = ref([]);

const travelStore = useTravelStore();

const fetchTravelDetail = async (id) => {
  if (id !== null && id !== undefined) {
    try {
      const { response } = await travelStore.fetchTravelDetail(id);
      travelDetail.value = response;
      dateRange.value = [moment(response.startDate), moment(response.endDate)];
      await fetchPhotoDetail(id);  // 여기에 await 추가
      assignPhotosToDetails();
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

const onChangePosition = (x, y) => {
  console.log(x, y);
};

watch(dateRange, (newDateRange) => {
  if (newDateRange.length === 2) {
    travelDetail.value.startDate = newDateRange[0].format();
    travelDetail.value.endDate = newDateRange[1].format();
  }
});

watch(() => props.travelId, (newId) => {
  fetchTravelDetail(newId);
  fetchPhotoDetail(newId);
});
</script>

<style scoped>
.photo-container {
  overflow-x: auto;
  white-space: nowrap;
}

.photo-scroll {
  display: inline-flex;
}

.uploaded-image {
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 10px;
}

.detail-schedule {
  margin-bottom: 20px;
}

.detail-image {
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 10px;
}

.wavy {
  position: relative;
  width: 100%;
  height: 50px;
  overflow: hidden;
}

.wavy::before {
  content: 'aaaaaaaaaaaaaaaaaaaaaa';
  position: absolute;
  top: -42px;
  left: 0;
  font-size: 4em;
  color: transparent;
  text-decoration-style: wavy;
  text-decoration-color: #858585;
  text-decoration-line: underline;
  animation: animate 2s linear infinite;
}
</style>