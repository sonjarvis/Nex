import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { router } from 'next/client';

export default function MyRewardRequests() {
  const { token } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    const fetch = async () => {
      try {
        const res = await axios.get('http://localhost:3000/reward-requests/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || '불러오기 실패');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [token]);

  if (loading) return <p>불러오는 중...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>📄 내 보상 요청 이력</h2>
      {requests.length === 0 ? (
        <p>요청한 내역이 없습니다.</p>
      ) : (
        <ul>
          {requests.map((req) => (
            <li key={req._id} style={{ marginBottom: '1rem' }}>
              <strong>이벤트:</strong> {req.eventTitle || '-'} <br />
              <strong>요청 시간:</strong> {new Date(req.createdAt).toLocaleString()} <br />
              <strong>상태:</strong> {req.status} <br />
              {req.reason && <strong>사유:</strong>} {req.reason}
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => router.push('/events')}>⬅ 돌아가기</button>
    </div>
  );
}