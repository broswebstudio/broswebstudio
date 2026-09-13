"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, Monitor, GraduationCap, Palette, Building2, User, CheckCircle2 } from "lucide-react";

export default function ProjectEstimator() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    fetch('/api/user/data').then(res => setIsAuth(res.ok));
  }, []);
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<"website" | "college" | "design" | "">("");
  const [target, setTarget] = useState<"business" | "personal" | "college" | "">("");
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [techStack, setTechStack] = useState("");
  const [deadline, setDeadline] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState<Record<string, boolean>>({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const featureConfigs = {
    website: [
      { id: "frontend", name: "High-Performance Frontend (React/Next.js)", price: 400, desc: "Fast, responsive UI" },
      { id: "backend", name: "Custom Backend & API (Node.js)", price: 500, desc: "Secure server logic" },
      { id: "database", name: "Database Design (SQL/NoSQL)", price: 300, desc: "Data storage & management" },
      { id: "auth", name: "User Authentication", price: 200, desc: "Login/Signup systems" },
      { id: "ecommerce", name: "E-Commerce / Payment Gateway", price: 400, desc: "Stripe/Razorpay integration" },
      { id: "seo", name: "Advanced SEO & Analytics", price: 150, desc: "Rank higher on Google" },
    ],
    college: [
      { id: "minor", name: "Minor Project", price: 150, desc: "Basic frontend/UI only" },
      { id: "major", name: "Major Project", price: 350, desc: "Full-Stack with Database" },
      { id: "report", name: "Project Report & Synopsis", price: 50, desc: "Ready-to-print IEEE format" },
      { id: "setup", name: "1-on-1 Explanation Session", price: 100, desc: "We explain the code to you" },
    ],
    design: [
      { id: "logo", name: "Custom Brand Logo", price: 150, desc: "Vector logo files" },
      { id: "social", name: "Social Media Kit", price: 100, desc: "10 customized posts" },
      { id: "uiux", name: "Complete UI/UX Prototype", price: 300, desc: "Figma interactive design" },
      { id: "branding", name: "Full Branding Guidelines", price: 200, desc: "Colors, typography, assets" },
    ]
  };

  useEffect(() => {
    let total = 0;
    if (category) {
      featureConfigs[category].forEach((f) => {
        if (selectedFeatures[f.id]) {
          total += f.price;
        }
      });
    }
    setTotalPrice(total);

    const saveState = async () => {
      const sessionId = sessionStorage.getItem("bws_session_id");
      if (sessionId && step === 4) {
        await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            servicesSelected: { category, target, projectName, projectDesc, techStack, deadline, features: selectedFeatures },
            totalEstimate: total,
            status: "ABANDONED"
          })
        });
      }
    };
    
    const timeout = setTimeout(saveState, 1000);
    return () => clearTimeout(timeout);
  }, [selectedFeatures, category, step, target, projectName, projectDesc]);

  const toggleFeature = (id: string) => {
    setSelectedFeatures(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const submitProject = async (status: string) => {
    if (!isAuth) {
      alert('Please log in or create an account to submit projects.');
      router.push('/login?mode=signup');
      return;
    }
    setIsSubmitting(true);
    const sessionId = sessionStorage.getItem("bws_session_id");
    if (sessionId) {
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          servicesSelected: { category, target, projectName, projectDesc, techStack, deadline, features: selectedFeatures },
          totalEstimate: totalPrice,
          status: status
        })
      });
      setShowSuccessModal(true);
    }
    setIsSubmitting(false);
  };

  // Helper to get nice names for summary
  const getCategoryName = () => {
    if (category === "website") return "Website / Web App";
    if (category === "college") return "College Project";
    if (category === "design") return "Graphic Designing";
    return "Not selected";
  };
  
  const getTargetName = () => {
    if (target === "business") return "Business / Agency";
    if (target === "personal") return "Personal / Portfolio";
    if (target === "college") return "College / Academic";
    return "Not selected";
  };

  return (
    <section id="estimator" className="section" style={{ padding: '40px 0' }}>
      <div className="container split-screen-container">
        
        {/* Left Panel (Sticky Summary) */}
        <div className="split-left">
          <div style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-accent)', padding: '20px', borderRadius: 'var(--border-radius)', textAlign: 'center', marginBottom: '20px', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 4px 15px rgba(250, 204, 21, 0.4)' }}>
            🎁 Special Offer: Get a FREE Marketing & Business Video with every Website Project!
          </div>

          <div className="glass-card" style={{ padding: '30px', backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: 'var(--color-accent)', margin: 0 }}>Live Estimate</h3>
            <div className="price-display" style={{ margin: '10px 0 20px 0', fontSize: '3.5rem' }}>
              ${totalPrice}
            </div>
            
            <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
              <h4 style={{ marginBottom: '15px', fontSize: '1rem', color: '#666' }}>Your Selections:</h4>
              
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.95rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={16} color={step > 1 ? "var(--color-secondary)" : "#ccc"} />
                  <span style={{ color: step > 1 ? 'var(--color-accent)' : '#999', fontWeight: step > 1 ? 600 : 400 }}>Type: {step > 1 ? getCategoryName() : "..."}</span>
                </li>
                
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={16} color={step > 2 ? "var(--color-secondary)" : "#ccc"} />
                  <span style={{ color: step > 2 ? 'var(--color-accent)' : '#999', fontWeight: step > 2 ? 600 : 400 }}>For: {step > 2 ? getTargetName() : "..."}</span>
                </li>

                {step > 3 && projectName && (
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 size={16} color="var(--color-secondary)" />
                    <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Project: {projectName}</span>
                  </li>
                )}
              </ul>
              
              {/* Selected Features List */}
              {step === 4 && Object.keys(selectedFeatures).some(k => selectedFeatures[k]) && (
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px', borderLeft: '3px solid var(--color-secondary)' }}>
                  <strong style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Included Features:</strong>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', color: '#555', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {featureConfigs[category as keyof typeof featureConfigs].filter(f => selectedFeatures[f.id]).map(f => (
                      <li key={f.id}>+ {f.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel (Wizard Content) */}
        <div className="split-right">
          <div className="glass-card" style={{ padding: '50px', minHeight: '600px', display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', position: 'relative' }}>
            
            {/* Top Progress Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '50px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '4px', backgroundColor: '#e2e8f0', zIndex: 0, transform: 'translateY(-50%)' }}>
                <div style={{ width: `${((step - 1) / 3) * 100}%`, height: '100%', backgroundColor: 'var(--color-accent)', transition: 'width 0.3s ease' }}></div>
              </div>
              {[1, 2, 3, 4].map((num) => (
                <div key={num} style={{ 
                  width: '35px', height: '35px', borderRadius: '50%', 
                  backgroundColor: step >= num ? 'var(--color-accent)' : '#e2e8f0', 
                  color: step >= num ? 'var(--color-secondary)' : '#94a3b8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
                  zIndex: 1, transition: 'all 0.3s ease', boxShadow: step === num ? '0 0 0 4px rgba(0,0,0,0.1)' : 'none'
                }}>
                  {num}
                </div>
              ))}
            </div>

            {/* STEP 1: Category */}
            {step === 1 && (
              <div className="animate-fade-in" style={{ flex: 1 }}>
                <h2 style={{ textAlign: 'left', marginBottom: '10px' }}>What do you want to build?</h2>
                <p style={{ textAlign: 'left', color: '#666', marginBottom: '40px' }}>Select the primary service you are looking for.</p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                  {[
                    { id: 'website', title: 'Website / Web App', icon: <Monitor size={32} /> },
                    { id: 'college', title: 'College Project', icon: <GraduationCap size={32} /> },
                    { id: 'design', title: 'Graphic Designing', icon: <Palette size={32} /> },
                  ].map((cat) => (
                    <div 
                      key={cat.id} 
                      onClick={() => { setCategory(cat.id as any); setSelectedFeatures({}); nextStep(); }}
                      className={`hover-card ${category === cat.id ? 'selected' : ''}`}
                      style={{
                        flex: '1 1 200px', padding: '40px 20px', textAlign: 'center', borderRadius: '16px', cursor: 'pointer'
                      }}
                    >
                      <div className="card-icon" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>{cat.icon}</div>
                      <h3 className="card-title" style={{ margin: 0, fontSize: '1.2rem' }}>{cat.title}</h3>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Target Audience */}
            {step === 2 && (
              <div className="animate-fade-in" style={{ flex: 1 }}>
                <h2 style={{ textAlign: 'left', marginBottom: '10px' }}>Who is this for?</h2>
                <p style={{ textAlign: 'left', color: '#666', marginBottom: '40px' }}>Help us understand the target audience of your project.</p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                  {[
                    { id: 'business', title: 'Business / Agency', icon: <Building2 size={32} /> },
                    { id: 'personal', title: 'Personal / Portfolio', icon: <User size={32} /> },
                    { id: 'college', title: 'College / Academic', icon: <GraduationCap size={32} /> },
                  ].map((tgt) => (
                    <div 
                      key={tgt.id} 
                      onClick={() => { setTarget(tgt.id as any); nextStep(); }}
                      className={`hover-card ${target === tgt.id ? 'selected' : ''}`}
                      style={{
                        flex: '1 1 200px', padding: '40px 20px', textAlign: 'center', borderRadius: '16px', cursor: 'pointer'
                      }}
                    >
                      <div className="card-icon" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>{tgt.icon}</div>
                      <h3 className="card-title" style={{ margin: 0, fontSize: '1.2rem' }}>{tgt.title}</h3>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: Project Details */}
            {step === 3 && (
              <div className="animate-fade-in" style={{ flex: 1 }}>
                <h2 style={{ textAlign: 'left', marginBottom: '10px' }}>Project Basics</h2>
                <p style={{ textAlign: 'left', color: '#666', marginBottom: '40px' }}>Give your project a name and brief description. (We'll grab your contact info at login)</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', maxWidth: '600px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600, fontSize: '1.05rem', color: 'var(--color-accent)' }}>
                      {category === 'college' ? 'Project Topic / Title *' : 'Project Name *'}
                    </label>
                    <input 
                      type="text" 
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder={category === 'college' ? "e.g. Real-time Chat App" : "e.g. My E-Commerce Store"} 
                      style={{ width: '100%', padding: '18px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem', outline: 'none', transition: 'all 0.3s' }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--color-secondary)'}
                      onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600, fontSize: '1.05rem', color: 'var(--color-accent)' }}>
                      {category === 'college' ? 'Project Requirements / Features (Optional)' : 'Short Description (Optional)'}
                    </label>
                    <textarea 
                      value={projectDesc}
                      onChange={(e) => setProjectDesc(e.target.value)}
                      placeholder="Tell us a little bit about what you need..." 
                      rows={5}
                      style={{ width: '100%', padding: '18px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem', outline: 'none', resize: 'none', transition: 'all 0.3s' }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--color-secondary)'}
                      onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </div>

                  {category === 'college' && (
                    <>
                      <div>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600, fontSize: '1.05rem', color: 'var(--color-accent)' }}>Preferred Tech Stack</label>
                        <input 
                          type="text" 
                          value={techStack}
                          onChange={(e) => setTechStack(e.target.value)}
                          placeholder="e.g. MERN, Python Django, Java, or 'Suggest me'" 
                          style={{ width: '100%', padding: '18px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem', outline: 'none', transition: 'all 0.3s' }}
                          onFocus={(e) => e.target.style.borderColor = 'var(--color-secondary)'}
                          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600, fontSize: '1.05rem', color: 'var(--color-accent)' }}>College Deadline</label>
                        <input 
                          type="date" 
                          value={deadline}
                          onChange={(e) => setDeadline(e.target.value)}
                          style={{ width: '100%', padding: '18px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem', outline: 'none', transition: 'all 0.3s' }}
                          onFocus={(e) => e.target.style.borderColor = 'var(--color-secondary)'}
                          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                      </div>
                    </>
                  )}
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                    <button onClick={prevStep} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: '1.05rem' }}>
                      <ArrowLeft size={20} style={{ marginRight: '8px' }} /> Back
                    </button>
                    <button 
                      className="btn btn-primary" 
                      onClick={nextStep} 
                      disabled={!projectName.trim()}
                      style={{ padding: '15px 30px', fontSize: '1.05rem', display: 'flex', alignItems: 'center', opacity: !projectName.trim() ? 0.5 : 1 }}
                    >
                      Continue to Features <ArrowRight style={{ marginLeft: '10px' }} size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Features & Estimate */}
            {step === 4 && (
              <div className="animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ textAlign: 'left', marginBottom: '10px' }}>Customize Your Features</h2>
                <p style={{ textAlign: 'left', color: '#666', marginBottom: '30px' }}>Select the specific tech stack and features for your {getCategoryName()}.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', overflowY: 'auto', paddingRight: '10px', flex: 1 }}>
                  {category && featureConfigs[category].map(f => (
                    <div 
                      key={f.id} 
                      className={`hover-card feature-card ${selectedFeatures[f.id] ? 'selected' : ''}`}
                      onClick={() => toggleFeature(f.id)}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '25px', borderRadius: '12px', cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', zIndex: 2 }}>
                        <div className="checkbox-ring" style={{ width: '28px', height: '28px' }}>
                          {selectedFeatures[f.id] && <div className="checkbox-dot" style={{ width: '12px', height: '12px' }}></div>}
                        </div>
                        <div>
                          <div className="feature-title" style={{ fontSize: '1.15rem', marginBottom: '4px' }}>{f.name}</div>
                          <div className="feature-desc" style={{ fontSize: '0.95rem' }}>{f.desc}</div>
                        </div>
                      </div>
                      <div className="feature-price" style={{ fontSize: '1.25rem' }}>+${f.price}</div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '30px' }}>
                  <button onClick={prevStep} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: '1.05rem' }}>
                    <ArrowLeft size={20} style={{ marginRight: '8px' }} /> Back
                  </button>
                  
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <button 
                      className="btn" 
                      style={{ backgroundColor: 'white', color: 'var(--color-accent)', border: '2px solid var(--color-accent)' }}
                      onClick={() => submitProject("DISCUSS")}
                      disabled={isSubmitting || totalPrice === 0}
                    >
                      Discuss First
                    </button>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => submitProject("SUBMITTED")}
                      disabled={isSubmitting || totalPrice === 0}
                      style={{ padding: '15px 30px' }}
                    >
                      Submit Project
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Back button for Step 2 */}
            {step === 2 && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '40px' }}>
                <button onClick={prevStep} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: '1.05rem' }}>
                  <ArrowLeft size={20} style={{ marginRight: '8px' }} /> Back
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div 
          className="success-overlay" 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div 
            className="success-modal" 
            style={{ background: '#fff', padding: '40px', borderRadius: '24px', textAlign: 'center', maxWidth: '400px', width: '90%', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <svg 
                className="success-checkmark" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 52 52"
                style={{ width: '80px', height: '80px', borderRadius: '50%', display: 'block', strokeWidth: 4, stroke: '#0f172a', strokeMiterlimit: 10, boxShadow: 'inset 0px 0px 0px #facc15' }}
              >
                <circle className="success-checkmark__circle" cx="26" cy="26" r="25" fill="none" style={{ stroke: '#facc15', strokeWidth: 4, strokeMiterlimit: 10 }} />
                <path className="success-checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>
            
            <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#0f172a', fontWeight: 'bold' }}>Request Submitted!</h2>
            <p style={{ color: '#64748b', marginBottom: '30px', lineHeight: 1.5, fontSize: '1rem' }}>
              Our team will contact you in 1 to 2 business days to discuss the next steps.
            </p>
            <button 
              className="btn btn-yellow btn-block" 
              style={{ width: '100%', padding: '14px', fontSize: '1.05rem', fontWeight: 600, borderRadius: '999px', backgroundColor: '#facc15', color: '#0f172a', border: 'none', cursor: 'pointer' }}
              onClick={() => {
                setShowSuccessModal(false);
                setStep(1);
                setCategory("");
                setTarget("");
                setProjectName("");
                setProjectDesc("");
                setTechStack("");
                setDeadline("");
                setSelectedFeatures({});
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
