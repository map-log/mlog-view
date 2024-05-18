<template>
  <div>
    <a-float-button type="default" :style="{ bottom: '24px', left: '24px' }" @click="toggleChatBot">
      <template #icon>
        <MessageOutlined />
      </template>
    </a-float-button>

    <transition name="fade">
      <ChatBot v-if="showChatBot" @close="toggleChatBot" />
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ChatBot from '@/components/Chatbot/ChatBot.vue';
import { MessageOutlined } from '@ant-design/icons-vue';

const showChatBot = ref(false);

const toggleChatBot = () => {
  showChatBot.value = !showChatBot.value;
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */
  {
  opacity: 0;
}
</style>
