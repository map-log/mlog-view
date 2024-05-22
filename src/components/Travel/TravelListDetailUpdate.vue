<template>
  <div>
    <h3>사진</h3>
    <a-upload v-model:file-list="fileList" list-type="picture-card" @preview="handlePreview" accept="image/*">
      <div v-if="fileList.length < 1">
        <plus-outlined />
        <div style="margin-top: 8px">Upload</div>
      </div>
    </a-upload>
    <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>

    <h3>위치</h3>
    <GoogleMap :lat="form.lat" :lng="form.lng" @change-position="onChangePosition" />

    <h3>제목</h3>
    <a-input v-model:value="form.title" placeholder="나의 행복한 여행..." />

    <h3>일정</h3>
    <a-range-picker v-model:value="form.dateRange" />

    <h3>별점</h3>
    <a-rate v-model:value="form.rate" allow-half />

    <h3>한줄평!</h3>
    <a-textarea v-model:value="form.description" rows="4" placeholder="여행을 설명해주세요..." />

    <div class="wavy"></div>

    <div v-for="(detail, index) in detailedSchedules" :key="index" class="detail-schedule">
      <a-flex justify="space-between" align="center">
        <h2>{{ index + 1 }}.</h2>
        <a-button type="primary" danger ghost @click="removeDetailSchedule(index)">삭제</a-button>
      </a-flex>

      <h3>제목</h3>
      <a-input v-model:value="detail.title" placeholder="제목" />

      <h3>사진</h3>
      <a-upload list-type="picture-card" v-model:file-list="detail.fileList" @preview="handlePreview" accept="image/*">
        <div v-if="detail.fileList.length < 3">
          <plus-outlined />
          <div style="margin-top: 8px">사진 추가</div>
        </div>
      </a-upload>

      <h3>설명</h3>
      <a-textarea v-model:value="detail.description" rows="3" placeholder="일정 설명" />
      <div class="wavy"></div>
    </div>

    <div style="display: flex; justify-content: center; margin-top: 20px;">
      <a-button type="dashed" @click="addDetailSchedule" class="add-detail-button">상세 기록 추가하기</a-button>
    </div>

    <div style="display: flex; justify-content: space-between; margin-top: 20px;">
      <a-button type="primary" @click="onSave" class="action-button">수정 완료</a-button>
      <a-button @click="onClose" class="action-button">닫기</a-button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useTravelStore } from '@/stores/travel';
import moment from 'moment';
import GoogleMap from '@/components/Map/GoogleMap.vue';

const props = defineProps({
  travelId: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['updateList', 'closeForm', 'closeDrawer']);

const travelStore = useTravelStore();
const { modifyTravelDetail } = travelStore;

const form = ref({
  title: '',
  dateRange: [],
  rate: 0,
  description: '',
  lat: 0,
  lng: 0,
});

const fileList = ref([]);
const detailedSchedules = ref([]);

const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');

const fetchTravelDetail = async (id) => {
  if (id !== null && id !== undefined) {
    try {
      const { response } = await travelStore.fetchTravelDetail(id);
      form.value = {
        title: response.title,
        dateRange: [moment(response.startDate), moment(response.endDate)],
        rate: response.rating,
        description: response.description,
        lat: response.lat,
        lng: response.lng,
      };
      console.log("데이터" + response.lat,response.lng)
      detailedSchedules.value = response.detailedSchedules.map((schedule) => ({
        title: schedule.title,
        description: schedule.description,
        fileList: [],
      }));
    } catch (error) {
      console.error('Error fetching travel detail:', error);
    }
  }
};

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const handlePreview = async (file) => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj);
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};

const handleCancel = () => {
  previewVisible.value = false;
};

const onChangePosition = (lat, lng) => {
  form.value.lat = lat;
  form.value.lng = lng;
};

const addDetailSchedule = () => {
  detailedSchedules.value.push({
    title: '',
    description: '',
    fileList: [],
  });
};

const removeDetailSchedule = (index) => {
  detailedSchedules.value.splice(index, 1);
};

const onSave = async () => {
  try {
    // 메인 이미지 처리
    const firstFile = fileList.value[0];
    const titleImg = ref(null);
    if (firstFile) {
      if (!firstFile.url && !firstFile.preview) {
        firstFile.preview = await getBase64(firstFile.originFileObj);
      }
      titleImg.value = firstFile.preview;
    }

    // 상세 일정 데이터 처리
    const detailedSchedulesData = await Promise.all(
      detailedSchedules.value.map(async (detail, index) => {
        const detailImages = await Promise.all(
          detail.fileList.map(async (file) => {
            if (!file.url && !file.preview) {
              file.preview = await getBase64(file.originFileObj);
            }
            return file.url || file.preview;
          })
        );

        return {
          seq: index + 1, // 시퀀스 번호 추가
          title: detail.title,
          description: detail.description,
          images: detailImages,
        };
      })
    );

    // 여행 데이터 구성
    const travelData = {
      title: form.value.title,
      description: form.value.description,
      image: titleImg.value,
      lat: form.value.lat,
      lng: form.value.lng,
      startDate: form.value.dateRange[0],
      endDate: form.value.dateRange[1],
      rating: form.value.rate,
      detailedSchedules: detailedSchedulesData,
    };

    // 여행 기록 수정 API 호출
    await modifyTravelDetail(props.travelId, travelData);
    message.success('수정 성공!');
    emit('updateList');
    emit('closeDrawer'); // 상세 정보 창 닫기
    emit('closeForm'); // 상세 정보 창 닫기
  } catch (error) {
    message.error('수정 실패');
    console.error('Error updating travel:', error);
  }
};

const onClose = () => {
  emit('closeDrawer');
  // emit('closeForm'); // 상세 정보 창 닫기
};

onMounted(() => {
  fetchTravelDetail(props.travelId);
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

.input-title,
.date-picker,
.input-description {
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

.detail-input,
.detail-description {
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
  width: 200px;
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

.add-detail-button {
  margin-bottom: 20px;
}

.action-button {
  margin-top: 20px;
  margin-right: 8px;
}

.action-button:last-child {
  margin-right: 0;
}

.delete-button {
  background-color: #ff6347;
}

.edit-button {
  background-color: #4682b4;
}
</style>
