<script setup>
import { ref } from 'vue';

const items = ref([
    { id: 1, title: '소제목1', content: '내용.......', images: ['https://aliyuncdn.antdv.com/vue.png', 'https://aliyuncdn.antdv.com/logo.png'], rating: 2.5 },
    // 다른 항목들 추가
]);

const emit = defineEmits(['itemClick']);
const handleClick = item => {
    emit('itemClick', item);
};
</script>

<template>
    <a-timeline>
        <div v-for="item in items" :key="item.id" @click="handleClick(item)" class="timeline-item-block">
            <a-timeline-item color="black">
                <h3>{{ item.title }}</h3>
                <a-image-preview-group>
                    <a-image v-for="img in item.images" :key="img" :width="100" :src="img" />
                </a-image-preview-group>
                <br>
                <a-rate :value="item.rating" allow-half />
                <p>{{ item.content }}</p>
            </a-timeline-item>
        </div>
    </a-timeline>
</template>

<style scoped>
.timeline-item-block {
    cursor: pointer;
}
</style>
