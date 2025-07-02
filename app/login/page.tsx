'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password
    });

    setLoading(false);
    if (error) setError(error.message);
    else router.push('/dashboard');
  };

  return (
    <div className="flex h-screen items-center justify-center bg-neutral-100">
      <Card className="w-full max-w-md p-6">
        <h1 className="mb-4 text-center text-2xl font-bold">Log in</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={handleChange}
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={handleChange}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button disabled={loading} className="w-full">
            {loading ? 'Logging in…' : 'Log In'}
          </Button>
        </form>

        <CardContent className="mt-4 text-center text-sm">
          New here?{' '}
          <a href="/signup" className="text-blue-600 underline">
            Create an account
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
