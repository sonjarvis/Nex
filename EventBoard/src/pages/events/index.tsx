import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEvents } from '@/hooks/useEvents';
import { deleteEvent } from '@/apis/events';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function EventListPage() {
  const { token, user } = useAuth();
  const { getEvents } = useEvents(token || '');
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('LOGIN_3_DAYS');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchEvents = async () => {
      try {
        const res = await getEvents();
        setEvents(res || []);
      } catch (err: any) {
        setError(err.message || '불러오기 실패');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token]);

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`http://localhost:3000/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('삭제되었습니다.');
      setEvents(events.filter((ev) => ev._id !== id));
    } catch (err) {
      alert('삭제 실패');
    }
  };

  const handleCreate = async () => {
    if (!title || !description) return alert('제목과 내용을 입력하세요');
    try {
      const res = await axios.post(
        'http://localhost:3000/events',
        {
          title,
          description,
          condition,
          startDate,
          endDate,
          isActive,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEvents([...events, res.data]);
      setTitle('');
      setDescription('');
      setCondition('');
      setStartDate('');
      setEndDate('');
      setIsActive(true);
      setShowForm(false);
      alert('이벤트 등록 성공');
    } catch (err: any) {
      alert(err.response?.data?.message || '등록 실패');
    }
  };

  if (loading) return <p>불러오는 중...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>이벤트 목록</h1>

      {(user?.role === 'ADMIN' || user?.role === 'OPERATOR') && (
        <div style={{ marginBottom: '1rem' }}>
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? '등록 취소' : '이벤트 등록'}
          </button>

          {showForm && (
            <div style={{ marginTop: '1rem' }}>
              <input
                type="text"
                placeholder="제목"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ display: 'block', marginBottom: '0.5rem' }}
              />
              <textarea
                placeholder="설명"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                style={{ display: 'block', marginBottom: '0.5rem' }}
              />
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                조건:
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  style={{ marginLeft: '0.5rem' }}
                >
                  <option value="LOGIN_3_DAYS">로그인 3일</option>
                  <option value="DAILY_QUEST">일일 퀘스트 완료</option>
                  <option value="WEEKLY_BOSS">주간 보스 완료</option>
                  <option value="FIRST_HARD_SUU">첫 하드 스우 클리어</option>
                </select>
              </label>
              <label>
                시작일:
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ marginLeft: '0.5rem', marginBottom: '0.5rem' }}
                />
              </label>
              <br />
              <label>
                종료일:
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ marginLeft: '0.5rem', marginBottom: '0.5rem' }}
                />
              </label>
              <br />
              <label>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  style={{ marginRight: '0.5rem' }}
                />
                활성 상태
              </label>
              <br />
              <button onClick={handleCreate}>등록</button>
            </div>
          )}
        </div>
      )}

      {events.length === 0 ? (
        <p>등록된 이벤트가 없습니다.</p>
      ) : (
        <ul>
          {events.map((ev: any) => (
            <li key={ev._id} style={{
              marginBottom: '1rem',
              opacity: ev.isActive ? 1 : 0.5,
              border: '1px solid #ccc',
              padding: '1rem',
              borderRadius: '8px'
            }}>
              <strong>{ev.title}</strong>
              <br />
              <small>{ev.description}</small>
              <br />
              <small>
                조건: {
                {
                  LOGIN_3_DAYS: '로그인 3일',
                  DAILY_QUEST: '일일 퀘스트 완료',
                  WEEKLY_BOSS: '주간 보스 완료',
                  FIRST_HARD_SUU: '첫 하드 스우 클리어'
                }[ev.condition] || '-'
              }
              </small>
              <br />
              <small>기간: {ev.startDate?.slice(0,10)} ~ {ev.endDate?.slice(0,10)}</small>
              <br />
              <small>상태: {ev.isActive ? '활성' : '비활성'}</small>
              <br />
              <small>작성자: {ev.createdBy}</small>

              {(user?.role === 'ADMIN' || user?.role === 'OPERATOR') && (
                <div style={{ marginTop: '0.5rem' }}>
                  <button onClick={() => router.push(`/rewards/${ev._id}`)}>
                    🎁 보상 관리
                  </button>
                  <button onClick={() => handleDelete(ev._id)}>삭제</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
