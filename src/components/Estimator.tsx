'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ESTIMATOR } from '../lib/data';
import { logActivity, getSessionId } from '@/lib/tracking';

type ServiceKey = keyof typeof ESTIMATOR;

function EstimatorWizard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    fetch('/api/user/data', { credentials: 'include' }).then(res => setIsAuth(res.ok));
  }, []);
  
  // Step 1: Pick Service, 2: Review Base, 3: Add-ons, 4: Estimate Summary
  const [step, setStep] = useState(1);
  const [service, setService] = useState<ServiceKey>('business');
  const [selected, setSelected] = useState<Record<ServiceKey, string[]>>({
    business: [],
    college: [],
    graphic: [],
  });
  
  const [showConsultForm, setShowConsultForm] = useState(false);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [showSaveEstimate, setShowSaveEstimate] = useState(false);
  const [saveEmail, setSaveEmail] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState<'none' | 'discuss' | 'submit'>('none');

  useEffect(() => {
    const s = searchParams.get('service');
    if (s && Object.keys(ESTIMATOR).includes(s)) {
      setService(s as ServiceKey);
      // Auto-select addon if passed (e.g. ?service=business&addon=ecom,payment)
      const addon = searchParams.get('addon');
      if (addon) {
        const addons = addon.split(',');
        setSelected(prev => ({ ...prev, [s]: addons }));
      }
      setStep(2); // Jump straight to step 2 for that service
    }
  }, [searchParams]);

  const cfg = ESTIMATOR[service];
  const serviceSelections = selected[service];

  let total = cfg.base;
  const lines = [{ label: cfg.baseLabel, price: cfg.base }];
  cfg.options.forEach((o) => {
    if (serviceSelections.includes(o.id)) {
      total += o.price;
      lines.push({ label: o.t, price: o.price });
    }
  });

  const toggleOption = (id: string) => {
    setSelected((prev) => {
      const current = prev[service];
      const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
      return { ...prev, [service]: next };
    });
  };

  const handleGhostTrack = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>, fieldName: string) => {
    const val = e.target.value.trim();
    if (val.length > 3) {
      logActivity('partial_lead', { field: fieldName, value: val });
    }
  };

  const handleSaveEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    if (saveEmail) {
      logActivity('saved_estimate', { email: saveEmail, service, selected: serviceSelections, total });
      alert('Your estimate has been saved! We will email you a copy shortly.');
      setShowSaveEstimate(false);
    }
  };

  const renderSuccess = (type: 'discuss' | 'submit') => (
    <>
      <div className="success-overlay">
        <div className="success-modal">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <svg className="success-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="success-checkmark__circle" cx="26" cy="26" r="25" />
              <path className="success-checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', color: '#fff', fontWeight: 'bold' }}>
            {type === 'submit' ? "Project Submitted Successfully 🎉" : "Request Submitted!"}
          </h2>
          <div style={{ color: '#94a3b8', marginBottom: '32px', fontSize: '0.95rem', lineHeight: '1.5' }}>
            {type === 'submit' ? (
              <>
                Your project request has been received successfully.<br /><br />
                Your invoice has been generated and is available inside:<br />
                <strong style={{ color: '#fff' }}>Profile → My Invoices</strong>
              </>
            ) : (
              "Our team will contact you shortly to schedule a scoping call."
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {type === 'submit' && (
              <button className="btn btn-yellow btn-block" onClick={() => router.push('/profile/invoices')}>
                View Invoice
              </button>
            )}
            <button className={type === 'submit' ? "btn btn-outline btn-block" : "btn btn-yellow btn-block"} 
                    style={type === 'submit' ? { color: '#fff', borderColor: 'rgba(255,255,255,0.2)' } : {}}
                    onClick={() => { setSubmissionSuccess('none'); if (type === 'submit') router.push('/profile'); }}>
              {type === 'submit' ? "Go To Profile" : "Done"}
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        .success-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.85); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px); }
        .success-modal { background: var(--ink); padding: 40px; border-radius: 24px; text-align: center; max-width: 450px; width: 90%; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
        .success-checkmark { width: 80px; height: 80px; border-radius: 50%; display: block; stroke-width: 4; stroke: #0f172a; stroke-miterlimit: 10; margin: 0 auto 24px auto; }
        .success-checkmark__circle { stroke-dasharray: 166; stroke-dashoffset: 166; stroke-width: 4; stroke-miterlimit: 10; stroke: #facc15; fill: none; }
        .success-checkmark__check { transform-origin: 50% 50%; stroke-dasharray: 48; stroke-dashoffset: 48; }
      `}</style>
      <div id="estimatorRoot" style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: '1px solid var(--gray-line)', padding: '40px' }}>
      
      {/* Wizard Header / Progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', paddingBottom: '16px', borderBottom: '1px solid var(--gray-line)' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
          {step === 1 && "Step 1: Pick a Service"}
          {step === 2 && "Step 2: Base Package Details"}
          {step === 3 && "Step 3: Customise & Add Features"}
          {step === 4 && "Step 4: Review Your Estimate"}
        </h3>
        <div style={{ fontSize: '0.9rem', color: 'var(--gray)', fontWeight: 500 }}>
          Step {step} of 4
        </div>
      </div>

      <div className="estimator-wizard-body" style={{ minHeight: '300px' }}>
        
        {/* STEP 1 */}
        {step === 1 && (
          <div className="wizard-step" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {(Object.keys(ESTIMATOR) as ServiceKey[]).map((k) => (
              <div 
                key={k} 
                className="service-card"
                onClick={() => {
                  setService(k);
                  setStep(2);
                }}
                style={{
                  border: '1px solid var(--gray-line)',
                  borderRadius: '12px',
                  padding: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: service === k ? 'var(--paper-warm)' : '#fff',
                  borderColor: service === k ? 'var(--yellow)' : 'var(--gray-line)',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--ink)' }}>{ESTIMATOR[k].label}</div>
                <div style={{ marginTop: '12px', color: 'var(--gray)', fontSize: '0.9rem' }}>Starts at ₹{ESTIMATOR[k].base.toLocaleString('en-IN')}</div>
              </div>
            ))}
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="wizard-step">
            <h4 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>{cfg.baseLabel}</h4>
            <p style={{ color: 'var(--gray)', marginBottom: '24px', fontSize: '1.05rem' }}>{(cfg as any).baseDesc}</p>
            
            <div style={{ background: 'var(--paper-warm)', padding: '24px', borderRadius: '12px', marginBottom: '32px' }}>
              <div style={{ fontWeight: 600, marginBottom: '16px', color: 'var(--ink)' }}>What's included in the base price (₹{cfg.base.toLocaleString('en-IN')}):</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {((cfg as any).baseIncludes || []).map((item: string, idx: number) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--ink-soft)' }}>
                    <span style={{ color: 'var(--yellow-deep)', fontWeight: 'bold' }}>✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
              <button className="btn btn-primary" onClick={() => setStep(3)}>Next: Add Custom Features</button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="wizard-step">
            <p style={{ color: 'var(--gray)', marginBottom: '24px' }}>Select any additional features you need. The price will update automatically.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginBottom: '32px' }}>
              {cfg.options.map((o) => (
                <label 
                  key={o.id} 
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    border: '1px solid',
                    borderColor: serviceSelections.includes(o.id) ? 'var(--yellow)' : 'var(--gray-line)',
                    background: serviceSelections.includes(o.id) ? 'var(--paper-warm)' : '#fff',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <input
                      type="checkbox"
                      checked={serviceSelections.includes(o.id)}
                      onChange={() => toggleOption(o.id)}
                      style={{ width: '20px', height: '20px', accentColor: 'var(--ink)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{o.t}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--gray)' }}>{o.d}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 600, color: 'var(--ink)' }}>+₹{o.price.toLocaleString('en-IN')}</div>
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn-outline" onClick={() => setStep(2)}>Back</button>
              <button className="btn btn-yellow" onClick={() => setStep(4)}>Review Final Estimate</button>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="wizard-step">
            <div style={{ background: 'var(--paper-warm)', padding: '32px', borderRadius: '12px', marginBottom: '32px' }}>
              <h4 style={{ fontSize: '1.2rem', margin: '0 0 24px 0', paddingBottom: '16px', borderBottom: '1px solid var(--gray-line)' }}>Estimate Summary</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                {lines.map((l, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ink-soft)' }}>
                    <span>{l.label}</span>
                    <span>₹{l.price.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', borderTop: '2px solid var(--ink)' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>Total</span>
                <span style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: 'var(--display)' }}>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button className="btn btn-primary btn-block" onClick={() => { 
                if (!isAuth) {
                  alert('Please log in or create an account to submit projects.');
                  router.push('/login?mode=signup&returnUrl=/estimate');
                  return;
                }
                setShowSubmitForm(true); setShowConsultForm(false); 
              }}>
                Submit & Start Project
              </button>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => { 
                  if (!isAuth) {
                    alert('Please log in or create an account to discuss projects.');
                    router.push('/login?mode=signup&returnUrl=/estimate');
                    return;
                  }
                  setShowConsultForm(true); setShowSubmitForm(false); 
                }}>
                  Discuss with Team
                </button>
                <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowSaveEstimate(true)}>
                  Email me this
                </button>
              </div>

              <button style={{ background: 'none', border: 'none', color: 'var(--gray)', textDecoration: 'underline', marginTop: '16px', cursor: 'pointer' }} onClick={() => setStep(1)}>
                Start Over
              </button>
            </div>

            {/* Email Save Form */}
            {showSaveEstimate && !showSubmitForm && !showConsultForm && (
              <form onSubmit={handleSaveEstimate} style={{ marginTop: '24px', padding: '16px', background: '#fff', border: '1px solid var(--gray-line)', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.9rem', margin: '0 0 12px 0', fontWeight: 600 }}>Where should we send it?</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="email" placeholder="you@email.com" required value={saveEmail} onChange={(e) => setSaveEmail(e.target.value)} onBlur={(e) => handleGhostTrack(e, 'email_save_estimate')} style={{ flex: 1, padding: '12px', borderRadius: '4px', border: '1px solid var(--gray-line)' }} />
                  <button type="submit" className="btn btn-primary">Send</button>
                </div>
              </form>
            )}

            {/* Submit Forms Modal */}
            {submissionSuccess !== 'none' && renderSuccess(submissionSuccess)}

            {(showConsultForm || showSubmitForm) && submissionSuccess === 'none' && (
              <div className="success-overlay" onClick={() => { setShowConsultForm(false); setShowSubmitForm(false); }}>
                <div className="success-modal" style={{ background: '#fff', color: 'var(--ink)', padding: '32px', textAlign: 'left', position: 'relative', border: 'none' }} onClick={e => e.stopPropagation()}>
                  <button type="button" onClick={() => { setShowConsultForm(false); setShowSubmitForm(false); }} style={{ position: 'absolute', top: '24px', right: '24px', background: 'var(--paper-warm)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', cursor: 'pointer', color: 'var(--ink)', zIndex: 50 }}>✕</button>
                  
                  {showConsultForm && (
                    <div className="reveal in">
                      <h3 style={{ marginBottom: '8px', color: 'var(--ink)' }}>Discuss your project</h3>
                      <p style={{ color: 'var(--gray)', marginBottom: '24px', fontSize: '0.95rem' }}>We'll reply shortly to schedule a scoping call.</p>
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const projectName = formData.get('projectName') as string;
                        const phone = formData.get('phone') as string;
                        const email = formData.get('email') as string;
                        const query = formData.get('query') as string;
                        try {
                          const res = await fetch('/api/submit', {
                            method: 'POST',
                            credentials: 'include',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ sessionId: getSessionId(), servicesSelected: { category: service, features: serviceSelections }, totalEstimate: total, status: 'DISCUSS', contactName: projectName, contactPhone: phone, contactEmail: email, message: query })
                          });
                          if (res.ok) {
                            setSubmissionSuccess('discuss');
                          } else {
                            const errData = await res.json().catch(() => ({}));
                            alert(errData.error || 'Something went wrong. Please try again.');
                          }
                        } catch (err) { alert('Network error. Please check your connection and try again.'); }
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
                          <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>Project / Your Name</label>
                            <input name="projectName" required placeholder="e.g. My Next.js App" style={{ width: '100%', padding: '12px', border: '1px solid var(--gray-line)', borderRadius: '8px' }} />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>Phone / WhatsApp</label>
                            <input name="phone" required placeholder="+91 0000000000" style={{ width: '100%', padding: '12px', border: '1px solid var(--gray-line)', borderRadius: '8px' }} />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>Email Address</label>
                            <input name="email" type="email" required placeholder="you@email.com" style={{ width: '100%', padding: '12px', border: '1px solid var(--gray-line)', borderRadius: '8px' }} />
                          </div>
                        </div>
                        <textarea name="query" required rows={3} placeholder="What's unclear or what would you like to discuss?" style={{ width: '100%', padding: '12px', border: '1px solid var(--gray-line)', borderRadius: '8px', marginBottom: '24px' }}></textarea>
                        <button type="submit" className="btn btn-primary btn-block">Request a call</button>
                      </form>
                    </div>
                  )}

                  {showSubmitForm && (
                    <div className="reveal in">
                      <h3 style={{ marginBottom: '8px', color: 'var(--ink)' }}>Submit your project</h3>
                      <p style={{ color: 'var(--gray)', marginBottom: '24px', fontSize: '0.95rem' }}>Your selections (₹{total.toLocaleString('en-IN')}) are attached.</p>
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const projectName = formData.get('projectName') as string;
                        const phone = formData.get('phone') as string;
                        const email = formData.get('email') as string;
                        const notes = formData.get('notes') as string;
                        try {
                          const res = await fetch('/api/submit', {
                            method: 'POST',
                            credentials: 'include',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ sessionId: getSessionId(), servicesSelected: { category: service, features: serviceSelections }, totalEstimate: total, status: 'SUBMITTED', contactName: projectName, contactPhone: phone, contactEmail: email, message: notes })
                          });
                          if (res.ok) {
                            setSubmissionSuccess('submit');
                          } else {
                            const errData = await res.json().catch(() => ({}));
                            if (res.status === 401) {
                              // Session expired mid-form
                              alert('Your session expired. Please log in again — your estimate selections are saved.');
                              router.push('/login?returnUrl=/estimate');
                            } else {
                              alert(errData.error || 'Something went wrong. Please try again.');
                            }
                          }
                        } catch (err) { alert('Network error. Please check your connection and try again.'); }
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
                          <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>Project Name</label>
                            <input name="projectName" required placeholder="e.g. Bro's WebStudio V2" style={{ width: '100%', padding: '12px', border: '1px solid var(--gray-line)', borderRadius: '8px' }} />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>Phone / WhatsApp</label>
                            <input name="phone" required placeholder="+91 0000000000" style={{ width: '100%', padding: '12px', border: '1px solid var(--gray-line)', borderRadius: '8px' }} />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>Email Address</label>
                            <input name="email" type="email" required placeholder="you@email.com" style={{ width: '100%', padding: '12px', border: '1px solid var(--gray-line)', borderRadius: '8px' }} />
                          </div>
                        </div>
                        <textarea name="notes" rows={3} placeholder="Deadline, references, anything specific" style={{ width: '100%', padding: '12px', border: '1px solid var(--gray-line)', borderRadius: '8px', marginBottom: '24px' }}></textarea>
                        <button type="submit" className="btn btn-yellow btn-block">Confirm submission</button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
    </>
  );
}

export default function Estimator() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '100px 0' }}>Loading Estimator...</div>}>
      <EstimatorWizard />
    </Suspense>
  );
}
