import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe2 } from 'lucide-react';

export const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard/stories');
    }, 1300);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'rgba(77, 70, 227, 0.75)' }}>
      <div className="text-center">
        <Globe2 className="h-24 w-24 text-white mx-auto animate-bounce" />
        <h1 className="mt-6 text-4xl font-bold text-white">LinguaLearn</h1>
        <p className="mt-2 text-xl text-white opacity-75">Explore. Learn. Connect.</p>
      </div>
    </div>
  );
};