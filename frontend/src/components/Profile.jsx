import React, { useState, useEffect, useRef } from 'react';

export default function Profile({ user, onUserProfileUpdate, openCamera, profileImageTemp, setProfileImageTemp, showToast, setActiveTab, onLogout }) {
  const fileInputRef = useRef(null);
  
  // State fields
  const [name, setName] = useState(user?.name || '');
  const [picture, setPicture] = useState(user?.picture || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [modalView, setModalView] = useState('closed'); // 'closed', 'options', 'view_image'

  // Sync temp camera images
  useEffect(() => {
    if (profileImageTemp) {
      setPicture(profileImageTemp);
      setProfileImageTemp(''); // clear temp value
      showToast("Profile image captured from camera!", "success");
    }
  }, [profileImageTemp, setProfileImageTemp, showToast]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (modalView !== 'closed') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalView]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("Image size must be smaller than 2MB!", "error");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPicture(reader.result);
      showToast("Profile image selected successfully!", "success");
    };
    reader.readAsDataURL(file);
  };

  const handleTriggerUpload = () => {
    fileInputRef.current.click();
  };

  const handleRemovePhoto = () => {
    setPicture('');
    showToast("Profile image removed.", "info");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Passwords validation check
    if (newPassword) {
      if (newPassword.length < 6) {
        showToast("New password must be at least 6 characters long!", "error");
        setSaving(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        showToast("New password and confirmation do not match!", "error");
        setSaving(false);
        return;
      }
      if (!user.googleId && !currentPassword) {
        showToast("Please enter your current password to update it!", "error");
        setSaving(false);
        return;
      }
    }

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          name,
          picture,
          currentPassword: user.googleId ? undefined : currentPassword,
          newPassword: newPassword || undefined
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Sync updated user details back to App state (and localStorage)
      onUserProfileUpdate(data);
      
      showToast("Profile details updated successfully!", "success");
      
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setActiveTab('dashboard');
    } catch (err) {
      console.error(err);
      showToast(err.message || "Error saving profile details.", "error");
    } finally {
      setSaving(false);
    }
  };

  const userInitial = name ? name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="content-card">
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <h3 className="form-section-title">Avatar & Identity</h3>
          
          {/* Profile Picture Section */}
          <div className="form-group full-width" style={styles.photoSection}>
            <div 
              className="avatar-wrapper-hover" 
              style={styles.avatarWrapper} 
              onClick={() => setModalView('options')} 
              title="Manage profile photo"
            >
              {picture ? (
                <img src={picture} alt="Profile Preview" style={styles.avatarImg} />
              ) : (
                <div style={styles.avatarPlaceholder}>{userInitial}</div>
              )}
              <div style={styles.avatarOverlay}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                  <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                </svg>
              </div>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            <p style={styles.photoHint}>JPG, PNG, or base64 data. Maximum size 2MB. Click photo to change.</p>
          </div>

          {/* Account Details */}
          <div className="form-group">
            <label htmlFor="profile-name">Full Name</label>
            <input 
              type="text" 
              id="profile-name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="profile-email">Email Address (Read-only)</label>
            <input 
              type="email" 
              id="profile-email" 
              value={user?.email || ''}
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
          </div>

          {/* Password Section */}
          <h3 className="form-section-title" style={{ marginTop: '1.5rem' }}>Security Credentials</h3>
          
          {user.googleId ? (
            <div className="form-group full-width" style={styles.googleNotice}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" style={{ marginRight: '6px' }}>
                <circle cx="12" cy="12" r="10"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
              <span>This account is securely linked with Google Authentication. You can set a local password below to sign in using standard email credentials.</span>
            </div>
          ) : null}

          {!user.googleId && (
            <div className="form-group">
              <label htmlFor="profile-curr-pass">Current Password *</label>
              <input 
                type="password" 
                id="profile-curr-pass" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password to make changes"
                required={!!newPassword}
              />
            </div>
          )}

          <div className="form-group" style={user.googleId ? { gridColumn: 'span 1' } : undefined}>
            <label htmlFor="profile-new-pass">{user.googleId ? 'Set Local Password' : 'New Password'}</label>
            <input 
              type="password" 
              id="profile-new-pass" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 6 characters"
            />
          </div>

          <div className="form-group">
            <label htmlFor="profile-conf-pass">Confirm Password</label>
            <input 
              type="password" 
              id="profile-conf-pass" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required={!!newPassword}
            />
          </div>

          {/* Action controls */}
          <div className="profile-action-controls">
            <button 
              type="button" 
              className="btn btn-danger btn-logout" 
              onClick={onLogout}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1-2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" x2="9" y1="12" y2="12"/>
              </svg>
              Logout Account
            </button>
            
            <div className="profile-action-controls-buttons">
              <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('dashboard')} disabled={saving}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

        </div>
      </form>

      {/* Profile Photo Options Modal */}
      {modalView === 'options' && (
        <div className="modal-overlay active profile-modal-overlay" onClick={() => setModalView('closed')}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={styles.modalContent}>
            <div className="modal-header" style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700' }}>Profile Photo Options</h3>
              <button type="button" className="modal-close" onClick={() => setModalView('closed')} aria-label="Close options">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            
            <div style={styles.modalBody}>
              {/* Option 1: View Photo */}
              <button type="button" className="profile-option-btn" onClick={() => setModalView('view_image')}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                View Image
              </button>
              
              {/* Option 2: Upload Photo */}
              <button type="button" className="profile-option-btn" onClick={() => { setModalView('closed'); handleTriggerUpload(); }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                </svg>
                Upload Photo
              </button>
              
              {/* Option 3: Take Photo */}
              <button type="button" className="profile-option-btn" onClick={() => { setModalView('closed'); openCamera('profile'); }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                  <circle cx="12" cy="13" r="3"/>
                </svg>
                Take Photo
              </button>
              
              {/* Option 4: Remove Photo */}
              {picture && (
                <button type="button" className="profile-option-btn-danger" onClick={() => { setModalView('closed'); handleRemovePhoto(); }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    <line x1="10" y1="11" x2="10" y2="17"/>
                    <line x1="14" y1="11" x2="14" y2="17"/>
                  </svg>
                  Remove Photo
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enlarged Photo Preview Modal */}
      {modalView === 'view_image' && (
        <div className="modal-overlay active profile-modal-overlay" onClick={() => setModalView('closed')}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={styles.enlargedModalContent}>
            <div className="modal-header" style={{ width: '100%', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700' }}>Photo Preview</h3>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" className="modal-close" onClick={() => setModalView('options')} aria-label="Back" title="Back to Options">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                    <line x1="19" y1="12" x2="5" y2="12"/>
                    <polyline points="12 19 5 12 12 5"/>
                  </svg>
                </button>
                <button type="button" className="modal-close" onClick={() => setModalView('closed')} aria-label="Close preview">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>
            <div style={styles.enlargedImageWrapper}>
              {picture ? (
                <img src={picture} alt="Profile Enlarged" style={styles.enlargedImg} />
              ) : (
                <div style={styles.enlargedPlaceholder}>{userInitial}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  photoSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem'
  },
  avatarWrapper: {
    position: 'relative',
    width: '96px',
    height: '96px',
    borderRadius: '50%',
    cursor: 'pointer',
    overflow: 'hidden',
    border: '2.5px solid #6366f1',
    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    color: '#fff',
    fontSize: '2.25rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-mono)'
  },
  avatarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.4)',
    opacity: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.2s'
  },
  photoBtnGroup: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  photoBtn: {
    padding: '0.5rem 1rem',
    fontSize: '0.8rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    height: '36px',
    borderRadius: '8px'
  },
  photoHint: {
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.4)',
    margin: 0
  },
  googleNotice: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(99, 102, 241, 0.08)',
    border: '1px solid rgba(99, 102, 241, 0.15)',
    borderRadius: '12px',
    padding: '0.85rem 1.15rem',
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.75)',
    lineHeight: '1.4',
    textAlign: 'left',
    margin: '0.5rem 0'
  },
  modalContent: {
    maxWidth: '320px',
    padding: '1.5rem',
    borderRadius: '16px',
    backgroundColor: '#0c1222',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
  },
  modalBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginTop: '0.5rem'
  },
  enlargedModalContent: {
    maxWidth: '400px',
    padding: '1.5rem',
    borderRadius: '16px',
    backgroundColor: '#0c1222',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  enlargedImageWrapper: {
    width: '100%',
    aspectRatio: '1',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '2px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#050811'
  },
  enlargedImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  enlargedPlaceholder: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    color: '#fff',
    fontSize: '5rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-mono)'
  }
};

// Add CSS rule for avatar hover overlay toggle and modal option buttons
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .avatar-wrapper-hover:hover div {
      opacity: 1 !important;
    }
    .profile-option-btn {
      width: 100%;
      padding: 0.85rem 1.25rem;
      font-size: 0.95rem;
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
      gap: 0.75rem;
      border-radius: 10px;
      background-color: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      color: #fff;
      transition: all 0.2s ease;
      cursor: pointer;
      font-weight: 500;
      box-sizing: border-box;
      outline: none;
    }
    .profile-option-btn:hover {
      background-color: rgba(255, 255, 255, 0.08);
      border-color: #6366f1;
      transform: translateY(-1px);
    }
    .profile-option-btn-danger {
      width: 100%;
      padding: 0.85rem 1.25rem;
      font-size: 0.95rem;
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
      gap: 0.75rem;
      border-radius: 10px;
      background-color: rgba(239, 68, 68, 0.08);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: #ef4444;
      transition: all 0.2s ease;
      cursor: pointer;
      font-weight: 500;
      box-sizing: border-box;
      outline: none;
    }
    .profile-option-btn-danger:hover {
      background-color: #ef4444;
      color: #fff;
      border-color: #ef4444;
      transform: translateY(-1px);
    }
    @media (max-width: 768px) {
      .profile-modal-overlay {
        align-items: flex-start !important;
        padding-top: 3rem !important;
      }
      .profile-modal-overlay .modal-content {
        margin: 0 auto !important;
        max-height: 85vh !important;
      }
    }
  `;
  document.head.appendChild(styleEl);
}
