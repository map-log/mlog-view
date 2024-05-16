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
      <a-form-item>
        <a-button type="primary" html-type="submit" class="update-button">
          Update Profile
        </a-button>
      </a-form-item>
    </a-form>
    <a-button type="default" @click="goHome" class="home-button">
      Home
    </a-button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { storeToRefs } from "pinia"
import { useRouter } from "vue-router"
import { useMemberStore } from "@/stores/member"

const router = useRouter();
const memberStore = useMemberStore();
const { userInfo } = storeToRefs(memberStore);

// 사용자 정보 예제 데이터
const userProfile = ref({
  image: '@/assets/profile.jpg', // 프로필 사진 경로
  name: userInfo.value.name,
  email: userInfo.value.email,
});

const onUpdateProfile = () => {
  console.log('Profile Updated:', userProfile);
  router.replace("/")
};

const goHome = () => {
  router.replace("/");
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

.home-button {
  display: block;
  margin: 20px auto 0;
  width: 100%;
}
</style>
