import { createReward, getRewards } from '@/apis/rewards';

export const useRewards = (token: string) => {
  const fetchRewards = (eventId: string) => getRewards(eventId, token);
  const registerReward = (
    eventId: string,
    name: string,
    description: string,
    quantity: number
  ) => createReward(eventId, { name, description, quantity }, token);

  return { fetchRewards, registerReward };
};
