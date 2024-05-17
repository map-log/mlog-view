import { localAxios, travalAxios } from "@/util/http-commons";

const local = localAxios();
const travel = travalAxios();

async function saveTravelLog(userid, param, success, fail) {
  travel.defaults.headers["X-MLOG-AUTH"] = `Bearer ${sessionStorage.getItem("accessToken")}`;
  await local.post(`/travel/${userid}`, param).then(success).catch(fail);
}

export { saveTravelLog };
