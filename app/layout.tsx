import './globals.css';
import type { Metadata } from 'next';
import AuthProvider from '@/lib/AuthProvider';   // ← normal import is fine

export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'SINC Dev Test'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
