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

  const rewardTypes = ['솔 에르다 조각', '이벤트 코인', '메이플 포인트'];

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
  const isRewardRegistered = rewards && rewards.length > 0;

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

      {isAdminOrOperator && !isRewardRegistered && (
        <>
          <h2>보상 등록</h2>
          <form onSubmit={handleSubmit}>
            <label>
              보상 종류:
              <select
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              >
                <option value="">선택하세요</option>
                {rewardTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </label>
            <br />
            <input
              type="text"
              placeholder="보상 설명"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <label>
              수량:
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
              />
            </label>
            <button type="submit">보상 등록</button>
          </form>
        </>
      )}
      <button onClick={() => router.push('/events')}>⬅ 돌아가기</button>
    </div>
  );
}
