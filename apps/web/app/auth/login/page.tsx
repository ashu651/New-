'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('demo');
  const [password, setPassword] = useState('password123');
  const [msg, setMsg] = useState<string>('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    if (!res.ok) { setMsg('Login failed'); return; }
    const data = await res.json();
    localStorage.setItem('snapzy_access', data.access);
    setMsg('Logged in');
  };

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <form onSubmit={submit} className="flex flex-col gap-3 w-full max-w-sm">
        <h1 className="text-2xl font-semibold">Login</h1>
        <input aria-label="Username or email" className="border rounded-md p-2" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
        <input aria-label="Password" type="password" className="border rounded-md p-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="bg-primary text-white rounded-md py-2" type="submit">Sign In</button>
        {msg && <p role="status">{msg}</p>}
      </form>
    </main>
  );
}