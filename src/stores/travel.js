import { ref } from "vue";
import { useRouter } from "vue-router";
import { defineStore, storeToRefs } from "pinia";
import { saveTravelLog, getTravelList, getTravelDetail } from "@/api/travel";
import { httpStatusCode } from "@/util/http-status";
import { useMemberStore } from "@/stores/member";

export const useTravelStore = defineStore("travelStore", () => {
  const router = useRouter();

  const memberStore = useMemberStore();
  const { userInfo } = storeToRefs(memberStore);

  const travelList = ref([]);
  const travelDetail = ref(null);

  const createTravelLog = async (travelData) => {
    await saveTravelLog(
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

  const fetchTravelList = async () => {
    await getTravelList(
      (response) => {
        if (response.status === httpStatusCode.OK) {
          // 응답 데이터 구조에 맞게 travels 리스트 접근
          console.log("응답 데이터:", response.data);
          travelList.value = response.data.response.travelList ?? []; // 수정된 경로
          console.log("여행 리스트:", travelList.value);
        } else {
          console.log("여행 리스트 없음");
        }
      },
      (error) => {
        console.error("여행 리스트 가져오기 오류:", error);
      }
    );
  };

  const fetchTravelDetail = async (travelId) => {
    await getTravelDetail(
      travelId,
      (response) => {
        if (response.status === httpStatusCode.OK) {
          travelDetail.value = response.data;
          console.log("여행 상세 정보:", travelDetail.value);
        } else {
          console.log("여행 상세 정보 없음");
        }
      },
      (error) => {
        console.error("여행 상세 정보 가져오기 오류:", error);
      }
    );
  };

  return {
    createTravelLog,
    fetchTravelList,
    fetchTravelDetail,
    travelList,
    travelDetail,
  };
});
