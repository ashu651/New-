'use client';
import { useEffect, useState } from 'react';

export default function InboxPage() {
  const [threadId] = useState('1');
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('Hello');

  const load = async () => {
    const api = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    const res = await fetch(`${api}/v1/dm/${threadId}`);
    const data = await res.json();
    setMessages(data);
  };

  useEffect(() => { load(); }, []);

  const send = async () => {
    const api = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    await fetch(`${api}/v1/dm/${threadId}/send`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ senderId: '1', type: 'text', body: text }) });
    setText('');
    await load();
  };

  return (
    <main className="p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Inbox</h1>
      <p className="text-muted">E2E encryption supported when clients exchange keys.</p>
      <div className="space-y-1">
        {messages.map((m) => (<div key={m.ts_time}>{m.sender_id}: {m.body || '[encrypted]'}</div>))}
      </div>
      <div className="flex gap-2">
        <input className="border rounded-md p-2" value={text} onChange={e=>setText(e.target.value)} />
        <button className="bg-primary text-white rounded-md px-3" onClick={send}>Send</button>
      </div>
    </main>
  );
}