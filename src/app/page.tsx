'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/shared/SplashScreen';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(() => {
      if (session) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [session, loading, router]);

  return <SplashScreen />;
}