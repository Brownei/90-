import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleAuthCallback, error } = useAuth();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code || !state) {
      navigate('/', { replace: true });
      return;
    }

    async function handleCallback() {
      try {
        await handleAuthCallback(code as string, state as string);
        navigate('/', { replace: true });
      } catch (error) {
        // Error is handled by the auth context
        navigate('/', { replace: true });
      }
    }

    handleCallback();
  }, [searchParams, handleAuthCallback, navigate]);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Connecting to X...</h1>
        {error && (
          <p className="text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
} 