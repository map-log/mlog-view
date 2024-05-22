<script setup>
import Tab from "@/components/Tab.vue";
import UserView from "@/components/UserView.vue";
// import CreateView from "@/components/CreateView.vue";
import MapboxGlobe from "@/components/Map/MapboxGlobe.vue";
import ChatBotToggle from "@/components/Chatbot/ChatBotToggle.vue";
</script>

<template>
    <div>
        <Tab />
        <UserView />
        <!-- <CreateView /> -->
        <MapboxGlobe />
        <ChatBotToggle />
    </div>
</template>

<style scoped></style>
