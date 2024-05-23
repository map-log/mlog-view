import { ref } from "vue";
import { useRouter } from "vue-router";
import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode";

import {
  userConfirm,
  findById,
  checkMe,
  tokenRegeneration,
  logout,
  userRegister,
  apiDeleteAccount,
  apiModifyUserProfile,
  passwordResetRequest,
} from "@/api/user";
import { httpStatusCode } from "@/util/http-status";

export const useMemberStore = defineStore("memberStore", () => {
  const router = useRouter();

  const isLogin = ref(false);
  const isLoginError = ref(false);
  const userInfo = ref(null);
  const isValidToken = ref(false);

  const registerUser = async (registerData) => {
    await userRegister(
      registerData,
      (response) => {
        if (response.status === httpStatusCode.CREATED) {
          console.log("회원가입 성공!!!!");
          router.push({ name: "user-login" });
        }
      },
      (error) => {
        console.log("회원가입 실패!!!!");
        console.error(error);
      }
    );
  };

  const userLogin = async (loginUser) => {
    await userConfirm(
      loginUser,
      (response) => {
        if (response.status === httpStatusCode.OK) {
          console.log("로그인 성공!!!!");
          let { data } = response;
          console.log(data);
          let accessToken = data.response["token"];
          isLogin.value = true;
          isLoginError.value = false;
          isValidToken.value = true;
          sessionStorage.setItem("accessToken", accessToken);
          // sessionStorage.setItem("refreshToken", refreshToken);
        }
      },
      (error) => {
        console.log("로그인 실패!!!!");
        isLogin.value = false;
        isLoginError.value = true;
        isValidToken.value = false;
        console.error(error);
      }
    );
  };

  const getMeInfo = async () => {
    await checkMe(
      (response) => {
        if (response.status === httpStatusCode.OK) {
          userInfo.value = response.data.response;
        } else {
          console.log("유저 정보 없음!!!!");
        }
      },
      async (error) => {
        console.error(
          "g[토큰 만료되어 사용 불가능.] : ",
          error.response.status,
          error.response.statusText
        );
        isValidToken.value = false;

        await tokenRegenerate();
      }
    );
  };

  const getUserInfo = async () => {
    await findById(
      userInfo.value.id,
      (response) => {
        if (response.status === httpStatusCode.OK) {
          console.log("유정 정보 있음");
        } else {
          console.log("유저 정보 없음!!!!");
        }
      },
      async (error) => {
        console.error(
          "g[토큰 만료되어 사용 불가능.] : ",
          error.response.status,
          error.response.statusText
        );
        isValidToken.value = false;

        await tokenRegenerate();
      }
    );
  };

  const tokenRegenerate = async () => {
    await tokenRegeneration(
      JSON.stringify(userInfo.value),
      (response) => {
        if (response.status === httpStatusCode.CREATE) {
          let accessToken = response.data["access-token"];
          sessionStorage.setItem("accessToken", accessToken);
          isValidToken.value = true;
        }
      },
      async (error) => {
        // HttpStatus.UNAUTHORIZE(401) : RefreshToken 기간 만료 >> 다시 로그인!!!!
        if (error.response.status === httpStatusCode.UNAUTHORIZED) {
          // 다시 로그인 전 DB에 저장된 RefreshToken 제거.
          await logout(
            userInfo.value.userid,
            (response) => {
              if (response.status === httpStatusCode.OK) {
                console.log("리프레시 토큰 제거 성공");
              } else {
                console.log("리프레시 토큰 제거 실패");
              }
              alert("RefreshToken 기간 만료!!! 다시 로그인해 주세요.");
              isLogin.value = false;
              userInfo.value = null;
              isValidToken.value = false;
              router.push({ name: "user-login" });
            },
            (error) => {
              console.error(error);
              isLogin.value = false;
              userInfo.value = null;
            }
          );
        }
      }
    );
  };

  const userLogout = async () => {
    console.log("로그아웃 아이디 : " + userInfo.value.id);
    isLogin.value = false;
    userInfo.value = null;
    isValidToken.value = false;

    sessionStorage.removeItem("accessToken");
  };

  const deleteAccount = async (userid) => {
    await apiDeleteAccount(
      userid,
      (response) => {
        if (response.status === httpStatusCode.OK) {
          console.log("회원 탈퇴 성공!!!!");
          isLogin.value = false;
          userInfo.value = null;
          isValidToken.value = false;
          sessionStorage.removeItem("accessToken");
        }
      },
      (error) => {
        console.log("회원 탈퇴 실패!!!!");
        console.error(error);
      }
    );
  };

  const modifyUserProfile = async (profileData, userid) => {
    await apiModifyUserProfile(
      profileData,
      userid,
      (response) => {
        if (response.status === httpStatusCode.OK) {
          console.log("프로필 수정 성공!!!!:");
          userInfo.value.id = profileData.id;
          userInfo.value.name = profileData.name;
          userInfo.value.email = profileData.email;
          userInfo.value.password = profileData.password;
        }
        ``;
      },
      (error) => {
        console.log("프로필 수정 실패!!!!");
        console.error(error);
      }
    );
  };

  const findUserPassword = async (userEmail) => {
    await passwordResetRequest(
      userEmail,
      (response) => {
        if (response.status === httpStatusCode.OK) {
          console.log("비밀 번호 재설정 전송 완료!!!!:");
        }
      },
      (error) => {
        console.log("비밀 번호 재설정 전송 실패!!!!:");
        console.error(error);
      }
    );
  };

  return {
    isLogin,
    isLoginError,
    userInfo,
    isValidToken,
    deleteAccount,
    modifyUserProfile,
    registerUser,
    userLogin,
    getUserInfo,
    tokenRegenerate,
    userLogout,
    getMeInfo,
    findUserPassword,
  };
});
