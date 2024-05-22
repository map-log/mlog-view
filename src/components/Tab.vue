<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { AlignCenterOutlined, DoubleLeftOutlined } from '@ant-design/icons-vue';
import TourList from '@/components/Tour/TourList.vue';
import TravelListItemInfo from '@/components/Travel/TravelListItemInfo.vue';
import TourListItemDetail from '@/components/Tour/TourListItemDetail.vue';
import TravelList from './Travel/TravelList.vue';
import TravelListDetailUpdate from '@/components/Travel/TravelListDetailUpdate.vue';
import { useMapStore } from '@/stores/map';
import { storeToRefs } from 'pinia';
import { useTravelStore } from '@/stores/travel';
import CreateView from '@/components/CreateView.vue';

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

const mapStore = useMapStore();
const store = useTravelStore();
const { travelList } = storeToRefs(store);

const itemDetailOpen = ref(false);
const selectedItem = ref(null);
const isUpdateFormOpen = ref(false);
const selectedTravelIdForUpdate = ref(null);

const showItemDetailDrawer = (item) => {
  selectedItem.value = item;
  itemDetailOpen.value = true;
};

const closeItemDetailDrawer = () => {
  itemDetailOpen.value = false;
  selectedItem.value = null;
};

const showUpdateForm = () => {
  isUpdateFormOpen.value = true;
};

const closeUpdateForm = () => {
  isUpdateFormOpen.value = false;
  selectedTravelIdForUpdate.value = null;
};

const handleOpenUpdateForm = (travelId) => {
  selectedTravelIdForUpdate.value = travelId;
  showUpdateForm();
};

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

const resetMarkers = () => {
  mapStore.reset();
};

const addTravelMarkers = () => {
  resetMarkers();
  const markers = travelList.value.map(travel => createMarker(travel.lat, travel.lng, travel.imageUrl));
  mapStore.markerList = markers;
};

const addTourMarkers = () => {
  resetMarkers();
};

const fetchTravelList = async () => {
  try {
    await store.fetchTravelList();
  } catch (error) {
    console.error('Error fetching travel list:', error);
  }
};

watch(activeKey, (newKey) => {
  if (newKey === '1') {
    addTravelMarkers();
  } else if (newKey === '2') {
    addTourMarkers();
  }
});

onMounted(() => {
  if (activeKey.value === '1') {
    addTravelMarkers();
  } else if (activeKey.value === '2') {
    addTourMarkers();
  }
});

const createMarker = (latitude, longitude, img) => {
  return {
    img: img,
    coordinates: [longitude, latitude],
  };
};

// 여행 기록 추가 후 목록 갱신을 위한 이벤트 핸들러
const handleUpdateList = async () => {
  await store.fetchTravelList();
  addTravelMarkers();
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
          <template #icon>
            <DoubleLeftOutlined />
          </template>
        </a-button>
      </template>
      <TravelListItemInfo :travelDetail="selectedItem" :travelId="selectedItem?.id" @updateList="fetchTravelList"
        @closeDetail="closeItemDetailDrawer" @openUpdateForm="handleOpenUpdateForm" />
    </a-drawer>

    <!-- 관광지 상세 정보 drawer 추가 -->
    <a-drawer title="관광지 상세 정보" :placement="'left'" :width="400" :open="tourDetailOpen" :mask="false" :closable="false"
      class="secondary-drawer">
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
          <TravelList :selectedItem="selectedItem" :itemDetailOpen="itemDetailOpen"
            :showItemDetailDrawer="showItemDetailDrawer" @updateList="fetchTravelList" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="관광지 정보">
          <TourList @itemClick="showTourDetailDrawer" />
        </a-tab-pane>
      </a-tabs>
    </a-drawer>
  </div>

  <!-- 수정 컴포넌트를 화면 오른쪽에 고정 -->
  <div v-if="isUpdateFormOpen" class="edit-form-container">
    <TravelListDetailUpdate :travelId="selectedTravelIdForUpdate" @updateList="handleUpdateList"
      @closeDrawer="closeUpdateForm" />
  </div>

  <!-- CreateView 컴포넌트를 추가하여 updateList 이벤트를 처리 -->
  <CreateView @updateList="handleUpdateList" />
</template>

<style>
.ant-drawer-body::-webkit-scrollbar {
  width: 5px;
}

.ant-drawer-body::-webkit-scrollbar-thumb {
  background: rgb(87, 87, 87);
  border-radius: 10px;
}

.ant-drawer-body::-webkit-scrollbar-track {
  background: rgb(255, 255, 255);
}

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

.edit-form-container {
  position: fixed;
  /* 전체 화면의 오른쪽에 고정 */
  right: 0;
  top: 0;
  bottom: 0;
  width: 400px;
  background: #ffffff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  z-index: 1000;
  /* 다른 요소들 위에 표시되도록 설정 */
}
</style>