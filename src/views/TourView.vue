<script setup>
import { ref, computed } from 'vue';
import { AlignCenterOutlined, DoubleLeftOutlined } from '@ant-design/icons-vue'
import TourItem from '@/components/TourItem.vue'
import TourItemLoading from '@/components/TourItemLoading.vue'
import TravelDetail from '@/components/TravelDetail.vue'

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
        <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="1" tab="내 여행 기록">
                <!-- <template #extra>
                    <a-button type="text" style="margin-right: 0px" @click="onClose">
                        <template #icon>
                            <DoubleLeftOutlined />
                        </template>
                    </a-button>
                </template>
                <a-switch :checked="!loading" @change="onChange" />
                <template v-if="loading">
                    <TourItemLoading />
                </template>
                <template v-else>
                    <a-space direction="horizontal" :size="30">
                        <a-space direction="vertical" :size="12">
                            <TourItem @open-detail="openDetail" />
                            <TourItem @open-detail="openDetail" />
                            <TourItem @open-detail="openDetail" />
                        </a-space>
                        <TravelDetail v-show="detailOpen" />
                    </a-space>
                </template> -->
            </a-tab-pane>
            <a-tab-pane key="2" tab="관광지 정보">
                <a-space direction="horizontal" :size="30">
                    <a-space direction="vertical" :size="12">
                        <TourItem />
                    </a-space>
                </a-space>
            </a-tab-pane>
            <a-tab-pane key="3" tab="Tab 3">Content of Tab Pane 3</a-tab-pane>
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