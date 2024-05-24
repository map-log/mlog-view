<template>
  <img class="logo" width="250" src="@/assets/m-log-logo.png" @click="navigateToHome" />
  <div class="password-reset-form">
    <h2>Password Reset</h2>
    <a-form :model="formState" @finishFailed="onFinishFailed">
      <a-form-item label="Email" name="email"
        :rules="[{ required: true, type: 'email', message: 'Please input a valid email!' }]">
        <a-input v-model:value="formState.email">
          <template #prefix>
            <MailOutlined class="site-form-item-icon" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" class="password-reset-form-button" :loading="loading"
          @click="onFinish">
          Send Reset Email
        </a-button>
      </a-form-item>

      <a-form-item>
        <a-button type="default" html-type="button" class="home-button" @click="navigateToHome">
          Go to Home
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { MailOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMemberStore } from '@/stores/member';
import { message } from 'ant-design-vue';

const router = useRouter();
const memberStore = useMemberStore();

const formState = ref({
  email: '',
});

const loading = ref(false);

const onFinish = async () => {
  loading.value = true;
  try {
    await memberStore.findUserPassword(formState.value.email);
    message.success('Password reset email sent successfully.', 1);
    router.push({ name: 'home' });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    message.error('An error occurred while sending the password reset email.', 1);
    loading.value = false;
  }
};

const navigateToHome = () => {
  router.push({ name: 'home' });
};

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
  message.error('Please input a valid email.', 1);
};
</script>

<style scoped>
.password-reset-form {
  max-width: 400px;
  margin: 60px auto 0;
  padding: 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background: #ffffff;
  border-radius: 8px;
}

.password-reset-form-button {
  width: 100%;
}

.home-button {
  width: 100%;
}

.logo {
  display: block;
  margin: 0 auto;
  padding-top: 20px;
}
</style>
