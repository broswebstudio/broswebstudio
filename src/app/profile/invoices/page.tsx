'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MyInvoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/invoices')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          setInvoices(data.invoices || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ padding: '40px', color: 'var(--gray)' }}>Loading invoices...</div>;
  }

  return (
    <>
      <div className="pdash-section-header">
        <h3>My Invoices</h3>
        <p>View your billing history and submit payments securely.</p>
      </div>

      {invoices.length === 0 ? (
        <div className="pdash-section" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🧾</div>
          <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No invoices yet</h4>
          <p style={{ color: 'var(--gray)', marginBottom: '24px' }}>Your generated invoices will appear here after submitting a project.</p>
          <Link href="/estimate" className="btn btn-primary">Submit New Project</Link>
        </div>
      ) : (
        <div className="invoice-table-wrapper" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--gray-line)' }}>
                <th style={{ padding: '16px', color: 'var(--gray)', fontWeight: 500 }}>Invoice</th>
                <th style={{ padding: '16px', color: 'var(--gray)', fontWeight: 500 }}>Date</th>
                <th style={{ padding: '16px', color: 'var(--gray)', fontWeight: 500 }}>Amount</th>
                <th style={{ padding: '16px', color: 'var(--gray)', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '16px', color: 'var(--gray)', fontWeight: 500 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} style={{ borderBottom: '1px solid var(--gray-line)' }}>
                  <td style={{ padding: '16px', fontWeight: 600, color: 'var(--ink)' }}>{inv.invoiceNumber}</td>
                  <td style={{ padding: '16px', color: 'var(--ink-soft)' }}>{new Date(inv.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '16px', fontWeight: 600, color: 'var(--ink)' }}>₹{inv.amount.toLocaleString()}</td>
                  <td style={{ padding: '16px' }}>
                    <span className={`sub-status badge-${inv.status.toLowerCase()}`}>
                      {inv.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <Link href={`/profile/invoices/${inv.id}`} className="pdash-btn pdash-btn-ghost" style={{ padding: '8px 16px' }}>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
