<script setup>
import { UserOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { useMemberStore } from '@/stores/member';
import { storeToRefs } from 'pinia';

const router = useRouter();
const memberStore = useMemberStore();
const { isLogin } = storeToRefs(memberStore);

const navigateToLogin = () => {
  router.push({ name: 'login' });
};

const navigateToUserInfo = () => {
  router.push({ name: 'userInfo' });
};

const logout = async () => {
  await memberStore.userLogout();
  router.replace('/');
};
</script>

<template>
  <div>
    <a-float-button-group trigger="click" type="default" :style="{ top: '24px', right: '24px' }">
      <template #icon>
        <UserOutlined />
      </template>
      <template v-if="!isLogin">
        <a-float-button @click="navigateToLogin">
          <template #icon>
            <LoginOutlined />
          </template>
        </a-float-button>
      </template>
      <template v-else>
        <a-float-button @click="navigateToUserInfo">
          <template #icon>
            <UserOutlined />
          </template>
        </a-float-button>
        <a-float-button @click="logout">
          <template #icon>
            <LogoutOutlined />
          </template>
        </a-float-button>
      </template>
    </a-float-button-group>
  </div>
</template>

<style scoped></style>
