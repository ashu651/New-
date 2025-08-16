'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AuthedLayout({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState(false);
  useEffect(() => { const t = localStorage.getItem('snapzy_access'); setOk(!!t); }, []);
  if (!ok) return <main className="p-6">Please <Link href="/auth/login">login</Link>.</main>;
  return (
    <div>
      <nav className="flex gap-4 p-4 border-b">
        <Link href="/">Home</Link>
        <Link href="/feed">Feed</Link>
        <Link href="/compose">Compose</Link>
        <Link href="/inbox">Inbox</Link>
        <Link href="/settings/explore">Explore Settings</Link>
      </nav>
      {children}
    </div>
  );
}