import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import RegisterForm from '../../components/forms/RegisterForm';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async (username: string, password: string, role: string) => {
    const res = await register(username, password, role);
    if (res) {
      router.push('/auth/login');
    }
  };

  const goTologin = () => {
    router.push('/auth/login');
  };

  return (
    <div>
      <div>
        <h1>회원가입</h1>
        <button onClick={goTologin}>로그인 이동</button>
      </div>
      
      <RegisterForm onSubmit={handleRegister} />
    </div>
    
  );
}
