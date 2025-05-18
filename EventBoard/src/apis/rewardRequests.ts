import apiClient from '../libs/apiClient';

export const requestReward = async (eventId: string, token: string) => {
  try {
    const res = await apiClient.post(
      '/reward-requests',
      { eventId },
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ 헤더에 토큰 추가
        },
      }
    );
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: '보상 요청 실패' };
  }
};

export const getMyRewardRequests = async (token: string) => {
  const res = await apiClient.get('/reward-requests/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getAllRewardRequests = async (token: string) => {
  const res = await apiClient.get('/reward-requests', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
