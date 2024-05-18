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

export { saveTravelLog, checkMe };
