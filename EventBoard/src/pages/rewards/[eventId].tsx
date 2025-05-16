import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useRewards } from '@/hooks/useRewards';
import { useAuth } from '@/hooks/useAuth';
import apiClient from '@/libs/apiClient';

export default function RewardPage() {
  const router = useRouter();
  const { eventId } = router.query as { eventId: string };
  const { token, user } = useAuth();
  const { fetchRewards, registerReward } = useRewards(token || '');

  const [eventInfo, setEventInfo] = useState<any>(null);
  const [rewards, setRewards] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (eventId && token) {
      fetchRewards(eventId)
        .then((res) => setRewards(res.data))
        .catch(console.error);

      apiClient.get(`/events`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        const target = res.data.find((ev: any) => ev._id === eventId);
        setEventInfo(target);
      });
    }
  }, [eventId, token]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await registerReward(eventId, name, description, quantity);
      alert('보상 등록 완료');
      setName('');
      setDescription('');
      setQuantity(1);
      const updated = await fetchRewards(eventId);
      setRewards(updated.data);
    } catch (err: any) {
      alert('등록 실패: ' + err.response?.data?.message || err.message);
    }
  };

  const isAdminOrOperator = ['ADMIN', 'OPERATOR'].includes(user?.role);

  return (
    <div>
      <h1>
        이벤트: {eventInfo?.title || '(제목 없음)'}
      </h1>
      <h1>보상 목록</h1>
      {!rewards || rewards.length === 0 ? (
        <p>등록된 보상이 없습니다.</p>
      ) : (
        <ul>
          {rewards.map((r) => (
            <li key={r._id}>
              <strong>{r.name}</strong> - {r.description} ({r.quantity})
            </li>
          ))}
        </ul>
      )}

      {isAdminOrOperator && (
        <>
          <h2>보상 등록</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="보상 이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="보상 설명"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="수량"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
            <button type="submit">보상 등록</button>
          </form>
        </>
      )}
    </div>
  );
}
