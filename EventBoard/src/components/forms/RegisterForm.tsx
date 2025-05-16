import { useState } from 'react';

export default function RegisterForm({ onSubmit }: { onSubmit: (username: string, password: string, role: string) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(username, password, role);
      }}
    >
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="아이디" />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="비밀번호" type="password" />
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="USER">USER</option>
        <option value="OPERATOR">OPERATOR</option>
        <option value="ADMIN">ADMIN</option>
        <option value="AUDITOR">AUDITOR</option>
      </select>
      <button type="submit">회원가입</button>
    </form>
  );
}
