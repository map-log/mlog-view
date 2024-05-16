<template>
  <div class="join-page">
    <div class="join-header">
      <img src="@/assets/m-log-logo.png" alt="join image" class="join-image" />
      <h1>Join Us</h1>
      <p>Register to become a member</p>
    </div>
    <a-form :model="registerData" @finish="onRegister" class="join-form">
      <a-form-item label="Name" name="name" rules="[ { required: true, message: 'Please input your name!' } ]">
        <a-input v-model:value="registerData.name" />
      </a-form-item>
      <a-form-item label="Email" name="email"
        rules="[ { required: true, type: 'email', message: 'Please input a valid email!' } ]">
        <a-input v-model:value="registerData.email" />
      </a-form-item>
      <a-form-item label="Phone" name="phone"
        rules="[ { required: true, message: 'Please input your phone number!' } ]">
        <a-input v-model:value="registerData.phone" />
      </a-form-item>
      <a-form-item label="Password" name="password"
        rules="[ { required: true, message: 'Please input your password!' } ]">
        <a-input type="password" v-model:value="registerData.password" />
      </a-form-item>
      <a-form-item label="Confirm Password" name="confirmPassword" dependencies="password"
        rules="[ { required: true, message: 'Please confirm your password!' }, { validator: checkConfirmPassword } ]">
        <a-input type="password" v-model:value="registerData.confirmPassword" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" class="register-button">
          Register
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

// 회원가입 데이터 예제
const registerData = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
});

const onRegister = () => {
  console.log('Registration Data:', registerData);
};

// 비밀번호 확인 검증기
const checkConfirmPassword = (rule, value) => {
  if (value !== registerData.password) {
    return Promise.reject('Passwords do not match!');
  }
  return Promise.resolve();
};
</script>

<style scoped>
.join-page {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ffffff;
}

.join-header {
  text-align: center;
  margin-bottom: 20px;
}

.join-image {
  width: auto;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
}

.join-form {
  display: flex;
  flex-direction: column;
}

.register-button {
  margin-top: 10px;
}
</style>
