import Link from 'next/link';
import { Button } from '@snapzy/design-system';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold">Snapzy</h1>
      <p className="text-muted max-w-xl text-center">
        An Instagram-beating social platform with AI co-creation, collaborative posts, and blazing realtime.
      </p>
      <div className="flex gap-3">
        <Link href="/auth/login"><Button>Login</Button></Link>
        <Link href="/explore"><Button variant="ghost">Explore</Button></Link>
      </div>
    </main>
  );
}