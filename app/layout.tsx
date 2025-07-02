import './globals.css';
import type { Metadata } from 'next';
import AuthProvider from '@/lib/AuthProvider';

export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'SINC Dev Test of Competence'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
