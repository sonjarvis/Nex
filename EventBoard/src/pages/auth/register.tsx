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

  return (
    <div>
      <h1>회원가입</h1>
      <RegisterForm onSubmit={handleRegister} />
    </div>
  );
}
