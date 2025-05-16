import { fetchEvents, createEvent } from '../apis/events';
import apiClient from '@/libs/apiClient';

export const useEvents = (token: string) => {
  const getEvents = async () => {
    const res = await apiClient.get('/events', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  };

  const addEvent = async (title: string, description: string) => {
    return await createEvent(token, { title, description });
  };

  return { getEvents, addEvent };
};
