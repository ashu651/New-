'use client';
import { useState } from 'react';

export default function ComposePage() {
  const [caption, setCaption] = useState('Hello from Compose');
  const [msg, setMsg] = useState('');
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const api = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    const token = localStorage.getItem('snapzy_access') || '';
    const res = await fetch(`${api}/v1/posts`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ kind: 'image', caption })
    });
    setMsg(res.ok ? 'Posted!' : 'Failed');
  };
  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold">Compose</h1>
      <form onSubmit={submit} className="space-y-3">
        <textarea className="border rounded-md p-2 w-full" value={caption} onChange={e=>setCaption(e.target.value)} />
        <button className="bg-primary text-white rounded-md px-3 py-2" type="submit">Publish</button>
        {msg && <p role="status">{msg}</p>}
      </form>
    </main>
  );
}