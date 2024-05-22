<script setup>
import { computed } from 'vue';
import { useMemberStore } from '@/stores/member';

import Tab from "@/components/Tab.vue";
import UserView from "@/components/UserView.vue";
// import CreateView from "@/components/CreateView.vue";
import MapboxGlobe from "@/components/Map/MapboxGlobe.vue";
import ChatBotToggle from "@/components/Chatbot/ChatBotToggle.vue";

const memberStore = useMemberStore();

const isLogin = computed(() => memberStore.isLogin);
</script>

<template>
    <div>
        <UserView />
        <!-- 로그인 상태에 따라 Tab 컴포넌트 렌더링 -->
        <Tab v-if="isLogin" />
        <!-- <CreateView /> -->
        <MapboxGlobe />
        <ChatBotToggle />
    </div>
</template>

<style scoped></style>
