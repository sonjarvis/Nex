import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getAllRewardRequests } from '@/apis/rewardRequests';
import { useRouter } from 'next/router';

function formatDate(dateString: string): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}`;
}

export default function RewardRequestHistoryPage() {
  const { token, user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!token) return;

    getAllRewardRequests(token)
      .then((data) => setRequests(data))
      .catch((err) =>
        setError(err?.response?.data?.message || err.message || '조회 실패')
      )
      .finally(() => setLoading(false));
  }, [token]);

  if (!user || !['ADMIN', 'OPERATOR', 'AUDITOR'].includes(user.role)) {
    return <p style={{ color: 'red' }}>권한이 없습니다.</p>;
  }

  if (loading) return <p>조회 중...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>전체 보상 요청 이력</h2>
      {requests.length === 0 ? (
        <p>요청 내역이 없습니다.</p>
      ) : (
        <ul>
          {requests.map((req: any) => (
            <li key={req._id}>
              유저: {req.username || '알 수 없음'} / 이벤트: {req.eventTitle || '삭제된 이벤트'} / 상태: {req.status}
              {req.reason && ` / 사유: ${req.reason}`}
              {req.reward && ` / 보상: ${req.reward.type} (수량: ${req.reward.amount})`}
              / 요청 일시: {formatDate(req.createdAt)}
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => router.push('/events')}>⬅ 돌아가기</button>
    </div>
  );
}
