import apiClient from '../libs/apiClient';

export const getRewards = (eventId: string, token: string) => {
  return apiClient.get(`/events/${eventId}/rewards`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createReward = (
  eventId: string,
  data: { name: string; description: string; quantity: number },
  token: string
) => {
  return apiClient.post(`/events/${eventId}/rewards`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
