"use client";
import { useEffect, useState } from 'react';

export default function FeedPage() {
  const [items, setItems] = useState<string[]>([]);
  useEffect(() => {
    const load = async () => {
      const api = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
      const rec = await fetch(`${api}/v1/recs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userText: 'photography', candidateCaptions: ['sunset beach', 'city skyline', 'nsfw spam'] }) });
      const data = await rec.json();
      setItems(data.results.map((r: any) => r.caption));
    };
    load();
  }, []);
  return (
    <main className="p-6 space-y-2">
      <h1 className="text-2xl font-semibold">Feed</h1>
      <ul className="list-disc pl-6">
        {items.map((x, i) => (<li key={i}>{x}</li>))}
      </ul>
    </main>
  );
}