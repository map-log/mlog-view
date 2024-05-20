<template>
  <div v-if="travelDetail">
    <!-- 여행 기록 추가 form -->
    <div class="travel-detail">

      <!-- 사진 추가 -->
      <h3>사진</h3>
      <div class="clearfix">
        <img :src="travelDetail.imageUrl" alt="Uploaded Image" class="uploaded-image" />
      </div>

      <h3>위치</h3>
      <GoogleMap 
        :lat="travelDetail.latitude" 
        :lng="travelDetail.longitude" 
        @changePosition="onChangePosition" 
      />

      <h3>제목</h3>
      <a-input v-model:value="travelDetail.title" placeholder="나의 행복한 여행..." class="input-title" readonly />

      <h3>일정</h3>
      <a-range-picker v-model:value="dateRange" class="date-picker" disabled />

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
        <a-input v-model:value="detail.title" readonly class="detail-input" />

        <h3>사진</h3>
        <div class="clearfix image-container">
          <button @click="scrollLeft(index)" class="scroll-button left">&#9664;</button>
          <div ref="imageContainer" class="image-wrapper">
            <img v-for="(photo, photoIndex) in assignedPhotos[index]" :key="photoIndex" :src="photo" alt="Detail Image" class="detail-image" />
          </div>
          <button @click="scrollRight(index)" class="scroll-button right">&#9654;</button>
        </div>

        <h3>설명</h3>
        <a-textarea v-model:value="detail.description" readonly class="detail-description" rows="2" />
      </div>
    </div>
  </div>
  <div v-else>
    <p>로딩 중...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
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
const imageContainerRefs = ref([]);

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
      assignedPhotos.value[index] = [];
      while (photoDetail.value.length > photoIndex) {
        assignedPhotos.value[index].push(photoDetail.value[photoIndex].imageUrl);
        photoIndex++;
      }
    });
  }

  // 이미지 컨테이너 참조 배열 초기화
  nextTick(() => {
    imageContainerRefs.value = document.querySelectorAll('.image-wrapper');
  });
};

const scrollLeft = (index) => {
  if (imageContainerRefs.value[index]) {
    imageContainerRefs.value[index].scrollBy({
      left: -200,
      behavior: 'smooth'
    });
  }
};

const scrollRight = (index) => {
  if (imageContainerRefs.value[index]) {
    imageContainerRefs.value[index].scrollBy({
      left: 200,
      behavior: 'smooth'
    });
  }
};

onMounted(() => {
  fetchTravelDetail(props.travelId);
  fetchPhotoDetail(props.travelId);
});

const onChangePosition = (lat, lng) => {
  console.log(`New position: Latitude: ${lat}, Longitude: ${lng}`);
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
.travel-detail {
  background: #ffffff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: auto;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

h3 {
  color: #4A90E2;
  font-family: 'Roboto', sans-serif;
  margin-bottom: 10px;
}

.uploaded-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.uploaded-image:hover {
  transform: scale(1.05);
}

.input-title, .date-picker, .input-description {
  width: 100%;
  margin-bottom: 20px;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.detail-schedule {
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.detail-schedule:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.detail-input, .detail-description {
  width: 100%;
  margin-bottom: 10px;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.image-container {
  display: flex;
  align-items: center;
}

.image-wrapper {
  display: flex;
  overflow: hidden;
  width: 200px; /* 한 번에 보여줄 이미지의 너비에 맞게 조정 */
}

.scroll-button {
  background: transparent;
  color: #cccccc;
  border: none;
  padding: 5px;
  cursor: pointer;
  font-size: 24px;
  transition: color 0.3s ease;
}

.scroll-button:hover {
  color: #999999;
}

.scroll-button:disabled {
  color: #e0e0e0;
  cursor: not-allowed;
}

.detail-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.detail-image:hover {
  transform: scale(1.05);
}

.wavy {
  position: relative;
  width: 100%;
  height: 50px;
  overflow: hidden;
  background: #ffffff;
  margin: 20px 0;
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
