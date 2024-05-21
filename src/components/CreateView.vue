<script setup>
import { PlusOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { useTravelStore } from '@/stores/travel'
import GoogleMap from '@/components/Map/GoogleMap.vue'

const form = ref({
    lat: '',
    lng: '',
    title: '',
    dateRange: '',
    rate: '',
    description: '',
});

const rules = {
    img: [{
        required: true,
        message: 'Please enter url description',
    }
    ],
    title: [{
        required: true,
        message: 'Please enter url description',
    }
    ],
    description: [
        {
            required: true,
            message: 'Please enter url description',
        },
    ],
};

const open = ref(false);
const showDrawer = () => {
    open.value = true;
};
const onClose = () => {
    open.value = false;
};

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');
const handleCancel = () => {
    previewVisible.value = false;
    previewTitle.value = '';
};

const handlePreview = async file => {
    if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
    }
    previewImage.value = file.url || file.preview;
    previewVisible.value = true;
    previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};

const success = () => {
    onClose()

    message
        .loading('저장중..', 2.5)
        .then(
            () => message.success('저장 성공!!!', 2.5),
        )
};

const detailedSchedules = ref([])

const addDetailSchedule = () => {
    detailedSchedules.value.push({
        fileList: [],
        title: "",
        description: "",
    })
}

const removeDetailSchedule = (index) => {
    detailedSchedules.value.splice(index, 1);
}

const lat = ref(0)
const lng = ref(0)

const onChangePosition = (x, y) => {
    console.log(x, y)
    lat.value = x;
    lng.value = y;
    console.log(lat.value, lng.value)
}

const travelStore = useTravelStore();
const { createTravelLog } = travelStore;

const fileList = ref([]);

const onSave = async () => {

    // 첫 번째 파일만 Base64로 변환하여 titleImg에 할당
    const firstFile = fileList.value[0]; // 첫 번째 파일만 선택
    const titleImg = ref(null);
    if (firstFile) {
        if (!firstFile.url && !firstFile.preview) {
            firstFile.preview = await getBase64(firstFile.originFileObj);
        }
        titleImg.value = firstFile.preview; // 첫 번째 파일의 Base64 이미지를 titleImg에 할당
    }

    // 상세 일정의 각 파일을 Base64로 변환
    const detailedSchedulesData = await Promise.all(detailedSchedules.value.map(async (detail, index) => {
        const detailImages = await Promise.all(detail.fileList.map(async file => {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj);
            }
            return file.preview;
        }));

        return {
            seq: index + 1,
            title: detail.title,
            description: detail.description,
            images: detailImages
        };
    }));

    const travelData = {
        title: form.value.title,
        description: form.value.description,
        image: titleImg.value,
        lat: lat.value,
        lng: lng.value,
        startDate: form.value.dateRange[0],
        endDate: form.value.dateRange[1],
        rating: form.value.rate,
        detailedSchedules: detailedSchedulesData
    };

    console.log(travelData)
    await createTravelLog(travelData);
    onClose();
};


</script>

<template>
    <a-float-button type="default" :style="{
        bottom: '24px',
        right: '24px',
    }" @click="showDrawer">
        <template #icon>
            <PlusOutlined />
        </template>
    </a-float-button>

    <!-- 여행 기록 추가 form -->
    <a-drawer title="여행 기록 추가하기" :width="500" :open="open" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onClose">

        <!-- 사진 추가 -->
        <h3>사진</h3>
        <div class="clearfix">
            <a-upload v-model:file-list="fileList" action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                list-type="picture-card" @preview="handlePreview" accept="image/*">
                <div v-if="fileList.length < 1">
                    <plus-outlined />
                    <div style="margin-top: 8px">Upload</div>
                </div>
            </a-upload>
            <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
                <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
        </div>

        <h3>위치</h3>
        <GoogleMap @change-position="onChangePosition" />

        <h3>제목</h3>
        <a-input v-model:value="form.title" placeholder="나의 행복한 여행..." />

        <!-- 일정 추가 -->
        <h3>일정</h3>
        <a-range-picker v-model:value="form.dateRange" :bordered="false" />

        <h3>별점</h3>
        <a-rate v-model:value="form.rate" allow-half />

        <h3>한줄평!</h3>
        <a-textarea v-model:value="form.description" :rows="4" placeholder="여행을 설명해주세요..." />

        <div class="wavy"></div>

        <div v-for="(detail, index) in detailedSchedules" :key="index" class="detail-schedule">
            <a-flex justify="space-between" align="center">
                <h2>{{ index + 1 }}.</h2>
                <a-button type="primary" danger ghost @click="removeDetailSchedule(index)">삭제</a-button>
            </a-flex>

            <h3>제목</h3>
            <a-input v-model:value="detail.title" placeholder="제목" />

            <h3>사진</h3>
            <a-upload list-type="picture-card" v-model:file-list="detail.fileList"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76" @preview="handlePreview" accept="image/*">
                <div v-if="detail.fileList.length < 3">
                    <plus-outlined />
                    <div style="margin-top: 8px">사진 추가</div>
                </div>
            </a-upload>

            <h3>설명</h3>
            <a-textarea v-model:value="detail.description" :rows="3" placeholder="일정 설명" />
            <div class="wavy"></div>
        </div>

        <div style="display: flex; justify-content: center; margin-top: 20px;">
            <a-button type="dashed" @click="addDetailSchedule">상세 기록 추가하기</a-button>
        </div>

        <template #footer>
            <a-space :size="10">
                <a-button key="submit" type="primary" @click="onSave">완료!!</a-button>
            </a-space>
        </template>
    </a-drawer>
</template>

<style scoped>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
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

/* @keyframes animate
{
    0%
    {
        transform: translateX(-1px);
    }

    100%
    {
        transform: translateX(-56px);
    }
} */
</style>