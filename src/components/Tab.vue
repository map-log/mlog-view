<script setup>
import { ref, computed } from 'vue';
import { AlignCenterOutlined, DoubleLeftOutlined } from '@ant-design/icons-vue';
import TourList from '@/components/Tour/TourList.vue';
import TravelListItemInfo from '@/components/Travel/TravelListItemInfo.vue';
import TourListItemDetail from '@/components/Tour/TourListItemDetail.vue';
import TravelList from './Travel/TravelList.vue';

const activeKey = ref('1');
const placement = ref('left');
const open = ref(false);
const showDrawer = () => {
  open.value = true;
};
const onClose = () => {
  open.value = false;
  closeItemDetailDrawer();
  closeTourDetailDrawer();
};

const detailOpen = ref(false);

const drawerWidth = computed(() => {
  return detailOpen.value ? 800 : 400;
});

const openDetail = () => {
  detailOpen.value = !detailOpen.value;
};

// 새로운 drawer 관련 상태 및 메서드
const itemDetailOpen = ref(false);
const selectedItem = ref(null);
const showItemDetailDrawer = (item) => {
  console.log("Item clicked:", item); // 로그 추가
  selectedItem.value = item;
  itemDetailOpen.value = true;
};
const closeItemDetailDrawer = () => {
  itemDetailOpen.value = false;
  selectedItem.value = null;
};

// 관광지 상세 정보 drawer 관련 상태 및 메서드 추가
const tourDetailOpen = ref(false);
const selectedTourItem = ref(null);
const showTourDetailDrawer = (item) => {
  selectedTourItem.value = item;
  tourDetailOpen.value = true;
};
const closeTourDetailDrawer = () => {
  tourDetailOpen.value = false;
  selectedTourItem.value = null;
};
</script>

<template>
  <a-float-button type="default" :style="{ top: '24px', left: '24px' }" @click="showDrawer">
    <template #icon>
      <AlignCenterOutlined />
    </template>
  </a-float-button>

  <div class="drawer-container">
    <!-- 두 번째 drawer -->
    <a-drawer title="상세 정보" :placement="'left'" :width="400" :open="itemDetailOpen" :mask="false" :closable="false"
      class="secondary-drawer">
      <template #extra>
        <a-button type="text" style="margin-right: 0px" @click="closeItemDetailDrawer">
          <template #icon">
            <DoubleLeftOutlined />
          </template>
        </a-button>
      </template>
      <TravelListItemInfo :travelDetail="selectedItem" :travelId="selectedItem?.id" />
    </a-drawer>

    <!-- 관광지 상세 정보 drawer 추가 -->
    <a-drawer title="관광지 상세 정보" :placement="'left'" :width="400" :open="tourDetailOpen" :mask="false"
      :closable="false" class="secondary-drawer">
      <template #extra>
        <a-button type="text" style="margin-right: 0px" @click="closeTourDetailDrawer">
          <template #icon>
            <DoubleLeftOutlined />
          </template>
        </a-button>
      </template>
      <TourListItemDetail :item="selectedTourItem" />
    </a-drawer>

    <a-drawer title="내 여행 기록..." :width="drawerWidth" :placement="placement" :closable="false" :open="open"
      @close="onClose" :mask="false" class="main-drawer">
      <template #extra>
        <a-button type="text" style="margin-right: 0px" @click="onClose">
          <template #icon>
            <DoubleLeftOutlined />
          </template>
        </a-button>
      </template>
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="내 여행 기록">
          <TravelList :selectedItem="selectedItem" :itemDetailOpen="itemDetailOpen" :showItemDetailDrawer="showItemDetailDrawer" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="관광지 정보">
          <TourList @itemClick="showTourDetailDrawer" />
        </a-tab-pane>
      </a-tabs>
    </a-drawer>
  </div>
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

/* 두 drawer가 나란히 배치되도록 스타일링 */
.drawer-container {
  display: flex;
}

.main-drawer {
  flex-shrink: 0;
  transition: width 0.3s ease;
}

.secondary-drawer {
  flex-shrink: 0;
  position: absolute;
  top: 0;
  right: 0;
  transition: transform 0.3s ease;
  transform: translateX(100%);
}

.secondary-drawer.open {
  transform: translateX(0);
}
</style>
