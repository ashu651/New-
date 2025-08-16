'use client';
import { useEffect, useState } from 'react';

export default function SecurityPage() {
  const [secret, setSecret] = useState<string>('');
  const [otpauth, setOtpauth] = useState<string>('');
  const [token, setToken] = useState('');
  const api = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

  const setup = async () => {
    const res = await fetch(`${api}/v1/totp/setup`); const data = await res.json(); setSecret(data.secret); setOtpauth(data.otpauth);
  };
  const verify = async () => {
    const res = await fetch(`${api}/v1/totp/verify`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ secret, token }) });
    alert((await res.json()).ok ? '2FA verified' : 'Invalid code');
  };

  return (
    <main className="p-6 space-y-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold">Security</h1>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Sign in with Google</h2>
        <a className="border rounded-md px-3 py-2 inline-block" href={`${api}/v1/oauth/google/init`}>Connect Google</a>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Two-Factor Auth (TOTP)</h2>
        {!secret ? <button className="border rounded-md px-3 py-2" onClick={setup}>Setup 2FA</button> : (
          <div className="space-y-2">
            <div className="text-sm break-all">Secret: {secret}</div>
            <div className="text-sm break-all">URI: {otpauth}</div>
            <input className="border rounded-md p-2" placeholder="123456" value={token} onChange={e=>setToken(e.target.value)} />
            <button className="bg-primary text-white rounded-md px-3 py-2" onClick={verify}>Verify</button>
          </div>
        )}
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Sessions</h2>
        <p className="text-muted">Device/session management coming soon.</p>
      </section>
    </main>
  );
}