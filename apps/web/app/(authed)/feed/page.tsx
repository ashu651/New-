"use client";
import { useEffect, useState } from 'react';
import FeedCard from '../../../components/FeedCard';

export default function FeedPage() {
  const [items, setItems] = useState<string[]>([]);
  useEffect(() => {
    const load = async () => {
      const api = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
      const rec = await fetch(`${api}/v1/recs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userText: 'photography', candidateCaptions: ['Sunset beach', 'City skyline at night', 'Mountain hike adventure', 'Cafe portrait', 'nsfw spam'] }) });
      const data = await rec.json();
      setItems(data.results.map((r: any) => r.caption));
    };
    load();
  }, []);
  return (
    <main className="p-6 space-y-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold">Feed</h1>
      <div className="grid gap-4">
        {items.length === 0 && Array.from({ length: 3 }).map((_, i) => (<div key={i} className="skeleton h-72 rounded-xl" />))}
        {items.map((x, i) => (<FeedCard key={i} caption={x} author={i % 2 ? 'Demo User' : 'Snapzy Creator'} />))}
      </div>
    </main>
  );
}