import { localAxios } from "@/util/http-commons";

const local = localAxios();

async function userConfirm(param, success, fail) {
  await local.post(`/user/login`, param).then(success).catch(fail);
}

async function checkMe(success, fail) {
  local.defaults.headers["X-MLOG-AUTH"] = `Bearer ${sessionStorage.getItem("accessToken")}`;
  await local.get(`/user/me`).then(success).catch(fail);
}

async function findById(userid, success, fail) {
  local.defaults.headers["X-MLOG-AUTH"] = `Bearer ${sessionStorage.getItem("accessToken")}`;
  await local.get(`/user/${userid}`).then(success).catch(fail);
}

async function tokenRegeneration(user, success, fail) {
  local.defaults.headers["refreshToken"] = sessionStorage.getItem("refreshToken"); //axios header에 refresh-token 셋팅
  await local.post(`/user/refresh`, user).then(success).catch(fail);
}

async function logout(userid, success, fail) {
  await local.get(`/user/logout/${userid}`).then(success).catch(fail);
}

async function userRegister(param, success, fail) {
  await local.post(`/user/join`, param).then(success).catch(fail);
}

async function apiDeleteAccount(userid, success, fail) {
  await local.delete(`/user/${userid}`).then(success).catch(fail);
}

async function apiModifyUserProfile(param, userid, success, fail) {
  await local.put(`/user/${userid}`, param).then(success).catch(fail);
}

export {
  userConfirm,
  findById,
  checkMe,
  tokenRegeneration,
  logout,
  userRegister,
  apiDeleteAccount,
  apiModifyUserProfile,
};
