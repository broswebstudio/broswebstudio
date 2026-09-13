'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Tab = 'overview' | 'submissions' | 'activity' | 'abandoned';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  
  // Real data state
  const [logData, setLogData] = useState<any[]>([]);
  const [abandonedData, setAbandonedData] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [totalSessions, setTotalSessions] = useState(45);
  
  useEffect(() => {
    fetch('/api/admin/data')
      .then(res => {
        if (res.status === 401) {
          router.push('/login');
          throw new Error('Unauthorized');
        }
        return res.json();
      })
      .then(data => {
        if (data && data.success) {
          setLogData(data.activityLogs);
          setSubmissions(data.submissions);
          
          // Calculate abandoned sessions
          const sessions: Record<string, { sessionId: string, events: any[], lastTs: number }> = {};
          data.activityLogs.forEach((ev: any) => {
            if (!sessions[ev.sessionId]) {
              sessions[ev.sessionId] = { sessionId: ev.sessionId, events: [], lastTs: 0 };
            }
            sessions[ev.sessionId].events.push(ev);
            sessions[ev.sessionId].lastTs = Math.max(sessions[ev.sessionId].lastTs, new Date(ev.timestamp).getTime());
          });
          
          const sessionList = Object.values(sessions).sort((a, b) => b.lastTs - a.lastTs);
          setTotalSessions(sessionList.length);
          
          const abandoned = sessionList.filter(s =>
            s.events.some((e: any) => e.actionType === 'estimator_interaction') &&
            !s.events.some((e: any) => e.actionType === 'submission')
          );
          setAbandonedData(abandoned);
          
          // We can also store the submissions if needed for the overview tab
          // setSubmissions(data.submissions);
        }
      })
      .catch(err => console.error("Failed to load admin data:", err));
  }, [activeTab]);

  const totalSubs = submissions.length;
  const conv = totalSessions ? Math.round((totalSubs / totalSessions) * 100) : 0;
  const totalValue = submissions.reduce((sum, sub) => sum + sub.totalEstimate, 0);

  return (
    <div className="admin-shell" style={{ minHeight: '100vh', backgroundColor: 'var(--paper-warm)' }}>
      <div className="admin-head" style={{ padding: '40px 0', backgroundColor: 'var(--paper)', borderBottom: '1px solid var(--gray-line)' }}>
        <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', margin: '0 0 4px 0' }}>Admin Dashboard</h2>
            <p className="lede" style={{ margin: 0, color: 'var(--gray)' }}>Live view of submissions and on-site activity.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/admin/payments" className="btn btn-primary">
              Manage Payments
            </Link>
            <button 
              className="btn btn-outline" 
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

      <div className="admin-tabs" style={{ background: 'var(--paper)', borderBottom: '1px solid var(--gray-line)' }}>
        <div className="wrap" style={{ display: 'flex', gap: '8px' }}>
          {(['overview', 'submissions', 'activity', 'abandoned'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`admin-tab ${activeTab === t ? 'active' : ''}`}
              style={{
                background: 'none',
                border: 'none',
                padding: '16px 24px',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: activeTab === t ? 'var(--ink)' : 'var(--gray)',
                borderBottom: activeTab === t ? '2px solid var(--yellow)' : '2px solid transparent',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="wrap" style={{ padding: '30px 20px 60px' }}>
        {activeTab === 'overview' && (
          <>
            <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              <div className="stat-card" style={{ background: 'var(--yellow)', padding: '24px', borderRadius: 'var(--radius)', color: 'var(--ink)' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>{totalSubs}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>total submissions</div>
              </div>
              <div className="stat-card" style={{ background: 'var(--paper)', padding: '24px', borderRadius: 'var(--radius)', border: '1px solid var(--gray-line)' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>{totalSessions}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--gray)' }}>tracked sessions</div>
              </div>
              <div className="stat-card" style={{ background: 'var(--paper)', padding: '24px', borderRadius: 'var(--radius)', border: '1px solid var(--gray-line)' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>{conv}%</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--gray)' }}>conversion rate</div>
              </div>
              <div className="stat-card" style={{ background: 'var(--paper)', padding: '24px', borderRadius: 'var(--radius)', border: '1px solid var(--gray-line)' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>₹{(totalValue/1000).toFixed(1)}k</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--gray)' }}>pipeline value</div>
              </div>
            </div>

            <div className="admin-panel" style={{ background: 'var(--paper)', padding: '32px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', marginBottom: '32px' }}>
              <h3 style={{ margin: '0 0 8px 0' }}>Recent submissions</h3>
              <p className="sub" style={{ color: 'var(--gray)', marginBottom: '24px' }}>Latest across all services</p>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--gray-line)', color: 'var(--gray)' }}>
                      <th style={{ padding: '12px 8px' }}>ID</th>
                      <th style={{ padding: '12px 8px' }}>Type</th>
                      <th style={{ padding: '16px 8px', color: 'var(--gray)', fontWeight: 500 }}>Name</th>
                      <th style={{ padding: '16px 8px', color: 'var(--gray)', fontWeight: 500 }}>Contact</th>
                      <th style={{ padding: '16px 8px', color: 'var(--gray)', fontWeight: 500 }}>Status</th>
                      <th style={{ padding: '16px 8px', width: '40px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((s, i) => (
                      <tr key={s.id} style={{ borderBottom: '1px solid var(--gray-line)' }}>
                        <td style={{ padding: '16px 8px', fontFamily: 'var(--mono)', fontSize: '0.85rem' }}>{s.id.slice(-6).toUpperCase()}</td>
                        <td style={{ padding: '16px 8px' }}>
                          <span className="pill event" style={{ fontSize: '0.8rem', padding: '4px 8px', background: 'var(--gray-line)', borderRadius: '12px' }}>{s.status === 'DISCUSS' ? 'consultation' : 'submission'}</span>
                        </td>
                        <td style={{ padding: '16px 8px', fontWeight: 500 }}>{s.contactName}</td>
                        <td style={{ padding: '16px 8px', color: 'var(--gray)', fontSize: '0.9rem' }}>{s.contactEmail}</td>
                        <td style={{ padding: '16px 8px' }}>
                          <select 
                            value={s.status} 
                            onChange={async (e) => {
                              const newStatus = e.target.value;
                              const res = await fetch(`/api/admin/submissions/${s.id}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: newStatus })
                              });
                              if (res.ok) {
                                setSubmissions(submissions.map(sub => sub.id === s.id ? { ...sub, status: newStatus } : sub));
                              }
                            }}
                            style={{ padding: '4px', borderRadius: '4px', border: '1px solid var(--gray-line)', fontSize: '0.85rem' }}
                          >
                            <option value="NEW">New</option>
                            <option value="DISCUSS">Discuss</option>
                            <option value="CONTACTED">Contacted</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                          </select>
                        </td>
                        <td style={{ padding: '16px 8px' }}>
                          <button 
                            onClick={async () => {
                              if (confirm('Are you sure you want to delete this submission?')) {
                                const res = await fetch(`/api/admin/submissions/${s.id}`, { method: 'DELETE' });
                                if (res.ok) {
                                  setSubmissions(submissions.filter(sub => sub.id !== s.id));
                                }
                              }
                            }}
                            style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontSize: '1.1rem' }}
                            title="Delete"
                          >
                            &times;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'submissions' && (
          <div className="admin-panel" style={{ background: 'var(--paper)', padding: '32px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ margin: '0 0 8px 0' }}>All submissions</h3>
            <p className="sub" style={{ color: 'var(--gray)', marginBottom: '24px' }}>{totalSubs} total</p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--gray-line)', color: 'var(--gray)' }}>
                    <th style={{ padding: '12px 8px' }}>Date</th>
                    <th style={{ padding: '12px 8px' }}>Client</th>
                    <th style={{ padding: '12px 8px' }}>Project Type</th>
                    <th style={{ padding: '12px 8px' }}>Details</th>
                    <th style={{ padding: '12px 8px' }}>Estimate</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map(s => {
                    let details = null;
                    try { details = JSON.parse(s.servicesSelected); } catch(e){}
                    
                    return (
                      <tr key={s.id} style={{ borderBottom: '1px solid var(--gray-line)' }}>
                        <td style={{ padding: '16px 8px', color: 'var(--gray)' }}>{new Date(s.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: '16px 8px' }}>
                          <div style={{ fontWeight: 600 }}>{s.contactName}</div>
                          <div style={{ color: 'var(--gray)' }}>{s.contactEmail}</div>
                          <div style={{ color: 'var(--gray)' }}>{s.contactPhone}</div>
                        </td>
                        <td style={{ padding: '16px 8px' }}>
                          <span className="pill event" style={{ fontSize: '0.8rem', padding: '4px 8px', background: 'var(--gray-line)', borderRadius: '12px', textTransform: 'capitalize' }}>
                            {details?.category || 'Unknown'}
                          </span>
                        </td>
                        <td style={{ padding: '16px 8px', maxWidth: '300px' }}>
                          <div style={{ fontWeight: 600 }}>{details?.projectName}</div>
                          <div style={{ color: 'var(--gray)', marginBottom: '8px' }}>{details?.projectDesc}</div>
                          {details?.techStack && <div style={{ fontSize: '0.85rem' }}><strong>Tech:</strong> {details.techStack}</div>}
                          {details?.deadline && <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary)' }}><strong>Deadline:</strong> {details.deadline}</div>}
                        </td>
                        <td style={{ padding: '16px 8px', fontWeight: 600 }}>₹{s.totalEstimate}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="admin-panel" style={{ background: 'var(--paper)', padding: '32px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ margin: '0 0 8px 0' }}>Real-time activity log</h3>
            <p className="sub" style={{ color: 'var(--gray)', marginBottom: '24px' }}>Most recent events</p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--gray-line)', color: 'var(--gray)' }}>
                    <th style={{ padding: '12px 8px' }}>Event</th>
                    <th style={{ padding: '12px 8px' }}>Session</th>
                    <th style={{ padding: '12px 8px' }}>Details</th>
                    <th style={{ padding: '12px 8px' }}>When</th>
                  </tr>
                </thead>
                <tbody>
                  {logData.slice(0, 60).map((l, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--gray-line)' }}>
                      <td style={{ padding: '16px 8px' }}>
                        <span className="pill event" style={{ fontSize: '0.8rem', padding: '4px 8px', background: 'var(--gray-line)', borderRadius: '12px' }}>{l.actionType}</span>
                      </td>
                      <td style={{ padding: '16px 8px', fontFamily: 'var(--mono)', fontSize: '0.9rem', color: 'var(--gray)' }}>{l.sessionId.slice(0, 8)}...</td>
                      <td style={{ padding: '16px 8px', fontFamily: 'var(--mono)', fontSize: '0.85rem' }}>{l.details}</td>
                      <td style={{ padding: '16px 8px', color: 'var(--gray)', fontSize: '0.9rem' }}>{new Date(l.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'abandoned' && (
          <div className="admin-panel" style={{ background: 'var(--paper)', padding: '32px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ margin: '0 0 8px 0' }}>Abandoned estimator sessions</h3>
            <p className="sub" style={{ color: 'var(--gray)', marginBottom: '24px' }}>Sessions with selections but no submission</p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--gray-line)', color: 'var(--gray)' }}>
                    <th style={{ padding: '12px 8px' }}>Session</th>
                    <th style={{ padding: '12px 8px' }}>Last selections seen</th>
                    <th style={{ padding: '12px 8px' }}>Events</th>
                    <th style={{ padding: '12px 8px' }}>Last active</th>
                  </tr>
                </thead>
                <tbody>
                  {abandonedData.map((a, i) => {
                    const lastInteraction = [...a.events].reverse().find((e: any) => e.actionType === 'estimator_interaction');
                    let sels = '—';
                    if (lastInteraction) {
                      try {
                        const payload = JSON.parse(lastInteraction.details);
                        if (payload && payload.text) sels = payload.text;
                      } catch(e) {}
                    }
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid var(--gray-line)' }}>
                        <td style={{ padding: '16px 8px', fontFamily: 'var(--mono)', fontSize: '0.9rem', color: 'var(--gray)' }}>{a.sessionId.slice(0, 8)}...</td>
                        <td style={{ padding: '16px 8px' }}>{sels}</td>
                        <td style={{ padding: '16px 8px' }}>
                          <span className="pill abandoned" style={{ fontSize: '0.8rem', padding: '4px 8px', background: 'var(--gray-line)', borderRadius: '12px' }}>{a.events.length} events</span>
                        </td>
                        <td style={{ padding: '16px 8px', color: 'var(--gray)', fontSize: '0.9rem' }}>{new Date(a.lastTs).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
