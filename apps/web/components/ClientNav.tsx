'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ClientNav() {
  const [theme, setTheme] = useState<'light'|'dark'>('light');
  useEffect(() => {
    const stored = localStorage.getItem('snapzy_theme2') as 'light'|'dark'|null;
    if (stored) { setTheme(stored); document.documentElement.classList.toggle('dark', stored==='dark'); }
  }, []);
  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('snapzy_theme2', next);
    document.documentElement.classList.toggle('dark', next==='dark');
  };
  return (
    <nav className="flex gap-4 p-4 border-b items-center justify-between">
      <div className="flex gap-4">
        <Link href="/">Home</Link>
        <Link href="/feed">Feed</Link>
        <Link href="/compose">Compose</Link>
        <Link href="/inbox">Inbox</Link>
        <Link href="/settings/explore">Explore</Link>
      </div>
      <button className="border rounded-md px-3 py-1" onClick={toggle}>Theme</button>
    </nav>
  );
}