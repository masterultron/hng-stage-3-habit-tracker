import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { HabitProvider } from '@/context/HabitContext';
import ServiceWorkerRegister from '../components/shared/ServiceWorkerRegister';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Habit Tracker',
  description: 'Track your daily habits',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <HabitProvider>
            {children}
          </HabitProvider>
        </AuthProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}