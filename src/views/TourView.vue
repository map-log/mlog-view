<script setup>
import { ref } from 'vue';
import { AlignCenterOutlined } from '@ant-design/icons-vue'
import TourItem from '@/components/TourItem.vue'
import TourItemLoading from '@/components/TourItemLoading.vue'


const placement = ref('left');
const open = ref(false);
const showDrawer = () => {
    open.value = true;
};
const onClose = () => {
    open.value = false;
};

const loading = ref(true);
const onChange = checked => {
    loading.value = !checked;
};

const drawerWidth = ref(400)

const openDetail = () => {
    if (drawerWidth.value == 400) {
        drawerWidth.value = 800
    } else {
        drawerWidth.value = 400
    }
}

</script>

<template>
    <a-float-button type="default" :style="{
        top: '24px',
        left: '24px',
    }" @click="showDrawer">
        <template #icon>
            <AlignCenterOutlined />
        </template>
    </a-float-button>

    <a-drawer title="내 여행 기록..." :width="drawerWidth" :placement="placement" :closable="false" :open="open"
        @close="onClose">
        <a-switch :checked="!loading" @change="onChange" />
        <template v-if="loading">
            <TourItemLoading />
        </template>
        <template v-else>
            <a-space direction="vertical" :size="12">
                <TourItem @open-detail="openDetail" />
                <TourItem @open-detail="openDetail" />
                <TourItem @open-detail="openDetail" />
            </a-space>
        </template>
    </a-drawer>
</template>

<style>
/* 스크롤바의 폭 너비 */
.ant-drawer-body::-webkit-scrollbar {
    width: 10px;
}

.ant-drawer-body::-webkit-scrollbar-thumb {
    background: rgb(87, 87, 87);
    /* 스크롤바 색상 */
    border-radius: 10px;
    /* 스크롤바 둥근 테두리 */
}

.ant-drawer-body::-webkit-scrollbar-track {
    background: rgb(255, 255, 255);
    /*스크롤바 뒷 배경 색상*/
}
</style>