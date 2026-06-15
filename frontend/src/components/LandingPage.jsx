import React, { useState, useEffect, useRef } from 'react';
import Auth from './Auth';

export default function LandingPage({ onAuthSuccess }) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [initialIsLogin, setInitialIsLogin] = useState(true);
  
  // Stats Counters state
  const [rentAudited, setRentAudited] = useState(0);
  const [invoicesGenerated, setInvoicesGenerated] = useState(0);
  const [verificationRate, setVerificationRate] = useState(0);

  // Shifting Taglines
  const taglines = ["Utility Auditing", "Rent Ledgers", "Instant PDF Receipts", "Camera Meter Proofs"];
  const [tagIndex, setTagIndex] = useState(0);
  const [fadeTag, setFadeTag] = useState(true);

  // Interactive Live Simulator state
  const [simMeterReading, setSimMeterReading] = useState(1420);
  const [simElecUnits, setSimElecUnits] = useState(120);
  const [simElecCost, setSimElecCost] = useState(18);
  const [simTotal, setSimTotal] = useState(1283);
  const [simStatus, setSimStatus] = useState('Paid');

  // Simulator interval
  useEffect(() => {
    const simInterval = setInterval(() => {
      setSimMeterReading(prev => {
        const nextVal = prev + 1;
        const basePrevious = 1300;
        const newUnits = nextVal - basePrevious;
        const newCost = newUnits * 0.15;
        setSimElecUnits(newUnits);
        setSimElecCost(parseFloat(newCost.toFixed(2)));
        setSimTotal(parseFloat((1200 + newCost + 20 + 45).toFixed(2))); // Rent + Elec + Water + Wifi
        return nextVal;
      });
      // Toggle status randomly to show interactivity
      setSimStatus(prev => prev === 'Paid' ? 'Pending Audit' : 'Paid');
    }, 4500);

    return () => clearInterval(simInterval);
  }, []);

  // Taglines rotation
  useEffect(() => {
    const tagInterval = setInterval(() => {
      setFadeTag(false);
      setTimeout(() => {
        setTagIndex(prev => (prev + 1) % taglines.length);
        setFadeTag(true);
      }, 400);
    }, 3000);

    return () => clearInterval(tagInterval);
  }, []);

  // Count up animation for stats
  useEffect(() => {
    let rentStart = 0;
    const rentTarget = 4289300;
    const rentDuration = 2000;
    const rentStep = Math.floor(rentTarget / (rentDuration / 16));

    let invoicesStart = 0;
    const invoicesTarget = 28490;
    const invoicesDuration = 2000;
    const invoicesStep = Math.floor(invoicesTarget / (invoicesDuration / 16));

    let rateStart = 0;
    const rateTarget = 99.98;
    const rateDuration = 2000;
    const rateStep = rateTarget / (rateDuration / 16);

    const statsTimer = setInterval(() => {
      rentStart += rentStep;
      if (rentStart >= rentTarget) {
        setRentAudited(rentTarget);
      } else {
        setRentAudited(rentStart);
      }

      invoicesStart += invoicesStep;
      if (invoicesStart >= invoicesTarget) {
        setInvoicesGenerated(invoicesTarget);
      } else {
        setInvoicesGenerated(invoicesStart);
      }

      rateStart += rateStep;
      if (rateStart >= rateTarget) {
        setVerificationRate(rateTarget);
        clearInterval(statsTimer);
      } else {
        setVerificationRate(parseFloat(rateStart.toFixed(2)));
      }
    }, 16);

    return () => clearInterval(statsTimer);
  }, []);

  const openAuth = (isLoginMode) => {
    setInitialIsLogin(isLoginMode);
    setShowAuthModal(true);
  };

  const closeAuth = () => {
    setShowAuthModal(false);
  };

  if (showAuthModal) {
    return <Auth onAuthSuccess={onAuthSuccess} initialIsLogin={initialIsLogin} onClose={closeAuth} />;
  }

  return (
    <div style={styles.container}>
      <style>{landingCss}</style>

      {/* Atmospheric Glowing Orbs */}
      <div className="glow-orb orb-indigo" style={{ ...styles.orb, ...styles.orbIndigo }}></div>
      <div className="glow-orb orb-violet" style={{ ...styles.orb, ...styles.orbViolet }}></div>
      <div className="glow-orb orb-pink" style={{ ...styles.orb, ...styles.orbPink }}></div>
      <div className="scrolling-grid-overlay"></div>

      {/* Navigation Header */}
      <nav style={styles.nav}>
        <div style={styles.logoGroup}>
          <div style={styles.logoIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={styles.logoSvg}>
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span style={styles.logoText}>RentTrace</span>
        </div>
        <div style={styles.navMenu} className="landing-nav-menu">
          <a href="#features" style={styles.navLink}>Features</a>
          <a href="#tech" style={styles.navLink}>Stack</a>
          <a href="#metrics" style={styles.navLink}>Stats</a>
        </div>
        <div style={styles.navAuthButtons}>
          <button onClick={() => openAuth(true)} style={styles.btnNavSignIn}>Sign In</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header style={styles.heroSection} className="hero-section">
        <div style={styles.heroLeft} className="hero-left">
          <div className="badge-wrapper" style={styles.heroBadge}>
            <span style={styles.badgePing}></span>
            <span>Version 1.0 Live</span>
          </div>
          
          <h1 style={styles.heroTitle} className="hero-title">
            Transparent <br />
            <span className="shimmer-text" style={styles.gradientText}>
              {taglines[tagIndex]}
            </span>
            <br />
            For Modern Spaces.
          </h1>

          <p style={styles.heroSub} className="hero-sub">
            Take the guesswork out of monthly lease accounts. Seamlessly calculate sub-metered utility bills, capture physical evidence proofs, and compile professional invoices in one integrated dashboard.
          </p>

          <div style={styles.heroBtnGroup} className="hero-btn-group">
            <button onClick={() => openAuth(false)} style={styles.btnHeroPrimary}>
              Start Tracking Free
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
            <a href="#features" style={styles.btnHeroSecondary}>
              Explore Features
            </a>
          </div>
        </div>

        {/* Hero Right: Live Dashboard Simulator */}
        <div style={styles.heroRight}>
          <div className="live-mockup-frame" style={styles.mockupFrame}>
            {/* Header / Topbar */}
            <div style={styles.mockupHeader}>
              <div style={styles.mockupDots}>
                <span style={{ ...styles.mockDot, background: '#ef4444' }}></span>
                <span style={{ ...styles.mockDot, background: '#f59e0b' }}></span>
                <span style={{ ...styles.mockDot, background: '#10b981' }}></span>
              </div>
              <div style={styles.mockupTitle}>Ledger Simulator</div>
              <span className="live-pill" style={{
                ...styles.livePill,
                backgroundColor: simStatus === 'Paid' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                color: simStatus === 'Paid' ? '#10b981' : '#6366f1'
              }}>{simStatus}</span>
            </div>

            {/* Calculations Breakdown */}
            <div style={styles.mockupBody}>
              <div style={styles.mockupRow}>
                <span style={styles.mockLabel}>Base Rent</span>
                <span style={styles.mockVal}>₹1,200.00</span>
              </div>
              
              <div style={styles.mockupRow}>
                <span style={styles.mockLabel}>
                  Electricity Consumption
                  <small style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    ({simMeterReading} kWh - 1300 kWh) × ₹0.15
                  </small>
                </span>
                <span style={{ ...styles.mockVal, color: '#f59e0b' }}>
                  {simElecUnits} kWh (₹{simElecCost})
                </span>
              </div>

              <div style={styles.mockupRow}>
                <span style={styles.mockLabel}>Water Service Base</span>
                <span style={styles.mockVal}>₹20.00</span>
              </div>

              <div style={styles.mockupRow}>
                <span style={styles.mockLabel}>Custom Amenities (WiFi)</span>
                <span style={styles.mockVal}>₹45.00</span>
              </div>

              <hr style={styles.mockDivider} />

              <div style={{ ...styles.mockupRow, marginTop: '0.5rem' }}>
                <span style={{ ...styles.mockLabel, fontWeight: '700', color: '#fff' }}>Invoice Total</span>
                <span className="live-counter-text" style={styles.mockTotal}>
                  ₹{simTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>


      {/* Capabilities Showcase */}
      <section id="features" className="landing-section" style={styles.section}>
        <h2 style={styles.sectionHeader} className="section-header">Engineered for absolute billing clarity.</h2>
        <p style={styles.sectionSub}>No spreadsheets, no manual calculation errors, and zero tenant disputes.</p>
        
        <div style={styles.featureGrid} className="feature-grid">
          {/* Card 1 */}
          <div className="feature-hover-card" style={styles.featureCard}>
            <div style={{ ...styles.featIconWrapper, background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <h3 style={styles.featTitle}>Calculated Sub-Meter Utilities</h3>
            <p style={styles.featDesc}>Enter previous and current submeter digits. The system handles standard base rates, consumption metrics, and net amounts in seconds.</p>
          </div>

          {/* Card 2 */}
          <div className="feature-hover-card" style={styles.featureCard}>
            <div style={{ ...styles.featIconWrapper, background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
            <h3 style={styles.featTitle}>Hardware Camera Verification</h3>
            <p style={styles.featDesc}>Capture photos of electricity submeters or upload screenshot proofs directly. Ensure verifiable billing trails backed by visual evidence.</p>
          </div>

          {/* Card 3 */}
          <div className="feature-hover-card" style={styles.featureCard}>
            <div style={{ ...styles.featIconWrapper, background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <h3 style={styles.featTitle}>Verifiable Invoices & QR Codes</h3>
            <p style={styles.featDesc}>Generates premium receipts with breakdown line-items, auto-generated payment QR codes, digital signatures, and PDF print formatting.</p>
          </div>

          {/* Card 4 */}
          <div className="feature-hover-card" style={styles.featureCard}>
            <div style={{ ...styles.featIconWrapper, background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <h3 style={styles.featTitle}>Flexible Amenity Logs</h3>
            <p style={styles.featDesc}>Log independent auxiliary costs like broadband plans, cylinder gas recharges, or custom parking items with simple forms.</p>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className="landing-section" style={styles.section}>
        <h2 style={styles.sectionHeader} className="section-header">Engineered on high performance standards.</h2>
        <p style={styles.sectionSub}>RentTrace combines robust MERN architectures with optimized styles.</p>

        <div style={styles.techGrid} className="tech-grid">
          <div className="tech-card" style={styles.techCard}>
            <div className="tech-icon-circle">M</div>
            <h4>MongoDB</h4>
            <p>Flexible document schemas mapping settings configurations and payment ledgers safely.</p>
          </div>
          
          <div className="tech-card" style={styles.techCard}>
            <div className="tech-icon-circle">E</div>
            <h4>Express.js</h4>
            <p>High performance REST endpoints with rigid route guard middleware validation.</p>
          </div>

          <div className="tech-card" style={styles.techCard}>
            <div className="tech-icon-circle">R</div>
            <h4>React.js</h4>
            <p>Component-centric client state architecture, running dynamic responsive dashboard flows.</p>
          </div>

          <div className="tech-card" style={styles.techCard}>
            <div className="tech-icon-circle">N</div>
            <h4>Node.js</h4>
            <p>Optimized Javascript engine handling base64 asset serialization and JWT hashing.</p>
          </div>
        </div>
      </section>

      {/* Landing Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent} className="footer-content">
          <div style={styles.footerLeft} className="footer-left">
            <h3 style={styles.footerLogoText}>RentTrace</h3>
            <p>Handcrafted utility ledger logs & digital billing transparency system.</p>
          </div>
          <div style={styles.footerRight} className="footer-right">
            <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.4)' }}>
              © 2026 RentTrace Project. Handcrafted by Anuj Kumar Jha.
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}

// Custom Keyframes and animations for the landing page
const landingCss = `
  @keyframes gradientBg {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes floatOrb {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-30px) scale(1.15); }
  }
  @keyframes gridScroll {
    from { background-position: 0 0; }
    to { background-position: 0 40px; }
  }
  @keyframes textFade {
    0%, 100% { opacity: 0; transform: translateY(8px); }
    15%, 85% { opacity: 1; transform: translateY(0px); }
  }
  @keyframes modalSlideUp {
    from { opacity: 0; transform: translateY(50px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes pulsePing {
    0% { transform: scale(0.8); opacity: 0.5; }
    100% { transform: scale(2.4); opacity: 0; }
  }

  .glow-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(140px);
    opacity: 0.22;
    z-index: 0;
    pointer-events: none;
  }
  .orb-indigo {
    animation: floatOrb 12s ease-in-out infinite;
  }
  .orb-violet {
    animation: floatOrb 15s ease-in-out infinite 2s;
  }
  .orb-pink {
    animation: floatOrb 18s ease-in-out infinite 4s;
  }

  .scrolling-grid-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    background-size: 40px 40px;
    mask-image: radial-gradient(circle at 50% 50%, black 30%, transparent 80%);
    -webkit-mask-image: radial-gradient(circle at 50% 50%, black 30%, transparent 80%);
    pointer-events: none;
    z-index: 1;
    animation: gridScroll 15s linear infinite;
  }

  .shimmer-text {
    background: linear-gradient(to right, #6366f1, #a855f7, #ec4899, #6366f1);
    background-size: 300% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: textShimmer 6s linear infinite, textFade 3s infinite;
  }

  @keyframes textShimmer {
    0% { background-position: 0% center; }
    100% { background-position: 300% center; }
  }

  .badge-wrapper {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.35rem 0.85rem;
    border-radius: 100px;
    background: rgba(99, 102, 241, 0.1);
    border: 1px solid rgba(99, 102, 241, 0.2);
    color: #a5b4fc;
    font-size: 0.8rem;
    font-weight: 600;
  }

  .badge-ping {
    width: 6px;
    height: 6px;
    background: #6366f1;
    border-radius: 50%;
    position: relative;
  }

  .badge-ping::after {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #6366f1;
    animation: pulsePing 1.8s infinite;
  }

  .live-mockup-frame {
    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.5s;
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
  }

  .live-mockup-frame:hover {
    transform: translateY(-8px) rotateY(-2deg) rotateX(2deg);
    border-color: rgba(168, 85, 247, 0.35) !important;
  }

  .live-counter-text {
    transition: color 0.3s;
  }

  .feature-hover-card {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .feature-hover-card:hover {
    transform: translateY(-8px);
    border-color: rgba(99, 102, 241, 0.25) !important;
    background: rgba(15, 22, 38, 0.9) !important;
    box-shadow: 0 15px 30px rgba(0,0,0,0.4), 0 0 30px rgba(99, 102, 241, 0.08);
  }

  .tech-card {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .tech-card:hover {
    transform: translateY(-6px);
    border-color: rgba(255, 255, 255, 0.15) !important;
    background: rgba(255, 255, 255, 0.04) !important;
    box-shadow: 0 12px 24px rgba(0,0,0,0.3);
  }

  .tech-icon-circle {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%);
    border: 1px solid rgba(255,255,255,0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 1.1rem;
    color: #fff;
    margin-bottom: 1rem;
  }

  .modal-overlay-bg {
    animation: fadeIn 0.35s ease-out forwards;
    backdrop-filter: blur(12px) !important;
  }

  .auth-modal-card-wrapper {
    animation: modalSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* Mobile Responsiveness */
  @media (max-width: 968px) {
    .hero-section {
      grid-template-columns: 1fr !important;
      text-align: center !important;
      padding: 4rem 6vw 3rem 6vw !important;
    }
    .hero-left {
      align-items: center !important;
      text-align: center !important;
    }
    .hero-title {
      font-size: 2.8rem !important;
    }
    .hero-btn-group {
      justify-content: center !important;
    }
    .tech-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
  }

  @media (max-width: 768px) {
    .landing-nav-menu {
      display: none !important;
    }
    .hero-title {
      font-size: 2.4rem !important;
    }
    .hero-sub {
      font-size: 0.95rem !important;
    }
    .metrics-grid {
      grid-template-columns: 1fr !important;
      gap: 1.5rem !important;
    }
    .feature-grid {
      grid-template-columns: 1fr !important;
    }
    .section-header {
      font-size: 1.8rem !important;
    }
  }

  @media (max-width: 576px) {
    .hero-title {
      font-size: 2rem !important;
    }
    .tech-grid {
      grid-template-columns: 1fr !important;
    }
    .footer-content {
      flex-direction: column !important;
      text-align: center !important;
    }
    .footer-left, .footer-right {
      text-align: center !important;
    }
  }
`;

// Responsive Styles in Javascript Objects
const styles = {
  container: {
    position: 'relative',
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#070a13',
    color: '#f8fafc',
    fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
    overflowX: 'hidden',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box'
  },
  orb: {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(140px)',
    opacity: 0.18,
    zIndex: 0,
    pointerEvents: 'none'
  },
  orbIndigo: {
    top: '10%',
    right: '15%',
    width: '35vw',
    height: '35vw',
    background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)'
  },
  orbViolet: {
    top: '30%',
    left: '10%',
    width: '40vw',
    height: '40vw',
    background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)'
  },
  orbPink: {
    bottom: '15%',
    right: '10%',
    width: '30vw',
    height: '30vw',
    background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)'
  },
  nav: {
    position: 'sticky',
    top: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 4vw',
    background: 'rgba(7, 10, 19, 0.75)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    zIndex: 50,
    boxSizing: 'border-box'
  },
  logoGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem'
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
  },
  logoSvg: {
    width: '20px',
    height: '20px',
    color: '#fff'
  },
  logoText: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: '700',
    fontSize: '1.2rem',
    background: 'linear-gradient(to right, #ffffff, #c7d2fe)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.3px'
  },
  navMenu: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      display: 'none'
    }
  },
  navLink: {
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'color 0.25s'
  },
  navAuthButtons: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  },
  btnNavSignIn: {
    background: 'none',
    border: 'none',
    color: '#f8fafc',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '0.5rem 1rem',
    transition: 'opacity 0.2s'
  },
  btnNavSignUp: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '0.55rem 1.1rem',
    transition: 'all 0.3s'
  },
  heroSection: {
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: '3rem',
    alignItems: 'center',
    padding: '6rem 6vw 4rem 6vw',
    zIndex: 10,
    maxWidth: '1400px',
    margin: '0 auto',
    boxSizing: 'border-box',
    width: '100%',
    '@media (max-width: 968px)': {
      gridTemplateColumns: '1fr',
      textAlign: 'center',
      padding: '4rem 6vw 3rem 6vw'
    }
  },
  heroLeft: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '1.5rem',
    textAlign: 'left'
  },
  heroBadge: {
    marginBottom: '0.5rem'
  },
  heroTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '3.4rem',
    fontWeight: '800',
    lineHeight: '1.15',
    color: '#fff',
    letterSpacing: '-1.5px',
    margin: 0
  },
  gradientText: {
    display: 'inline-block',
    minHeight: '4.5rem'
  },
  heroSub: {
    fontSize: '1.05rem',
    lineHeight: '1.6',
    color: '#94a3b8',
    margin: 0,
    maxWidth: '520px'
  },
  heroBtnGroup: {
    display: 'flex',
    gap: '1.25rem',
    marginTop: '0.75rem',
    flexWrap: 'wrap'
  },
  btnHeroPrimary: {
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '0.95rem',
    fontWeight: '600',
    padding: '0.85rem 1.6rem',
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(99, 102, 241, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  btnHeroSecondary: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    color: '#94a3b8',
    fontSize: '0.95rem',
    fontWeight: '600',
    padding: '0.85rem 1.6rem',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'all 0.25s'
  },
  heroRight: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    perspective: '1000px',
    width: '100%'
  },
  mockupFrame: {
    background: 'rgba(15, 22, 38, 0.75)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '24px',
    width: '100%',
    maxWidth: '430px',
    padding: '1.5rem',
    boxSizing: 'border-box',
    backdropFilter: 'blur(16px)',
    textAlign: 'left'
  },
  mockupHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  mockupDots: {
    display: 'flex',
    gap: '0.4rem'
  },
  mockDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%'
  },
  mockupTitle: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.3)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: '700'
  },
  livePill: {
    fontSize: '0.75rem',
    padding: '0.25rem 0.6rem',
    borderRadius: '50px',
    fontWeight: '700',
    transition: 'all 0.3s'
  },
  mockupBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  mockupRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.85rem'
  },
  mockLabel: {
    color: '#94a3b8',
    fontWeight: '500'
  },
  mockVal: {
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'monospace'
  },
  mockDivider: {
    border: 'none',
    height: '1px',
    background: 'rgba(255, 255, 255, 0.08)'
  },
  mockTotal: {
    fontSize: '1.3rem',
    color: '#6366f1',
    fontWeight: '700',
    fontFamily: 'monospace'
  },
  mockupSignature: {
    marginTop: '1.25rem',
    background: 'rgba(16, 185, 129, 0.04)',
    border: '1px solid rgba(16, 185, 129, 0.12)',
    borderRadius: '12px',
    padding: '0.85rem 1rem'
  },
  sigHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.75rem',
    color: '#10b981',
    fontWeight: '700'
  },
  sigLine: {
    fontSize: '0.8rem',
    fontStyle: 'italic',
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: '0.35rem',
    fontFamily: "'Space Grotesk', sans-serif"
  },
  section: {
    position: 'relative',
    padding: '4rem 6vw',
    zIndex: 10,
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box'
  },
  sectionHeader: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '2.25rem',
    fontWeight: '700',
    color: '#fff',
    margin: '0 0 0.5rem 0',
    textAlign: 'center'
  },
  sectionSub: {
    fontSize: '1rem',
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: '3.5rem'
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2rem',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '1.5rem'
    }
  },
  metricBox: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '20px',
    padding: '2rem 1.5rem',
    textAlign: 'center',
    backdropFilter: 'blur(8px)'
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.75rem',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr'
    }
  },
  featureCard: {
    background: 'rgba(15, 22, 38, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '24px',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '1rem',
    boxSizing: 'border-box'
  },
  featIconWrapper: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  featTitle: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#fff',
    margin: 0
  },
  featDesc: {
    fontSize: '0.875rem',
    lineHeight: '1.55',
    color: '#94a3b8',
    margin: 0
  },
  techGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1.5rem',
    '@media (max-width: 968px)': {
      gridTemplateColumns: 'repeat(2, 1fr)'
    },
    '@media (max-width: 576px)': {
      gridTemplateColumns: '1fr'
    }
  },
  techCard: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '20px',
    padding: '1.75rem 1.5rem',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    textAlign: 'left'
  },
  footer: {
    marginTop: 'auto',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    background: 'rgba(7, 10, 19, 0.9)',
    padding: '2.5rem 6vw',
    width: '100%',
    boxSizing: 'border-box',
    zIndex: 10
  },
  footerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1.5rem',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  footerLeft: {
    textAlign: 'left'
  },
  footerLogoText: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '0.25rem'
  },
  footerRight: {
    textAlign: 'right'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0, 0, 0, 0.65)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999
  }
};
