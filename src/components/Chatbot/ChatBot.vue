<template>
  <div v-if="isVisible" class="chatbot-container">
    <div class="chatbot-header">
      <h2>관광지 추천 챗봇</h2>
      <button class="close-button" @click="closeChatBot">✖</button>
    </div>
    <div class="chatbot-body">
      <div class="messages">
        <div v-for="message in messages" :key="message.id" :class="['message', message.sender]">
          <div class="message-content">{{ message.text }}</div>
        </div>
      </div>
    </div>
    <div class="chatbot-footer">
      <input v-model="userInput" @keyup.enter="sendMessage" placeholder="메시지 입력..." />
      <button @click="sendMessage" class="send-button">Send</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getAIResponse } from '@/api/openai';

const userInput = ref('');
const messages = ref([]);
const isVisible = ref(true);

const sendMessage = async () => {
  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  addMessage('user', userMessage);

  try {
    const aiResponse = await getAIResponse(`관광지를 추천해줘: ${userMessage}`);
    addMessage('ai', aiResponse);
  } catch (error) {
    addMessage('ai', '죄송합니다, 오류가 발생했습니다.');
  }

  userInput.value = '';
};

const addMessage = (sender, text) => {
  messages.value.push({ id: Date.now(), sender, text });
};

const closeChatBot = () => {
  isVisible.value = false;
};
</script>

<style scoped>
.chatbot-container {
  position: fixed;
  bottom: 24px;
  left: 24px;
  width: 320px;
  max-height: 500px;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  background-color: #f8f9fa;
  overflow: hidden;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.chatbot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #343a40;
  color: white;
  border-bottom: 1px solid #e9ecef;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.chatbot-body {
  flex: 1;
  padding: 10px 15px;
  overflow-y: auto;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  display: flex;
}

.message.user {
  justify-content: flex-end;
}

.message.user .message-content {
  background-color: #007bff;
  color: white;
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
}

.message.ai .message-content {
  background-color: #e5e5ea;
  color: black;
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
  border-bottom-right-radius: 15px;
}

.message-content {
  max-width: 70%;
  padding: 10px 15px;
  word-wrap: break-word;
}

.chatbot-footer {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background-color: #e9ecef;
  border-top: 1px solid #dee2e6;
}

.chatbot-footer input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ced4da;
  border-radius: 20px;
  outline: none;
  margin-right: 10px;
  background-color: white;
}

.chatbot-footer input::placeholder {
  color: #6c757d;
}

.send-button {
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  background-color: #6c757d;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.send-button:hover {
  background-color: #6c757d;
}
</style>
