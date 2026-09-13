'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'projects' | 'profile'>('projects');
  const [user, setUser] = useState<{name: string, email: string, phone: string} | null>(null);
  
  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  // Mock data for Phase 1 UI
  const mockSubmissions = [
    {
      id: 'REQ-001',
      service: 'Website for Business',
      total: 12999,
      status: 'In Progress',
      date: '2023-10-15',
    },
    {
      id: 'REQ-002',
      service: 'Graphic Designing',
      total: 4499,
      status: 'Delivered',
      date: '2023-09-02',
    }
  ];

  return (
    <div className="admin-shell" style={{ minHeight: '80vh', backgroundColor: 'var(--paper-warm)' }}>
      <div className="admin-head" style={{ padding: '40px 0 0', backgroundColor: 'var(--paper)', borderBottom: '1px solid var(--gray-line)' }}>
        <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '2rem', margin: '0 0 8px 0' }}>Hey, {user?.name || 'Client'} 👋</h2>
            <p className="lede" style={{ margin: 0, color: 'var(--gray)' }}>
              Track the status of everything you've submitted.
            </p>
          </div>
          <button className="btn btn-outline" onClick={() => {
            localStorage.removeItem('user');
            router.push('/login');
          }}>
            Log out
          </button>
        </div>
        <div className="wrap" style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('projects')}
            style={{
              background: 'none', border: 'none', padding: '16px 24px', fontSize: '1rem', fontWeight: 600,
              color: activeTab === 'projects' ? 'var(--ink)' : 'var(--gray)',
              borderBottom: activeTab === 'projects' ? '2px solid var(--yellow)' : '2px solid transparent',
              cursor: 'pointer'
            }}
          >
            My Projects
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              background: 'none', border: 'none', padding: '16px 24px', fontSize: '1rem', fontWeight: 600,
              color: activeTab === 'profile' ? 'var(--ink)' : 'var(--gray)',
              borderBottom: activeTab === 'profile' ? '2px solid var(--yellow)' : '2px solid transparent',
              cursor: 'pointer'
            }}
          >
            My Profile
          </button>
        </div>
      </div>
      
      <div className="wrap" style={{ padding: '60px 20px' }}>
        {activeTab === 'projects' && (
          <div className="admin-panel" style={{ background: 'var(--paper)', padding: '40px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ margin: '0 0 8px 0' }}>Your submissions</h3>
            <p className="sub" style={{ color: 'var(--gray)', marginBottom: '32px' }}>
              {mockSubmissions.length} project{mockSubmissions.length !== 1 ? 's' : ''} on file
            </p>
            
            {mockSubmissions.length === 0 ? (
              <div className="empty-state" style={{ textAlign: 'center', padding: '60px 0' }}>
                <p style={{ color: 'var(--gray)', marginBottom: '24px' }}>
                  No submissions yet — build an estimate on the homepage to get started.
                </p>
                <Link href="/#estimator" className="btn btn-yellow">
                  Go to estimator
                </Link>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--gray-line)', color: 'var(--gray)' }}>
                      <th style={{ padding: '16px 8px' }}>ID</th>
                      <th style={{ padding: '16px 8px' }}>Service</th>
                      <th style={{ padding: '16px 8px' }}>Total</th>
                      <th style={{ padding: '16px 8px' }}>Status</th>
                      <th style={{ padding: '16px 8px' }}>Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockSubmissions.map((s, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--gray-line)' }}>
                        <td style={{ padding: '16px 8px', fontWeight: 500, fontFamily: 'var(--mono)' }}>{s.id}</td>
                        <td style={{ padding: '16px 8px' }}>{s.service}</td>
                        <td style={{ padding: '16px 8px', fontWeight: 600 }}>₹{s.total.toLocaleString('en-IN')}</td>
                        <td style={{ padding: '16px 8px' }}>
                          <span
                            className={`pill ${
                              s.status === 'New' ? 'event' : s.status === 'Delivered' ? 'done' : 'active'
                            }`}
                            style={{
                              display: 'inline-block',
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              backgroundColor: s.status === 'Delivered' ? 'var(--yellow-pale)' : 'var(--gray-line)',
                              color: s.status === 'Delivered' ? 'var(--yellow-deep)' : 'var(--ink)'
                            }}
                          >
                            {s.status}
                          </span>
                        </td>
                        <td style={{ padding: '16px 8px', color: 'var(--gray)' }}>{s.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="admin-panel" style={{ background: 'var(--paper)', padding: '40px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', maxWidth: '600px', margin: '0 auto' }}>
            <h3 style={{ margin: '0 0 8px 0' }}>Profile Details</h3>
            <p className="sub" style={{ color: 'var(--gray)', marginBottom: '32px' }}>Manage your personal information.</p>
            
            <div className="field">
              <label>Name</label>
              <input type="text" defaultValue={user?.name || ''} readOnly />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" defaultValue={user?.email || ''} readOnly />
            </div>
            <div className="field">
              <label>Phone Number</label>
              <input type="tel" defaultValue={user?.phone || ''} readOnly />
            </div>
            
            <button className="btn btn-outline" style={{ marginTop: '16px' }} onClick={() => alert('Profile update feature coming in Phase 2!')}>
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
