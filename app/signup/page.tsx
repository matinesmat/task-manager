'use client';                                 // this file runs in the browser
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Supabase sign‑up
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { username: form.username } }
    });

    setLoading(false);

    if (error) setError(error.message);
    else router.push('/login');              // we’ll build /login next
  };

  return (
    <div className="flex h-screen items-center justify-center bg-neutral-100">
      <Card className="w-full max-w-md p-6">
        <h1 className="mb-4 text-center text-2xl font-bold">Create an account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="username"
            placeholder="User name"
            required
            value={form.username}
            onChange={handleChange}
          />
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
            {loading ? 'Signing up…' : 'Sign Up'}
          </Button>
        </form>

        <CardContent className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 underline">
            Log in
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
