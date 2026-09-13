'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function InvoiceDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Payment Submission State
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetch(`/api/user/invoices/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          setInvoice(data.invoice);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber) return alert('UTR Number is required.');
    
    try {
      const res = await fetch(`/api/user/invoices/${id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ utrNumber, notes })
      });
      if (res.ok) {
        alert('Payment submitted for verification successfully!');
        window.location.reload();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to submit payment.');
      }
    } catch (err) {
      alert('Network error.');
    }
  };

  if (loading) return <div style={{ padding: '40px', color: 'var(--gray)' }}>Loading invoice...</div>;
  if (!invoice) return <div style={{ padding: '40px', color: 'red' }}>Invoice not found or unauthorized.</div>;

  const isPaidOrAccepted = invoice.status === 'PAYMENT_ACCEPTED' || invoice.status === 'PAID';

  return (
    <>
      <div className="pdash-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link href="/profile/invoices" style={{ color: 'var(--gray)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '8px', display: 'inline-block' }}>← Back to Invoices</Link>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            Invoice {invoice.invoiceNumber}
            <span className={`sub-status badge-${invoice.status.toLowerCase()}`} style={{ fontSize: '0.8rem' }}>
              {invoice.status.replace('_', ' ')}
            </span>
          </h3>
        </div>
        <div>
          {isPaidOrAccepted ? (
            <button className="pdash-btn pdash-btn-primary" onClick={() => alert('PDF generation feature coming soon.')}>
              Download PDF
            </button>
          ) : (
            <button className="pdash-btn pdash-btn-ghost" style={{ opacity: 0.5, cursor: 'not-allowed' }} title="Available after payment verification">
              🔒 Download Locked
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        
        {/* The Invoice Document View */}
        <div className="pdash-card" style={{ background: '#fff', color: '#000', borderRadius: '8px', padding: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--yellow)', paddingBottom: '24px', marginBottom: '24px' }}>
            <div>
              <h2 style={{ margin: 0, fontWeight: 900, fontSize: '2rem' }}>Bro's WebStudio</h2>
              <p style={{ margin: '4px 0 0 0', color: '#555', fontSize: '0.9rem' }}>Web Development & Project Solutions</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 300, color: '#333' }}>INVOICE</h1>
              <p style={{ margin: '4px 0 0 0', fontWeight: 600 }}>{invoice.invoiceNumber}</p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
            <div>
              <p style={{ fontWeight: 600, margin: '0 0 8px 0', color: '#888', fontSize: '0.85rem', textTransform: 'uppercase' }}>Bill To</p>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>{invoice.user?.name || 'Client'}</h4>
              <p style={{ margin: 0, color: '#444' }}>{invoice.user?.email}</p>
              {invoice.user?.phone && <p style={{ margin: '4px 0 0 0', color: '#444' }}>{invoice.user?.phone}</p>}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ marginBottom: '12px' }}>
                <p style={{ margin: 0, color: '#888', fontSize: '0.85rem' }}>Invoice Date</p>
                <p style={{ margin: 0, fontWeight: 600 }}>{new Date(invoice.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p style={{ margin: 0, color: '#888', fontSize: '0.85rem' }}>Due Date</p>
                <p style={{ margin: 0, fontWeight: 600 }}>{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
            <thead>
              <tr style={{ background: 'var(--paper-warm)', color: 'var(--ink)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500 }}>Description</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 500 }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '16px', borderBottom: '1px solid #eee' }}>
                  <strong>Project ID: {invoice.projectId.slice(-8)}</strong>
                  <div style={{ color: '#666', fontSize: '0.9rem', marginTop: '4px' }}>
                    Services: {invoice.project?.servicesSelected.replace(/[\[\]"]/g, '').split(',').join(', ')}
                  </div>
                </td>
                <td style={{ padding: '16px', textAlign: 'right', borderBottom: '1px solid #eee', fontWeight: 600 }}>
                  ₹{invoice.amount.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '300px', background: 'var(--paper-warm)', color: 'var(--ink)', padding: '24px', borderRadius: '8px', border: '1px solid var(--gray-line)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span>Subtotal</span>
                <span>₹{invoice.amount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', borderTop: '1px solid var(--gray-line)', paddingTop: '12px', marginTop: '12px' }}>
                <span>Total</span>
                <span style={{ color: 'var(--yellow-deep)' }}>₹{invoice.amount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Action Area */}
        {!isPaidOrAccepted && (
          <div className="pdash-card" style={{ border: '1px solid var(--yellow)', background: 'rgba(244, 180, 0, 0.05)' }}>
            {invoice.status === 'PAYMENT_PENDING' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ margin: 0, color: 'var(--yellow-deep)' }}>Payment Pending</h3>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--ink)' }}>₹{invoice.amount.toLocaleString()}</div>
                </div>
                
                {!showPaymentForm ? (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                      <div style={{ padding: '16px', background: 'var(--paper)', borderRadius: '8px', border: '1px solid var(--gray-line)' }}>
                        <h4 style={{ color: 'var(--ink)', marginBottom: '8px', fontSize: '1rem' }}>UPI Payment</h4>
                        <p style={{ color: 'var(--gray)', fontSize: '0.9rem', marginBottom: '8px' }}>UPI ID: <strong>broswebstudio@upi</strong></p>
                        <div style={{ width: '120px', height: '120px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '0.8rem', fontWeight: 'bold', borderRadius: '8px', border: '1px solid var(--gray-line)' }}>
                          [ UPI QR ]
                        </div>
                      </div>
                      <div style={{ padding: '16px', background: 'var(--paper)', borderRadius: '8px', border: '1px solid var(--gray-line)' }}>
                        <h4 style={{ color: 'var(--ink)', marginBottom: '8px', fontSize: '1rem' }}>Bank Transfer</h4>
                        <p style={{ color: 'var(--gray)', fontSize: '0.9rem', marginBottom: '4px' }}>Bank: <strong>HDFC Bank</strong></p>
                        <p style={{ color: 'var(--gray)', fontSize: '0.9rem', marginBottom: '4px' }}>Name: <strong>Bro's WebStudio</strong></p>
                        <p style={{ color: 'var(--gray)', fontSize: '0.9rem', marginBottom: '4px' }}>A/C: <strong>50200012345678</strong></p>
                        <p style={{ color: 'var(--gray)', fontSize: '0.9rem', marginBottom: '4px' }}>IFSC: <strong>HDFC0001234</strong></p>
                      </div>
                    </div>
                    
                    <div style={{ borderTop: '1px solid var(--gray-line)', paddingTop: '24px', textAlign: 'center' }}>
                      <p style={{ color: 'var(--ink)', marginBottom: '16px', fontWeight: 600 }}>Already made the payment?</p>
                      <button className="pdash-btn pdash-btn-primary" onClick={() => setShowPaymentForm(true)}>I've Made Payment</button>
                    </div>
                  </>
                ) : (
                  <form onSubmit={handleSubmitPayment}>
                    <h4 style={{ color: 'var(--ink)', marginBottom: '16px' }}>Submit Payment Details</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--gray)', fontSize: '0.9rem' }}>Transaction ID / UTR Number *</label>
                        <input type="text" value={utrNumber} onChange={e => setUtrNumber(e.target.value)} required placeholder="e.g. 312345678901" style={{ width: '100%', padding: '12px', background: '#fff', border: '1px solid var(--gray-line)', color: 'var(--ink)', borderRadius: '4px' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--gray)', fontSize: '0.9rem' }}>Additional Notes (Optional)</label>
                        <input type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Paid via Google Pay" style={{ width: '100%', padding: '12px', background: '#fff', border: '1px solid var(--gray-line)', color: 'var(--ink)', borderRadius: '4px' }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button type="submit" className="pdash-btn pdash-btn-primary">Submit for Verification</button>
                      <button type="button" className="pdash-btn pdash-btn-ghost" onClick={() => setShowPaymentForm(false)}>Cancel</button>
                    </div>
                  </form>
                )}
              </>
            )}

            {invoice.status === 'PAYMENT_SUBMITTED' && (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⏳</div>
                <h3 style={{ color: 'var(--ink)', marginBottom: '8px' }}>Payment Submitted Successfully</h3>
                <p style={{ color: 'var(--gray)' }}>Your payment is currently under verification. We will update the invoice status shortly.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </>
  );
}
