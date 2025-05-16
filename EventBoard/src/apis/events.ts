import apiClient from '../libs/apiClient';

export const fetchEvents = async (token: string) => {
  const res = await apiClient.get('/events', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createEvent = async (token: string, event: { title: string; description: string }) => {
  const res = await apiClient.post('/events', event, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteEvent = async (id: string, token: string) => {
  const res = await apiClient.delete(`/events/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};