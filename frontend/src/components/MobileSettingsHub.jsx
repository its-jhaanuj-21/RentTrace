import React from 'react';

export default function MobileSettingsHub({ user, onTabChange, onLogout }) {
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  const menuItems = [
    {
      id: 'settings',
      title: 'Setup & Rates Config',
      description: 'Define default house rent, electricity rates, and availing custom services/facilities.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      ),
      color: '#a855f7'
    },
    {
      id: 'profile',
      title: 'User Profile settings',
      description: 'Update your display name, upload a custom profile picture, or change passwords.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ),
      color: '#6366f1'
    },
    {
      id: 'about',
      title: 'About RentTrace',
      description: 'Learn about key application features, technology stack, and developer credits.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4"/>
          <path d="M12 8h.01"/>
        </svg>
      ),
      color: '#10b981'
    }
  ];

  return (
    <div style={styles.container}>
      {/* Mobile Profile Card banner */}
      <div className="content-card" style={styles.profileBanner}>
        <div style={styles.avatarWrapper}>
          {user?.picture ? (
            <img src={user.picture} alt={user.name} style={styles.avatarImg} />
          ) : (
            <div style={styles.avatarPlaceholder}>{userInitial}</div>
          )}
        </div>
        <div style={styles.profileDetails}>
          <h3 style={styles.userName}>{user?.name || 'User'}</h3>
          <p style={styles.userEmail}>{user?.email || ''}</p>
        </div>
      </div>

      {/* Settings Options List */}
      <div style={styles.menuList}>
        {menuItems.map((item) => (
          <div 
            key={item.id} 
            className="content-card" 
            onClick={() => onTabChange(item.id)}
            style={styles.menuCard}
          >
            <div style={{ ...styles.iconBox, background: `${item.color}1c`, color: item.color }}>
              {item.icon}
            </div>
            <div style={styles.menuText}>
              <h4 style={styles.menuTitle}>{item.title}</h4>
              <p style={styles.menuDesc}>{item.description}</p>
            </div>
            <div style={styles.arrowBox}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <button 
        onClick={onLogout} 
        className="btn btn-secondary" 
        style={styles.logoutBtn}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" style={{ marginRight: '6px' }}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" x2="9" y1="12" y2="12"/>
        </svg>
        Sign Out Account
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    width: '100%',
    paddingBottom: '2rem'
  },
  profileBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
    padding: '1.25rem',
    background: 'linear-gradient(135deg, rgba(15, 22, 38, 0.8) 0%, rgba(9, 9, 11, 0.95) 100%)',
    border: '1px solid var(--border-glass)',
    borderRadius: '20px'
  },
  avatarWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarImg: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    border: '2px solid var(--primary)',
    objectFit: 'cover',
    boxShadow: '0 8px 16px rgba(99, 102, 241, 0.25)'
  },
  avatarPlaceholder: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--secondary) 0%, var(--accent) 100%)',
    color: '#fff',
    fontSize: '1.5rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid rgba(255, 255, 255, 0.15)',
    boxShadow: '0 8px 16px rgba(168, 85, 247, 0.25)'
  },
  profileDetails: {
    flex: 1,
    textAlign: 'left',
    minWidth: 0
  },
  userName: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#fff',
    margin: '0 0 3px 0',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  userEmail: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  menuList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem'
  },
  menuCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
    padding: '1.25rem',
    background: 'rgba(15, 22, 38, 0.55)',
    border: '1px solid var(--border-glass)',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)'
  },
  iconBox: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  menuText: {
    flex: 1,
    textAlign: 'left'
  },
  menuTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#fff',
    margin: '0 0 4px 0'
  },
  menuDesc: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    lineHeight: '1.4',
    margin: 0
  },
  arrowBox: {
    color: 'rgba(255, 255, 255, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoutBtn: {
    width: '100%',
    padding: '0.85rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '16px',
    cursor: 'pointer',
    marginTop: '0.5rem',
    boxSizing: 'border-box'
  }
};
