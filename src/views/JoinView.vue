<template>
  <img class="logo" width="250" src="@/assets/m-log-logo.png" @click="navigateToHome" />
  <div class="register-page">
    <div class="register-header">
      <h1>회원가입</h1>
    </div>
    <a-form :model="registerData" @finish="onRegister" class="register-form">
      <a-form-item label="아이디" name="id" rules="[ { required: true, message: '아이디를 입력해 주세요!' } ]">
        <a-input v-model:value="registerData.id" />
      </a-form-item>
      <a-form-item label="이름" name="name" rules="[ { required: true, message: '이름을 입력해 주세요!' } ]">
        <a-input v-model:value="registerData.name" />
      </a-form-item>
      <a-form-item label="이메일" name="email" rules="[ { required: true, type: 'email', message: '유효한 이메일을 입력해 주세요!' } ]">
        <a-input v-model:value="registerData.email" />
      </a-form-item>
      <a-form-item label="비밀번호" name="password" rules="[ { required: true, message: '비밀번호를 입력해 주세요!' } ]">
        <a-input type="password" v-model:value="registerData.password" />
      </a-form-item>
      <a-form-item label="비밀번호 확인" name="confirmPassword" :validate-status="confirmPasswordStatus"
        :help="confirmPasswordHelp" rules="[ { required: true, message: '비밀번호를 확인해 주세요!' } ]">
        <a-input type="password" v-model:value="registerData.confirmPassword" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" class="register-button">
          회원가입
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { useMemberStore } from '@/stores/member';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';

const memberStore = useMemberStore();
const router = useRouter();

const registerData = reactive({
  id: '',
  email: '',
  name: '',
  password: '',
  confirmPassword: ''
});

const confirmPasswordStatus = computed(() => {
  return registerData.confirmPassword && registerData.password !== registerData.confirmPassword ? 'error' : '';
});

const confirmPasswordHelp = computed(() => {
  return registerData.confirmPassword && registerData.password !== registerData.confirmPassword ? '비밀번호가 일치하지 않습니다!' : '';
});

const onRegister = async () => {
  try {
    if (registerData.password !== registerData.confirmPassword) {
      message.error('비밀번호가 일치하지 않습니다!');
      return;
    }

    await memberStore.registerUser(registerData);
    message.success('회원가입 성공!');
    router.push({ name: 'home' });
  } catch (error) {
    message.error('회원가입 실패: ' + error.message);
  }
};
const navigateToHome = () => {
  router.push({ name: 'home' });
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

.register-page {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ffffff;
}

.register-header {
  text-align: center;
  margin-bottom: 20px;
}

.register-form {
  display: flex;
  flex-direction: column;
}

.register-button {
  margin-top: 10px;
}
</style>
