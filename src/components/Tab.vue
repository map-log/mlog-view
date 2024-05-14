<script setup>
import { ref, computed } from 'vue';
import { AlignCenterOutlined, DoubleLeftOutlined } from '@ant-design/icons-vue'
import TourList from '@/components/Tour/TourList.vue'
import Loading from '@/components/Util/Loading.vue'
import TravelList from '@/components/Travel/TravelList.vue'


const activeKey = ref('1');
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

const detailOpen = ref(false)

const drawerWidth = computed(() => {
    if (detailOpen.value) {
        return 800;
    } else {
        return 400;
    }
})

const openDetail = () => {
    detailOpen.value = !detailOpen.value
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
        @close="onClose" :mask="false">
        <template #extra>
            <a-button type="text" style="margin-right: 0px" @click="onClose">
                <template #icon>
                    <DoubleLeftOutlined />
                </template>
            </a-button>
        </template>
        <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="1" tab="내 여행 기록">
                <TravelList />
            </a-tab-pane>
            <a-tab-pane key="2" tab="관광지 정보">
                <TourList />

            </a-tab-pane>
        </a-tabs>
    </a-drawer>
</template>

<style>
/* 스크롤바의 폭 너비 */
.ant-drawer-body::-webkit-scrollbar {
    width: 5px;
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