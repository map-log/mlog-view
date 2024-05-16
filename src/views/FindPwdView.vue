<template>
  <div class="findpwd-page">
    <div class="findpwd-header">
      <img src="@/assets/m-log-logo.png" alt="find password image" class="findpwd-image" />
      <h1>Find Password</h1>
      <p>Enter your email to reset your password</p>
    </div>
    <a-form :model="findPwdData" @finish="onFindPwd" class="findpwd-form">
      <a-form-item label="Email" name="email"
        rules="[ { required: true, type: 'email', message: 'Please input a valid email!' } ]">
        <a-input v-model:value="findPwdData.email" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" class="reset-button">
          Find Password
        </a-button>
      </a-form-item>
    </a-form>
    <!-- 결과 메시지 표시 -->
    <div v-if="message" :class="`message ${messageType}`">{{ message }}</div>
    <!-- 메인 페이지로 이동하는 버튼 -->
    <a-button type="default" class="home-button" @click="goHome">
      Go to Home
    </a-button>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

// 가상의 사용자 데이터베이스
const userDatabase = {
  'jane.doe@example.com': 'password123',
  'john.doe@example.com': 'mypassword'
};

// 비밀번호 찾기 데이터 예제
const findPwdData = reactive({
  email: ''
});

// 메시지 상태
const message = ref('');
const messageType = ref(''); // 'success' 또는 'error'로 설정

// 라우터 사용 설정
const router = useRouter();

const onFindPwd = () => {
  if (findPwdData.email in userDatabase) {
    // 성공 시 메시지 설정
    message.value = `Password for ${findPwdData.email}: ${userDatabase[findPwdData.email]}`;
    messageType.value = 'success';
  } else {
    // 오류 시 메시지 설정
    message.value = 'Email not found. Please try again.';
    messageType.value = 'error';
  }
};

const goHome = () => {
  router.push({ name: 'home' });
};
</script>

<style scoped>
.findpwd-page {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ffffff;
}

.findpwd-header {
  text-align: center;
  margin-bottom: 20px;
}

.findpwd-image {
  width: auto;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
}

.findpwd-form {
  display: flex;
  flex-direction: column;
}

.reset-button {
  margin-top: 10px;
}

.home-button {
  display: block;
  margin: 20px auto;
  background-color: #1890ff;
  color: white;
}

/* 메시지 스타일 */
.message {
  margin: 20px auto;
  padding: 10px;
  text-align: center;
  border-radius: 5px;
  max-width: 600px;
}

.message.success {
  background-color: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.message.error {
  background-color: #fff1f0;
  color: #ff4d4f;
  border: 1px solid #ffa39e;
}
</style>
