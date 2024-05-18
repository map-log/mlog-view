import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { defineStore } from 'pinia';
import { saveTravelLog, checkMe } from '@/api/travel';
import { httpStatusCode } from '@/util/http-status';
import { useMemberStore } from '@/stores/member';

export const useTravelStore = defineStore('travelStore', () => {
  const router = useRouter();

  const memberStore = useMemberStore();
  const userInfo = ref(null);

  const createTravelLog = async (travelData) => {
    await saveTravelLog(
      travelData,
      (response) => {
        if (response.status === httpStatusCode.OK) {
          console.log('여행 기록 저장 성공');
        } else {
          console.log('여행 기록 저장 실패');
        }
      },
      (error) => {
        console.error('여행 기록 저장 중 오류 발생:', error);
      }
    );
  };

  const getMeInfo = async () => {
    await checkMe(
      (response) => {
        if (response.status === httpStatusCode.OK) {
          userInfo.value = response.data.response;
          console.log('유저 정보:', userInfo.value); // 유저 정보 확인 로그
        } else {
          console.log('유저 정보 없음!!!!');
        }
      },
      async (error) => {
        console.error(
          '토큰 만료되어 사용 불가능:',
          error.response.status,
          error.response.statusText
        );
        memberStore.isValidToken.value = false;
        await memberStore.tokenRegenerate();
      }
    );
  };

  return {
    createTravelLog,
    getMeInfo,
    userInfo,
  };
});
