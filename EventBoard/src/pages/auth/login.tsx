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

  const goToRegister = () => {
    router.push('/auth/register');
  };

  return (
    <div>
      <div>
        <h1>로그인</h1>
        <button onClick={goToRegister}>회원가입 이동</button>
      </div>
      <LoginForm onSubmit={handleLogin} />
    </div>
     
  );
}
