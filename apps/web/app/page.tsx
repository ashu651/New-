import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold">Snapzy</h1>
      <p className="text-muted max-w-xl text-center">
        An Instagram-beating social platform with AI co-creation, collaborative posts, and blazing realtime.
      </p>
      <div className="flex gap-3">
        <Link href="/auth/login"><button className="bg-primary text-white rounded-md px-4 py-2">Login</button></Link>
        <Link href="/explore"><button className="border rounded-md px-4 py-2">Explore</button></Link>
      </div>
    </main>
  );
}