import { useState, useEffect } from 'react';
import { registerUser, loginUser } from '@/apis/auth';

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // 컴포넌트 마운트 시 localStorage에서 복원
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const register = async (username: string, password: string, role: string) => {
    try {
      const res = await registerUser(username, password, role);
      alert('회원가입 성공!');
      return res.data;
    } catch (err: any) {
      alert(`회원가입 실패: ${err.response?.data?.message || err.message}`);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const res = await loginUser(username, password);
      setToken(res.data.access_token);
      setUser(res.data.user);

      // 로그인 성공 시 localStorage 저장
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      alert('로그인 성공!');
      return res.data;
    } catch (err: any) {
      alert(`로그인 실패: ${err.response?.data?.message || err.message}`);
    }
  };

  return { token, user, login, register, logout };
};
