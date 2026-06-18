import React from 'react';

export default function About() {
  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div className="content-card" style={styles.heroCard}>
        <div style={styles.logoWrapper}>
          <img src="/icon-192.png" alt="RentTrace Logo" style={{ width: '56px', height: '56px', borderRadius: '16px', objectFit: 'cover' }} />
          <div>
            <h2 style={styles.heroTitle}>RentTrace</h2>
            <p style={styles.heroSubtitle}>Version 1.0.0 (Production Build)</p>
          </div>
        </div>
        <p style={styles.heroText}>
          RentTrace is a modern utility tracking and rent ledger system designed to simplify rent management.
          By combining custom billing configurations, dynamic expense logging, and verified receipt generation
          with digital payment proofs, it brings transparency and organization to landlords and tenants alike.
        </p>
      </div>

      {/* Feature Grid */}
      <h3 style={styles.sectionHeader}>Core Capabilities</h3>
      <div style={styles.featureGrid}>
        <div className="content-card" style={styles.featureCard}>
          <div style={{ ...styles.featureIcon, background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
          </div>
          <h4 style={styles.featureTitle}>Rent & Schedule Ledger</h4>
          <p style={styles.featureDesc}>Log monthly lease statements, track payment statuses, and view outstanding dues in a unified dashboard.</p>
        </div>

        <div className="content-card" style={styles.featureCard}>
          <div style={{ ...styles.featureIcon, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <h4 style={styles.featureTitle}>Utility Consumption</h4>
          <p style={styles.featureDesc}>Compute electricity unit consumption from previous and current meter readings, complete with camera image proofs.</p>
        </div>

        <div className="content-card" style={styles.featureCard}>
          <div style={{ ...styles.featureIcon, background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <h4 style={styles.featureTitle}>Availing Services & Facilities</h4>
          <p style={styles.featureDesc}>Dynamically log customized amenities (WiFi, Cylinder refills, Parking, Water Jars) with auto-populating rates.</p>
        </div>

        <div className="content-card" style={styles.featureCard}>
          <div style={{ ...styles.featureIcon, background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
          </div>
          <h4 style={styles.featureTitle}>Verified Invoices & Archives</h4>
          <p style={styles.featureDesc}>Generate receipts with landlord signatures, UPI payment screenshot proofs, transaction IDs, and local storage safety.</p>
        </div>
      </div>

      {/* Developer Card Section */}
      <h3 style={styles.sectionHeader}>Developer Details</h3>
      <div className="content-card" style={styles.developerCard}>
        <div style={styles.devGlow}></div>
        <div style={styles.developerLayout}>
          <div style={styles.avatarContainer}>
            <div style={styles.devAvatar}>A</div>
            <div style={styles.onlineBadge}></div>
          </div>
          <div style={styles.devInfo}>
            <h4 style={styles.devName}>Anuj Kumar Jha</h4>
            <p style={styles.devTitle}>Developer</p>
            <p style={styles.devBio}>
              Specializing in premium high-performance web systems, modern user experiences, and visual details.
              RentTrace was designed and handcrafted using React.js and Node.js backend to make monthly rent billing
              seamless, responsive, and aesthetically pleasing.
            </p>
            <div style={styles.techStack}>
              <span style={styles.techTag}>React.js</span>
              <span style={styles.techTag}>Node.js</span>
              <span style={styles.techTag}>Express</span>
              <span style={styles.techTag}>MongoDB</span>
              <span style={styles.techTag}>Vanilla CSS</span>
              <span style={styles.techTag}>Vite</span>
            </div>

            <div style={styles.contactDetails}>
              <a href="mailto:anujjha2106@gmail.com" className="contact-link" title="Send Email">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" style={{ color: 'var(--primary)' }}>
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span>Email</span>
              </a>

              <a href="https://www.linkedin.com/in/itsjhaanuj21/" target="_blank" rel="noopener noreferrer" className="contact-link" title="LinkedIn Profile">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" style={{ color: 'var(--secondary)' }}>
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                <span>LinkedIn</span>
              </a>

              <a href="https://github.com/its-jhaanuj-21" target="_blank" rel="noopener noreferrer" className="contact-link" title="GitHub Profile">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" style={{ color: '#fff' }}>
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                <span>GitHub</span>
              </a>

              <a href="https://x.com/its_jhaanuj_21" target="_blank" rel="noopener noreferrer" className="contact-link" title="X Profile">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" style={{ color: '#ec4899' }}>
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                </svg>
                <span>X / Twitter</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    width: '100%',
    paddingBottom: '2.5rem'
  },
  heroCard: {
    padding: '2rem',
    background: 'linear-gradient(135deg, rgba(15, 22, 38, 0.8) 0%, rgba(9, 9, 11, 0.9) 100%)',
    border: '1px solid var(--border-glass)',
    borderRadius: '24px',
    boxShadow: 'var(--shadow-md)'
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.25rem'
  },
  logoIcon: {
    width: '56px',
    height: '56px',
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)'
  },
  logoSvg: {
    width: '28px',
    height: '28px',
    color: '#fff',
    animation: 'pulseLogo 2s infinite ease-in-out'
  },
  heroTitle: {
    fontFamily: 'Space Grotesk, sans-serif',
    fontSize: '1.75rem',
    fontWeight: '700',
    background: 'linear-gradient(to right, #ffffff, #a5b4fc)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '0.05em',
    margin: 0
  },
  heroSubtitle: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.4)',
    margin: '2px 0 0 0',
    fontWeight: '600'
  },
  heroText: {
    fontSize: '0.95rem',
    color: 'var(--text-muted)',
    lineHeight: '1.6',
    margin: 0
  },
  sectionHeader: {
    fontFamily: 'Space Grotesk, sans-serif',
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#fff',
    margin: '0.5rem 0 0 0',
    textAlign: 'left'
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.25rem'
  },
  featureCard: {
    padding: '1.5rem',
    background: 'rgba(15, 22, 38, 0.6)',
    border: '1px solid var(--border-glass)',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    textAlign: 'left',
    transition: 'transform 0.2s ease, border-color 0.2s ease'
  },
  featureIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem'
  },
  featureTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '0.5rem'
  },
  featureDesc: {
    fontSize: '0.825rem',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
    margin: 0
  },
  developerCard: {
    position: 'relative',
    padding: '2rem',
    background: 'linear-gradient(145deg, rgba(20, 20, 30, 0.9) 0%, rgba(10, 10, 15, 0.95) 100%)',
    border: '1px solid rgba(99, 102, 241, 0.15)',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
  },
  devGlow: {
    position: 'absolute',
    top: '-30%',
    left: '-10%',
    width: '200px',
    height: '200px',
    background: 'rgba(99, 102, 241, 0.1)',
    filter: 'blur(50px)',
    borderRadius: '50%',
    pointerEvents: 'none'
  },
  developerLayout: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  },
  avatarContainer: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  devAvatar: {
    width: '80px',
    height: '80px',
    borderRadius: '24px',
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
    color: '#fff',
    fontSize: '2.5rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 25px rgba(99, 102, 241, 0.35)',
    border: '2px solid rgba(255, 255, 255, 0.1)'
  },
  onlineBadge: {
    position: 'absolute',
    bottom: '-3px',
    right: '-3px',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    background: '#10b981',
    border: '3px solid #0c0b11',
    boxShadow: '0 0 10px #10b981'
  },
  devInfo: {
    flex: 1,
    minWidth: '250px',
    textAlign: 'left'
  },
  devName: {
    fontFamily: 'Space Grotesk, sans-serif',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#fff',
    margin: 0
  },
  devTitle: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#a5b4fc',
    margin: '3px 0 0.75rem 0'
  },
  devBio: {
    fontSize: '0.875rem',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
    margin: '0 0 1.25rem 0'
  },
  techStack: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '1.25rem'
  },
  techTag: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#fff',
    padding: '0.3rem 0.75rem',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '100px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  contactDetails: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.25rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    paddingTop: '1rem'
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  contactText: {
    fontSize: '0.825rem',
    color: 'var(--text-muted)',
    fontWeight: '500'
  }
};
