'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = () => {
    setLoading(true);
    fetch('/api/admin/payments')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          setPayments(data.payments || []);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleVerify = async (paymentId: string, action: 'ACCEPT' | 'REJECT') => {
    const isConfirm = window.confirm(`Are you sure you want to ${action} this payment? This action will update the client's invoice status.`);
    if (!isConfirm) return;

    try {
      const res = await fetch(`/api/admin/payments/${paymentId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        fetchPayments(); // Refresh list
      } else {
        alert('Failed to verify payment.');
      }
    } catch (err) {
      alert('Network error.');
    }
  };

  if (loading) return <div style={{ padding: '40px', color: 'var(--gray)' }}>Loading payments...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Payments & UTR Verification</h2>
      </div>

      {payments.length === 0 ? (
        <div style={{ background: '#fff', padding: '40px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--gray-line)' }}>
          <p style={{ color: 'var(--gray)', margin: 0 }}>No payments found in the system.</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid var(--gray-line)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--paper-warm)', borderBottom: '1px solid var(--gray-line)' }}>
                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--ink)' }}>UTR Number</th>
                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--ink)' }}>Client</th>
                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--ink)' }}>Invoice</th>
                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--ink)' }}>Amount</th>
                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--ink)' }}>Status</th>
                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--ink)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--gray-line)' }}>
                  <td style={{ padding: '16px', fontFamily: 'monospace' }}>{p.utrNumber}</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: 500 }}>{p.invoice?.user?.name || 'Unknown'}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--gray)' }}>{p.invoice?.user?.email}</div>
                  </td>
                  <td style={{ padding: '16px' }}>{p.invoice?.invoiceNumber}</td>
                  <td style={{ padding: '16px', fontWeight: 'bold' }}>₹{p.amount.toLocaleString()}</td>
                  <td style={{ padding: '16px' }}>
                    <span className={`sub-status badge-${p.status.toLowerCase()}`}>
                      {p.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    {p.status === 'PENDING_VERIFICATION' ? (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => handleVerify(p.id, 'ACCEPT')}>Accept</button>
                        <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => handleVerify(p.id, 'REJECT')}>Reject</button>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Verified</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
