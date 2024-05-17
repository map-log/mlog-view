<template>
  <div class="my-page">
    <div class="profile-header">
      <img src="@/assets/m-log-logo.png" alt="profile image" class="profile-image" />
      <h1>{{ userProfile.name }}</h1>
      <p>{{ userProfile.email }}</p>
    </div>
    <a-form :model="userProfile" @finish="onModifyProfile" class="profile-form">
      <a-form-item label="Id" name="id">
        <a-input v-model:value="userProfile.id" disabled />
      </a-form-item>
      <a-form-item label="Name" name="name">
        <a-input v-model:value="userProfile.name" />
      </a-form-item>
      <a-form-item label="Email" name="email">
        <a-input v-model:value="userProfile.email" />
      </a-form-item>
      <a-form-item label="Password" name="password">
        <a-input type="password" v-model:value="userProfile.password" />
      </a-form-item>
      <a-form-item label="Confirm Password" name="confirmPassword">
        <a-input type="password" v-model:value="confirmPassword" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" class="update-button">
          Modify Profile
        </a-button>
      </a-form-item>
    </a-form>
    <a-button type="default" @click="goHome" class="home-button">
      Home
    </a-button>
    <a-button type="danger" @click="onDeleteAccount" class="delete-button">
      Delete Account
    </a-button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useMemberStore } from '@/stores/member';
import { message } from 'ant-design-vue';

const router = useRouter();
const memberStore = useMemberStore();
const { userInfo } = storeToRefs(memberStore);

const userProfile = ref({
  image: '@/assets/profile.jpg',
  id: userInfo.value.id,
  name: userInfo.value.name,
  email: userInfo.value.email,
  password: ''
});

const confirmPassword = ref('');

const onModifyProfile = async () => {
  if (userProfile.value.password !== confirmPassword.value) {
    message.error('비밀번호가 일치하지 않습니다.');
    return;
  }

  try {
    await memberStore.modifyUserProfile(userProfile.value, userProfile.value.id);
    message.success('프로필 수정 성공!');
    console.log(userProfile.value)
    router.replace('/');
  } catch (error) {
    message.error('프로필 수정 실패: ' + error.message);
  }
};

const goHome = () => {
  router.replace('/');
};

const onDeleteAccount = async () => {
  try {
    await memberStore.deleteAccount(userInfo.value.id);
    message.success('회원 탈퇴 성공!');
    router.replace('/'); // 탈퇴 후 홈으로 이동
  } catch (error) {
    message.error('회원 탈퇴 실패: ' + error.message);
  }
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

.delete-button {
  display: block;
  margin: 10px auto 0;
  width: 100%;
  background-color: #ff4d4f;
  color: #fff;
}
</style>
