import { ref } from "vue";
import { useRouter } from "vue-router";
import { defineStore, storeToRefs } from "pinia";

import { saveTravelLog } from "@/api/travel";
import { httpStatusCode } from "@/util/http-status";

import { useMemberStore } from "@/stores/member";

export const useTravelStore = defineStore("travelStore", () => {
  const router = useRouter();

  const memberStore = useMemberStore();
  const { userInfo } = storeToRefs(memberStore);

  const createTravelLog = async (travelData) => {
    console.log(userInfo.value.id);
    await saveTravelLog(
      userInfo.value.id,
      travelData,
      (response) => {
        if (response.status === httpStatusCode.OK) {
          console.log("여행 기록 저장 성공");
        } else {
          console.log("여행 기록 저장 실패");
        }
      },
      (error) => {
        console.error(error);
      }
    );
  };

  return {
    createTravelLog,
  };
});
