'use client';
import { useEffect, useState } from 'react';

export default function ProfilePage({ params }: { params: { id: string } }) {
  const id = params.id;
  const api = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const p = await fetch(`${api}/v1/users/${id}`); setProfile(await p.json());
      const ps = await fetch(`${api}/v1/posts?author_id=${id}`); setPosts(await ps.json());
    };
    load();
  }, [id]);

  const react = async (pid: string) => { await fetch(`${api}/v1/reactions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content_kind: 'post', content_id: pid, user_id: id }) }); alert('Liked'); };
  const save = async (pid: string) => { await fetch(`${api}/v1/saves`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: id, content_kind: 'post', content_id: pid }) }); alert('Saved'); };

  if (!profile) return <main className="p-6">Loading...</main>;
  const u = profile.user || {};
  return (
    <main className="p-6 space-y-4 max-w-4xl mx-auto">
      <header className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gray-200" />
        <div>
          <h1 className="text-2xl font-semibold">{u.name || u.handle}</h1>
          <p className="text-muted">@{u.handle}</p>
          <p className="text-sm">{profile.stats.posts} posts · {profile.stats.followers} followers · {profile.stats.following} following</p>
        </div>
      </header>
      <section>
        <h2 className="text-lg font-semibold mb-2">Posts</h2>
        <div className="grid grid-cols-3 gap-2">
          {posts.map((p) => (
            <div key={p.id} className="aspect-square bg-gray-100 flex items-center justify-center relative">
              <span className="text-sm p-1 absolute bottom-1 left-1 bg-white/70 rounded">{p.caption}</span>
              <div className="absolute top-1 right-1 flex gap-1">
                <button className="border rounded px-2 py-1" onClick={()=>react(p.id)}>♥</button>
                <button className="border rounded px-2 py-1" onClick={()=>save(p.id)}>⭳</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}