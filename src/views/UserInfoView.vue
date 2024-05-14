<template>
  <div class="my-page">
    <div class="profile-header">
      <img src="@/assets/m-log-logo.png" alt="profile image" class="profile-image" />
      <h1>{{ userProfile.name }}</h1>
      <p>{{ userProfile.email }}</p>
    </div>
    <a-form :model="userProfile" @finish="onUpdateProfile" class="profile-form">
      <a-form-item label="Name" name="name">
        <a-input v-model:value="userProfile.name" />
      </a-form-item>
      <a-form-item label="Email" name="email">
        <a-input v-model:value="userProfile.email" />
      </a-form-item>
      <a-form-item label="Phone" name="phone">
        <a-input v-model:value="userProfile.phone" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" class="update-button">
          Update Profile
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

// 사용자 정보 예제 데이터
const userProfile = reactive({
  image: '@/assets/profile.jpg', // 프로필 사진 경로
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  phone: '123-456-7890' // 추가된 전화번호 필드
});

const onUpdateProfile = () => {
  console.log('Profile Updated:', userProfile);
};
</script>

<style scoped>
.my-page {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ffffff;
}

.profile-header {
  text-align: center;
  margin-bottom: 20px;
}

.profile-image {
  width: auto;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
}

.profile-form {
  display: flex;
  flex-direction: column;
}

.update-button {
  margin-top: 10px;
}
</style>