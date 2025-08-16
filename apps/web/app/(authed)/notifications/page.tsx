'use client';
import { useEffect, useState } from 'react';

export default function NotificationsPage() {
  const [items, setItems] = useState<any[]>([]);
  const api = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
  useEffect(() => { (async()=>{ const r = await fetch(`${api}/v1/notifications/1`); setItems(await r.json()); })(); }, []);
  return (
    <main className="p-6 space-y-3 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold">Notifications</h1>
      <div className="space-y-2">
        {items.map(n => (<div key={n.id} className="border rounded-md p-2 flex justify-between"><div>{n.type}</div><div className="text-muted text-sm">{new Date(n.created_at).toLocaleString()}</div></div>))}
        {items.length===0 && <p className="text-muted">No notifications yet.</p>}
      </div>
    </main>
  );
}