import { requestReward } from '@/apis/rewardRequests';

export const useRewardRequest = (token: string) => {
  const sendRequest = (eventId: string) => {
    return requestReward(eventId, token);
  };

  return { sendRequest };
};
