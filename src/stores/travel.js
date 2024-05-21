import { ref } from "vue";
import { useRouter } from "vue-router";
import { defineStore, storeToRefs } from "pinia";
import { saveTravelLog, getTravelList, getTravelDetail, getPhotoDetail } from "@/api/travel";
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
          console.log("응답 데이터:", response.data);
          travelList.value = response.data.response.travelList ?? [];
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
      async (response) => {
        if (response.status === httpStatusCode.OK) {
          travelDetail.value = response.data;
          const detailedSchedules = travelDetail.value.response.detailedSchedules;

          // 각 세부 일정에 맞는 사진을 할당
          for (let i = 0; i < detailedSchedules.length; i++) {
            detailedSchedules[i].photos = await fetchPhotoDetail(detailedSchedules[i].id);
          }

          console.log("여행 상세 정보:", travelDetail.value);
        } else {
          console.log("여행 상세 정보 없음");
        }
      },
      (error) => {
        console.error("여행 상세 정보 가져오기 오류:", error);
      }
    );
    return travelDetail.value;
  };

  const fetchPhotoDetail = async (travelDetailId) => {
    console.log("Fetching photo detail for travelDetailId:", travelDetailId);
    const photoList = [];
    await getPhotoDetail(
      travelDetailId,
      (response) => {
        if (response.status === httpStatusCode.OK) {
          console.log(response);
          photoList.push(...response.data.response.travelPhotoList);
          console.log("사진 상세 정보:", photoList);
        } else {
          console.log("사진 상세 정보 없음");
        }
      },
      (error) => {
        console.error("사진 상세 정보 가져오기 오류:", error);
      }
    );
    return photoList;
  };

  return {
    createTravelLog,
    fetchTravelList,
    fetchTravelDetail,
    fetchPhotoDetail,
    travelList,
    travelDetail,
  };
});
