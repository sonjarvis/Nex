import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { useEvents } from '../../hooks/useEvents';
import EventForm from '../../components/forms/EventForm';

export default function CreateEventPage() {
  const { token } = useAuth();
  const { addEvent } = useEvents(token || '');
  const [conditionType, setConditionType] = useState('LOGIN');
  const [conditionCount, setConditionCount] = useState(1);
  const router = useRouter();

  const handleSubmit = async (title: string, desc: string) => {
    try {
      await addEvent(title, desc);
      alert('등록 성공!');
      router.push('/events');
    } catch (err: any) {
      alert('등록 실패: ' + err.message);
    }
  };

  return (
    <div>
      <h1>이벤트 등록</h1>
      <EventForm onSubmit={handleSubmit} />
    </div>
  );
}
