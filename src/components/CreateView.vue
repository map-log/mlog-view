<script setup>
import { PlusOutlined } from '@ant-design/icons-vue'
import { reactive, ref } from 'vue';
import { message } from 'ant-design-vue';

const form = reactive({
    name: '',
    url: '',
    owner: '',
    type: '',
    approver: '',
    dateTime: null,
    description: '',
});

const rules = {
    name: [
        {
            required: true,
            message: 'Please enter user name',
        },
    ],
    url: [
        {
            required: true,
            message: 'please enter url',
        },
    ],
    owner: [
        {
            required: true,
            message: 'Please select an owner',
        },
    ],
    type: [
        {
            required: true,
            message: 'Please choose the type',
        },
    ],
    approver: [
        {
            required: true,
            message: 'Please choose the approver',
        },
    ],
    dateTime: [
        {
            required: true,
            message: 'Please choose the dateTime',
            type: 'object',
        },
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
const fileList = ref([
    {
        uid: '-xxx',
        percent: 50,
        name: 'image.png',
        status: 'uploading',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
        uid: '-5',
        name: 'image.png',
        status: 'error',
    },
]);
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

const value1 = ref();
const value = ref(0);

const success = () => {
    onClose()
    message
        .loading('저장중..', 2.5)
        .then(
            () => message.success('저장 성공!!!', 2.5),
        )
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
    <a-drawer title="여행 일정 추가하기" :width="500" :open="open" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onClose">

        <!-- 사진 추가 -->
        <div class="clearfix">
            <a-upload v-model:file-list="fileList" action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                list-type="picture-card" @preview="handlePreview">
                <div v-if="fileList.length < 8">
                    <plus-outlined />
                    <div style="margin-top: 8px">Upload</div>
                </div>
            </a-upload>
            <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
                <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
        </div>

        <!-- 일정 추가 -->
        <h3>일정</h3>
        <a-range-picker :size="large" :placement="bottomRight" v-model:value="value1" :bordered="false" />

        <h3>별점</h3>
        <a-rate v-model:value="value" allow-half />

        <h3>제목</h3>
        <a-input v-model:value="form.name" placeholder="나의 행복한 여행..." />

        <h3>설명</h3>
        <a-textarea v-model:value="form.description" :rows="4" placeholder="여행을 설명해주세요..." />

        <template #extra>
            <a-space>
                <a-button @click="onClose">취소</a-button>
                <a-button type="black" @click="success">저장</a-button>
            </a-space>
        </template>

        <template #footer>
            <a-space :size="10">
                <a-button key="다음일정" @click="handleCancel">다음일정</a-button>
                <a-button key="submit" type="primary" :loading="loading" @click="handleOk">완료!!</a-button>
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
</style>