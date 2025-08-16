'use client';
import { useEffect, useState } from 'react';

export default function PostView({ params }: { params: { id: string } }) {
  const id = params.id;
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState('Nice!');

  const load = async () => {
    const api = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    const res = await fetch(`${api}/v1/comments/post/${id}`);
    setComments(await res.json());
  };
  useEffect(() => { load(); }, [id]);

  const add = async () => {
    const api = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    await fetch(`${api}/v1/comments/post/${id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ author_id: '1', text }) });
    setText('');
    await load();
  };

  return (
    <main className="p-6 space-y-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold">Post {id}</h1>
      <div className="space-y-2">
        {comments.map((c) => (<div key={c.id} className="border rounded-md p-2"><b>u{c.author_id}</b>: {c.text}</div>))}
      </div>
      <div className="flex gap-2">
        <input className="border rounded-md p-2 flex-1" value={text} onChange={e=>setText(e.target.value)} />
        <button className="bg-primary text-white rounded-md px-3" onClick={add}>Comment</button>
      </div>
    </main>
  );
}