'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      setError('Wrong password — try again.');
    }
  }

  return (
    <div className="hl-login-wrap">
      <div className="hl-login-card">
        <p className="hl-eyebrow">Card Admin</p>
        <h1>Log in</h1>
        <p>Only you should have this password.</p>
        <form onSubmit={handleSubmit}>
          <input
            className="hl-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          {error && <p className="hl-error">{error}</p>}
          <button className="hl-btn" type="submit" disabled={loading}>
            {loading ? 'Checking…' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  );
}
