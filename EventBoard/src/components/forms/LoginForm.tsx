import { useState } from 'react';

export default function LoginForm({ onSubmit }: { onSubmit: (username: string, password: string) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(username, password);
      }}
    >
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="아이디" />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="비밀번호" type="password" />
      <button type="submit">로그인</button>
    </form>
  );
}
