<template>
  <div>
    <img class="logo" width="250" src="@/assets/m-log-logo.png" />
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
        <div class="login-form-link">
          Or
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

const navigateToJoin = () => {
  router.push({ name: 'join' });
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

.login-form-forgot {
  float: right;
}

.login-form-button {
  width: 100%;
}

.login-form-link {
  display: block;
  text-align: center;
  margin-top: 20px;
}
</style>
