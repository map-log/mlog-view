<template>
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
      <!-- <a-form-item name="remember" no-style>
        <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
      </a-form-item> -->
      <a class="login-form-forgot" href="">Forgot password</a>
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
</template>

<script setup>
import { storeToRefs } from "pinia"
import { useRouter } from "vue-router"
import { useMemberStore } from "@/stores/member"
import { ref, computed } from 'vue';

const router = useRouter()

const memberStore = useMemberStore()

const { isLogin, isLoginError } = storeToRefs(memberStore)
const { userLogin, getUserInfo, getMeInfo } = memberStore

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
  await userLogin(formState.value)
  let token = sessionStorage.getItem("accessToken")
  console.log(token)
  console.log("isLogin: " + isLogin.value)
  if (isLogin.value) {
    getMeInfo()
    getUserInfo()
    router.replace("/")
  }
}

</script>

<style scoped>
.logo {
  display: block;
  /* 이미지를 블록 요소로 변경 */
  margin: 0 auto;
  /* 상하 마진 0, 좌우 마진 자동 조절 */
  padding-top: 20px;
  /* 상단 여백 추가 */
}

.login-form {
  max-width: 400px;
  margin: 60px auto 0;
  /* 상단에 50px 여백을 주고 자동 마진으로 중앙 정렬 */
  padding: 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  /* 폼에 그림자 효과 추가 */
  background: #ffffff;
  /* 배경색 설정 */
  border-radius: 8px;
  /* 테두리 둥글게 처리 */
}

.login-form-forgot {
  float: right;
}

.login-form-button {
  width: 100%;
}

/* 추가된 스타일 */
.login-form-link {
  display: block;
  /* 블록 레벨 요소로 만들기 */
  text-align: center;
  /* 텍스트 가운데 정렬 */
  margin-top: 20px;
  /* 상단 여백 추가 */
}
</style>