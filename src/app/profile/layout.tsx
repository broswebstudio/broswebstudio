'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch('/api/user/data')
      .then((res) => {
        if (res.status === 401) {
          router.push('/login');
          throw new Error('Unauthorized');
        }
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.success) {
          setUserData(data.user);
        } else {
          setErrorMsg(data.error || 'Unknown API error');
        }
      })
      .catch((err) => {
        console.error(err);
        setErrorMsg(err.message);
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--gray)' }}>Loading portal...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'red' }}>Error loading profile data.</p>
        <p style={{ color: 'var(--gray)', fontSize: '0.9rem', marginTop: '8px' }}>Details: {errorMsg}</p>
        <button onClick={() => window.location.reload()} className="btn btn-outline" style={{ marginTop: '16px' }}>Retry</button>
      </div>
    );
  }

  return (
    <div className="pdash-wrapper">
      <div className="pdash-header">
        <div className="wrap pdash-header-inner">
          <div className="pdash-title">
            <h2>User Dashboard</h2>
            <p>Welcome back, <span className="highlight">{userData.name ? userData.name.split(' ')[0] : 'Client'}</span></p>
          </div>
          <div className="pdash-actions">
            <Link href="/" className="pdash-btn pdash-btn-ghost">Site Home</Link>
            <button 
              className="pdash-btn pdash-btn-danger" 
              onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' });
                router.push('/login');
              }}
            >
              Log out
            </button>
          </div>
        </div>
      </div>

      <div className="wrap pdash-grid">
        <aside className="pdash-sidebar">
          <div className="pdash-card pdash-profile-card">
            <div className="pdash-avatar">
              {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="pdash-profile-info">
              <h3>{userData.name || 'Client User'}</h3>
              <p className="email">{userData.email}</p>
              {userData.phone && <p className="phone">📞 {userData.phone}</p>}
            </div>
            
            <div className="pdash-nav" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link href="/profile" className={`pdash-nav-link ${pathname === '/profile' ? 'active' : ''}`}>
                📊 Overview
              </Link>
              <Link href="/profile/invoices" className={`pdash-nav-link ${pathname.includes('/profile/invoices') ? 'active' : ''}`}>
                🧾 My Invoices
              </Link>
            </div>

            <div className="pdash-profile-meta" style={{ marginTop: '24px' }}>
              <div className="meta-item">
                <span className="meta-label">Member Since</span>
                <span className="meta-value">{new Date(userData.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="pdash-main">
          {children}
        </main>
      </div>
    </div>
  );
}
