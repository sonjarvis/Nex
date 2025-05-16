import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import LoginForm from '../../components/forms/LoginForm';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (username: string, password: string) => {
    const res = await login(username, password);
    if (res?.access_token) {
      router.push('/events');
    }
  };

  return (
    <div>
      <h1>로그인</h1>
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
}
