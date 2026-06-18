import React from 'react';

export default function Sidebar({ activeTab, onTabChange, settings, user, onLogout }) {
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <aside className="sidebar">
      <div className="sidebar-nav-container">
        <div className="logo-container">
          <img src="/icon-192.png" alt="RentTrace Logo" style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover' }} />
          <span className="logo-text">RentTrace</span>
        </div>

        <ul className="nav-menu">
          {/* 1st -> Dashboard */}
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => onTabChange('dashboard')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="7" height="9" x="3" y="3" rx="1" />
                <rect width="7" height="5" x="14" y="3" rx="1" />
                <rect width="7" height="9" x="14" y="12" rx="1" />
                <rect width="7" height="5" x="3" y="16" rx="1" />
              </svg>
              <span>Dashboard</span>
            </a>
          </li>

          {/* 2nd -> Payment History */}
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => onTabChange('history')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M12 7v5l4 2" />
              </svg>
              <span>
                <span className="desktop-text">Payment History</span>
                <span className="mobile-text">History</span>
              </span>
            </a>
          </li>

          {/* 3rd -> Add Rent Details (Floating/Raised on mobile) */}
          <li className="nav-item nav-item-raised">
            <a
              className={`nav-link nav-link-raised ${activeTab === 'add-payment' ? 'active' : ''}`}
              onClick={() => onTabChange('add-payment')}
            >
              <div className="raised-icon-circle">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12h8" />
                  <path d="M12 8v8" />
                </svg>
              </div>
              <span>
                <span className="desktop-text">Add Rent Details</span>
                <span className="mobile-text">Add Rent</span>
              </span>
            </a>
          </li>

          {/* 4th -> Add Expense Details */}
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === 'add-expense' ? 'active' : ''}`}
              onClick={() => onTabChange('add-expense')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
                <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
              </svg>
              <span>
                <span className="desktop-text">Add Expense</span>
                <span className="mobile-text">Add Exp</span>
              </span>
            </a>
          </li>

          {/* 5th -> Setup & Rates (Desktop only) */}
          <li className="nav-item desktop-only-nav-item">
            <a
              className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => onTabChange('settings')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>
                <span className="desktop-text">Setup & Rates</span>
                <span className="mobile-text">Set Rates</span>
              </span>
            </a>
          </li>

          {/* Mobile Settings Hub (Mobile only) */}
          <li className="nav-item mobile-only-nav-item">
            <a
              className={`nav-link ${['settings-hub', 'settings', 'profile', 'about'].includes(activeTab) ? 'active' : ''}`}
              onClick={() => onTabChange('settings-hub')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span>Settings</span>
            </a>
          </li>

          {/* 6th -> About App (Desktop only) */}
          <li className="nav-item desktop-only-nav-item">
            <a
              className={`nav-link ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => onTabChange('about')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              <span>
                <span className="desktop-text">About App</span>
                <span className="mobile-text">About</span>
              </span>
            </a>
          </li>
        </ul>
      </div>

      <div className="sidebar-footer" style={{ flexDirection: 'column', gap: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.25rem' }}>
        <div
          onClick={() => onTabChange('profile')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            width: '100%',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '12px',
            transition: 'background var(--transition-fast), border-color var(--transition-fast)',
            background: activeTab === 'profile' ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
            border: activeTab === 'profile' ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent'
          }}
          className="sidebar-profile-link"
        >
          {user?.picture ? (
            <img src={user.picture} alt={user.name} style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1.5px solid #6366f1', objectFit: 'cover' }} />
          ) : (
            <div className="footer-avatar" style={{ margin: 0 }}>{userInitial}</div>
          )}
          <div className="footer-info" style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
            <h4 style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: '0 0 2px 0', fontSize: '0.875rem', color: '#fff' }}>{user?.name || 'User'}</h4>
            <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{user?.email || ''}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="btn btn-secondary"
          style={{
            width: '100%',
            padding: '0.5rem',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem',
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1-2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
