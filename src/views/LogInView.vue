<template>
  <div>
    <img class="logo" width="250" src="@/assets/m-log-logo.png" @click="navigateToHome" />
    <a-form :model="formState" name="normal_login" class="login-form" @finish="onFinish" @finishFailed="onFinishFailed">
      <a-form-item label="Email" name="principal" :rules="[{ required: true, message: 'Please input your email!' }]">
        <a-input v-model:value="formState.principal">
          <template #prefix>
            <UserOutlined class="site-form-item-icon" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item label="Password" name="credentials"
        :rules="[{ required: true, message: 'Please input your password!' }]">
        <a-input-password v-model:value="formState.credentials">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item>
        <a-button :disabled="disabled" type="primary" html-type="submit" @click="login" class="login-form-button">
          Log in
        </a-button>
        <div class="login-form-links">
          <a @click="navigateToForgotPassword">Forgot password?</a>
          <span> Or </span>
          <a @click="navigateToJoin">register now!</a>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useMemberStore } from '@/stores/member';
import { ref, computed } from 'vue';

const router = useRouter();
const memberStore = useMemberStore();
const { userLogin, getUserInfo, getMeInfo } = memberStore;

const formState = ref({
  principal: '',
  credentials: '',
});

const onFinish = values => {
  console.log('Success:', values);
};

const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};

const disabled = computed(() => {
  return !(formState.value.principal && formState.value.credentials);
});

const login = async () => {
  await userLogin(formState.value);
  let token = sessionStorage.getItem('accessToken');
  console.log(token);
  console.log('isLogin: ' + memberStore.isLogin);
  if (memberStore.isLogin) {
    getMeInfo();
    getUserInfo();
    router.replace('/');
  }
};

const navigateToHome = () => {
  router.push({ name: 'home' });
};

const navigateToJoin = () => {
  router.push({ name: 'join' });
};

const navigateToForgotPassword = () => {
  router.push({ name: 'forgotPassword' });
};

</script>

<style scoped>
.logo {
  display: block;
  margin: 0 auto;
  padding-top: 20px;
}

.login-form {
  max-width: 400px;
  margin: 60px auto 0;
  padding: 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background: #ffffff;
  border-radius: 8px;
}

.login-form-links {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.login-form-links a {
  margin: 0 5px;
}

.login-form-button {
  width: 100%;
}
</style>
