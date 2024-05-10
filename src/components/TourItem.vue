<script setup>
import { ref, computed } from 'vue';
import TravelDetail from '@/components/TravelDetail.vue'

const emit = defineEmits(['openDetail'])

const loading = ref(true);

const open = ref(false)

const openDetail = () => {
    emit('openDetail')
    open.value = !open.value
}

</script>
<template>
    <a-space :size="10">
        <a-card hoverable style=" width: 300" @click="openDetail">
            <template #cover>
                <img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />
            </template>
            <template #actions>
                <setting-outlined key="setting" />
                <edit-outlined key="edit" />
                <ellipsis-outlined key="ellipsis" />
            </template>
            <a-card-meta title="Card title" description="This is the description">
                <template #avatar>
                    <a-avatar src="https://joeschmoe.io/api/v1/random" />
                </template>
            </a-card-meta>
        </a-card>
        <TravelDetail v-if="open" />
    </a-space>
</template>
