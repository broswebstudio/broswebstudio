'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ICON_SRC } from '@/lib/logo-base64';

export default function CompleteAccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [phone, setPhone] = useState('');

  useEffect(() => {
    fetch('/api/auth/pending')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Session expired or invalid.');
        }
        return res.json();
      })
      .then((data) => {
        setUserData({ name: data.name, email: data.email });
        setLoading(false);
      })
      .catch(() => {
        router.push('/login?error=session_expired');
      });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/auth/complete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(data.role === 'ADMIN' ? '/admin' : '/dashboard');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to complete account.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="auth-wrap">
        <div className="auth-card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <p style={{ color: 'var(--gray)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="brand" style={{ marginBottom: '16px' }}>
          <img src={ICON_SRC} alt="Bro's WebStudio" style={{ width: '48px', height: '48px' }} />
        </div>
        <h2>Complete Your Account</h2>
        <p className="lede" style={{ marginBottom: '32px' }}>
          Almost there! We just need your phone number to finish setting up your account.
        </p>

        {error && <div style={{ color: 'red', marginBottom: '16px', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div className="field">
            <label>Name</label>
            <input type="text" value={userData.name} readOnly style={{ backgroundColor: 'var(--gray-line)', color: 'var(--gray)' }} />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" value={userData.email} readOnly style={{ backgroundColor: 'var(--gray-line)', color: 'var(--gray)' }} />
          </div>
          <div className="field">
            <label>Phone Number</label>
            <input 
              type="tel" 
              placeholder="+91 9876543210" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required 
            />
          </div>
          
          <button className="btn btn-yellow btn-block" type="submit" style={{ marginTop: '24px' }} disabled={submitting}>
            {submitting ? 'Processing...' : 'Complete Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
