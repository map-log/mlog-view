import { localAxios } from "@/util/http-commons";

const local = localAxios();

async function saveTravelLog(param, success, fail) {
  console.log("나와라: " + sessionStorage.getItem("accessToken"));
  local.defaults.headers["X-MLOG-AUTH"] = `Bearer ${sessionStorage.getItem("accessToken")}`;
  await local.post(`/travel`, param).then(success).catch(fail);
}

async function checkMe(success, fail) {
  local.defaults.headers["X-MLOG-AUTH"] = `Bearer ${sessionStorage.getItem("accessToken")}`;
  await local.get(`/travel`).then(success).catch(fail);
}

async function getTravelList(success, fail) {
  local.defaults.headers["X-MLOG-AUTH"] = `Bearer ${sessionStorage.getItem("accessToken")}`;
  await local
    .get(`/travel`)
    .then((response) => {
      console.log("API 응답:", response); // 응답 구조 확인
      success(response);
    })
    .catch(fail);
}

async function getTravelDetail(travelId, success, fail) {
  local.defaults.headers["X-MLOG-AUTH"] = `Bearer ${sessionStorage.getItem("accessToken")}`;
  await local.get(`/travel/${travelId}`).then(success).catch(fail);
}

async function getPhotoDetail(travelDetailId, success, fail) {
  local.defaults.headers["X-MLOG-AUTH"] = `Bearer ${sessionStorage.getItem("accessToken")}`;
  await local.get(`/travel/photos/${travelDetailId}`).then(success).catch(fail);
}

async function deleteTravelDetail(travelId, success, fail) {
  local.defaults.headers["X-MLOG-AUTH"] = `Bearer ${sessionStorage.getItem("accessToken")}`;
  await local.delete(`/travel/${travelId}`).then(success).catch(fail);
}

async function updateTravelDetail(travelId, param, success, fail) {
  console.log("API 호출: deleteTravelDetail, updateTravelDetail:", travelId); // API 호출 확인
  local.defaults.headers["X-MLOG-AUTH"] = `Bearer ${sessionStorage.getItem("accessToken")}`;
  await local.put(`/travel/${travelId}`, param).then(success).catch(fail);
}

export {
  saveTravelLog,
  checkMe,
  getTravelList,
  getTravelDetail,
  getPhotoDetail,
  deleteTravelDetail,
  updateTravelDetail,
};
