'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProfileOverview() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/data')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          setSubmissions(data.submissions || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ padding: '40px', color: 'var(--gray)' }}>Loading overview...</div>;
  }

  const discountClaimed = submissions.some(s => s.servicesSelected.includes('DISCOUNT_CLAIM'));

  return (
    <>
      {discountClaimed && (
        <div className="pdash-discount">
          <div className="discount-text">
            <h3>🎉 10% Premium Discount Unlocked</h3>
            <p>Apply this code on your next project request.</p>
          </div>
          <div className="discount-code">BWS10</div>
        </div>
      )}

      {submissions.length === 0 ? (
        <div className="pdash-section">
          <div className="pdash-section-header">
            <h3>Getting Started</h3>
            <p>You haven't requested any project estimates yet. What would you like to do?</p>
          </div>
          
          <div className="pdash-action-cards">
            <Link href="/estimate" className="pdash-action-card">
              <div className="card-icon glow-yellow">🚀</div>
              <h4>Start a Project</h4>
              <p>Get a precise cost estimate instantly.</p>
            </Link>
            
            <Link href="/website-for-business" className="pdash-action-card">
              <div className="card-icon glow-blue">💻</div>
              <h4>Explore Services</h4>
              <p>See our premium web solutions.</p>
            </Link>

            <a href="https://wa.me/918368079768" target="_blank" rel="noreferrer" className="pdash-action-card">
              <div className="card-icon glow-green">💬</div>
              <h4>Chat Support</h4>
              <p>Talk directly with our lead developers.</p>
            </a>
          </div>
        </div>
      ) : (
        <div className="pdash-section">
          <div className="pdash-section-header">
            <h3>Your Projects</h3>
            <p>Track your estimates and active builds.</p>
          </div>
          <div className="pdash-submissions">
            {submissions.map((sub) => (
              <div key={sub.id} className="pdash-sub-card">
                <div className="sub-header">
                  <h4>{sub.servicesSelected.includes('DISCOUNT_CLAIM') ? 'Discount Claim' : 'Project Estimate'}</h4>
                  <span className={`sub-status badge-${sub.status.toLowerCase()}`}>
                    {sub.status}
                  </span>
                </div>
                
                <div className="sub-body">
                  {sub.totalEstimate > 0 && (
                    <div className="sub-price">
                      ₹{sub.totalEstimate.toLocaleString()}
                    </div>
                  )}
                  {sub.servicesSelected !== '["DISCOUNT_CLAIM"]' && (
                    <div className="sub-services">
                      {sub.servicesSelected.replace(/[\[\]"]/g, '').split(',').map((s: string, i: number) => (
                        <span key={i} className="service-tag">{s.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="sub-footer">
                  Requested on {new Date(sub.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
