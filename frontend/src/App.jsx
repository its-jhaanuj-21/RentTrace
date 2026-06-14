import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AddPaymentForm from './components/AddPaymentForm';
import AddExpenseForm from './components/AddExpenseForm';
import PaymentHistory from './components/PaymentHistory';
import Settings from './components/Settings';
import CameraModal from './components/CameraModal';
import ReceiptModal from './components/ReceiptModal';
import Auth from './components/Auth';
import Profile from './components/Profile';
import About from './components/About';
import MobileSettingsHub from './components/MobileSettingsHub';

const DEFAULT_SETTINGS = {
  tenantName: '',
  tenantPhone: '',
  defaultHouseRent: 0,
  defaultElecRate: 0,
  defaultWaterRate: 0,
  initialMeterReading: 0,
  landlordName: '',
  landlordUpi: '',
  landlordDetails: '',
  customServices: []
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function App() {
  // --- User State ---
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('rent_tracker_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [showSplash, setShowSplash] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [toast, setToast] = useState(null);

  const showConfirm = ({ title, message, type = 'danger', onConfirm }) => {
    setConfirmDialog({ title, message, type, onConfirm });
  };

  const showToastMessage = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // --- State Lists ---
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- UI Navigation State ---
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('rent_tracker_active_tab');
    return savedTab || 'dashboard';
  });

  useEffect(() => {
    localStorage.setItem('rent_tracker_active_tab', activeTab);
  }, [activeTab]);

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile && activeTab === 'settings-hub') {
      setActiveTab('dashboard');
    }
  }, [isMobile, activeTab]);

  // --- Temporary Add Form Image Proofs ---
  const [meterImage, setMeterImage] = useState('');
  const [paymentSS, setPaymentSS] = useState('');
  const [profileImageTemp, setProfileImageTemp] = useState('');

  // --- Modals State Control ---
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraTarget, setCameraTarget] = useState(''); // 'meter' or 'payment'
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

  // Load settings and payments from the API on mount or user change
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch Settings
        const settingsRes = await fetch(`${API_URL}/settings`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        const settingsData = await settingsRes.json();
        if (settingsRes.ok) {
          setSettings(settingsData);
        }

        // Fetch Payments
        const paymentsRes = await fetch(`${API_URL}/payments`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        const paymentsData = await paymentsRes.json();
        if (paymentsRes.ok) {
          setPayments(paymentsData);
        }
      } catch (err) {
        console.error("Error loading data from server:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Auth Actions
  const handleAuthSuccess = (userData) => {
    setShowSplash(true);
    setUser(userData);
    localStorage.setItem('rent_tracker_user', JSON.stringify(userData));
    setTimeout(() => {
      setShowSplash(false);
    }, 1800);
  };

  const handleUserProfileUpdate = (updatedUserData) => {
    const newUser = { ...user, ...updatedUserData };
    setUser(newUser);
    localStorage.setItem('rent_tracker_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    showConfirm({
      title: 'Confirm Logout',
      message: 'Are you sure you want to log out? You will need to re-authenticate to view your utilities and rent ledger.',
      type: 'danger',
      onConfirm: () => {
        setUser(null);
        setSettings(DEFAULT_SETTINGS);
        setPayments([]);
        localStorage.removeItem('rent_tracker_user');
        localStorage.removeItem('rent_tracker_active_tab');
        setActiveTab('dashboard');
      }
    });
  };

  // Actions
  const handleSavePayment = async (paymentData) => {
    try {
      const response = await fetch(`${API_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Server responded with an error');
      }

      const savedPayment = await response.json();
      
      // Update local settings state so future default previous readings use this new reading (if valid)
      if (savedPayment.currMeter && savedPayment.currMeter > 0) {
        setSettings(prev => ({
          ...prev,
          initialMeterReading: savedPayment.currMeter
        }));
      }
      
      // Prepend to show newest first
      setPayments(prev => [savedPayment, ...prev]);
      
      // Clean up temporary image files
      setMeterImage('');
      setPaymentSS('');
      
      showToastMessage("Payment transaction recorded successfully!", "success");
      setActiveTab('dashboard');
    } catch (err) {
      console.error("Error saving payment:", err);
      showToastMessage("Failed to save payment record to backend server.", "error");
    }
  };

  const handleDeletePayment = (id) => {
    showConfirm({
      title: 'Delete Payment Record',
      message: 'Are you sure you want to permanently delete this payment record? This action cannot be undone.',
      type: 'danger',
      onConfirm: async () => {
        try {
          const response = await fetch(`${API_URL}/payments/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          });

          if (!response.ok) {
            throw new Error('Server responded with an error');
          }

          setPayments(prev => prev.filter(p => p.id !== id));
          showToastMessage("Payment record deleted.", "success");
        } catch (err) {
          console.error("Error deleting payment:", err);
          showToastMessage("Failed to delete payment record from backend server.", "error");
        }
      }
    });
  };

  const handleSaveSettings = async (updatedSettings) => {
    try {
      const response = await fetch(`${API_URL}/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(updatedSettings),
      });

      if (!response.ok) {
        throw new Error('Server responded with an error');
      }

      const savedSettings = await response.json();
      setSettings(savedSettings);
      showToastMessage("Default configurations updated.", "success");
      setActiveTab('dashboard');
    } catch (err) {
      console.error("Error saving settings:", err);
      showToastMessage("Failed to save configuration settings to backend server.", "error");
    }
  };

  const handleResetSettings = async () => {
    try {
      const response = await fetch(`${API_URL}/settings/reset`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Server responded with an error');
      }

      const resetData = await response.json();
      setSettings(resetData);
      showToastMessage("Configuration reset to empty system defaults.", "success");
    } catch (err) {
      console.error("Error resetting settings:", err);
      showToastMessage("Failed to reset configuration settings on backend server.", "error");
    }
  };

  const openCameraModal = (target) => {
    setCameraTarget(target);
    setCameraOpen(true);
  };

  const handleCameraCapture = (dataUrl) => {
    if (cameraTarget === 'meter') {
      setMeterImage(dataUrl);
    } else if (cameraTarget === 'payment') {
      setPaymentSS(dataUrl);
    } else if (cameraTarget === 'profile') {
      setProfileImageTemp(dataUrl);
    }
  };

  const handleViewReceipt = (id) => {
    setSelectedPaymentId(id);
  };

  // Titles mapping helper
  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Utility Flow Overview';
      case 'add-payment': return 'Record Utilities & Rent';
      case 'add-expense': return 'Record Custom Expense';
      case 'history': return 'Transaction Ledger';
      case 'settings': return 'Setup & Rates Config';
      case 'profile': return 'Account Settings';
      case 'about': return 'About & System Info';
      case 'settings-hub': return 'Settings & Tools';
      default: return 'RentTrace';
    }
  };

  const getPageSubtitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Track and summary billing details at a glance';
      case 'add-payment': return 'Calculate totals, attach proofs, and record payments';
      case 'add-expense': return 'Log cylinder recharges, WiFi bills, water jars, or custom expenses';
      case 'history': return 'View and filter historical receipt invoice statements';
      case 'settings': return 'Edit default prices, landlord details, and setup parameters';
      case 'profile': return 'Update your credentials, identity, and profile picture';
      case 'about': return 'Information about RentTrace and the development team';
      case 'settings-hub': return 'Configure setup parameters, update profile, and view app details';
      default: return '';
    }
  };

  const activePayment = payments.find(p => p.id === selectedPaymentId);

  // If user is not authenticated, render standard Login/Signup screen
  if (!user) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  if (showSplash) {
    return (
      <div style={splashStyles.container}>
        <style>{keyframes}</style>
        <div style={splashStyles.card}>
          <div style={splashStyles.logoWrapper}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={splashStyles.svg}>
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <div style={splashStyles.glow}></div>
          </div>
          <h1 style={splashStyles.title}>RentTrace</h1>
          <p style={splashStyles.subtitle}>Securing credentials & loading dashboard...</p>
          <div style={splashStyles.progressBarWrapper}>
            <div style={splashStyles.progressBar}></div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', background: '#0a0a0c', color: '#fff', fontFamily: 'sans-serif', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Loading RentTrace...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} settings={settings} user={user} onLogout={handleLogout} />

      {/* Main Content Pane */}
      <main className={`main-content ${activeTab === 'dashboard' ? 'dashboard-view' : ''}`}>
        <div className="header-actions">
          <div className="page-title">
            <h1>{getPageTitle()}</h1>
            <p>{getPageSubtitle()}</p>
          </div>
        </div>

        {/* Dynamic Navigation Views */}
        {isMobile && ['settings', 'profile', 'about'].includes(activeTab) && (
          <button 
            type="button"
            className="btn btn-secondary" 
            onClick={() => setActiveTab('settings-hub')}
            style={{ 
              marginBottom: '1.25rem', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.4rem',
              alignSelf: 'flex-start',
              padding: '0.5rem 0.85rem',
              fontSize: '0.85rem',
              border: '1px solid var(--border-glass)',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to Settings
          </button>
        )}

        {activeTab === 'dashboard' && (
          <Dashboard 
            payments={payments} 
            settings={settings} 
            onTabChange={setActiveTab} 
            onViewReceipt={handleViewReceipt} 
          />
        )}

        {activeTab === 'add-payment' && (
          <AddPaymentForm 
            settings={settings} 
            payments={payments} 
            onSavePayment={handleSavePayment} 
            openCamera={openCameraModal}
            meterImage={meterImage}
            paymentSS={paymentSS}
            setMeterImage={setMeterImage}
            setPaymentSS={setPaymentSS}
            showToast={showToastMessage}
          />
        )}

        {activeTab === 'add-expense' && (
          <AddExpenseForm 
            settings={settings}
            onSavePayment={handleSavePayment} 
            openCamera={openCameraModal}
            paymentSS={paymentSS}
            setPaymentSS={setPaymentSS}
            showToast={showToastMessage}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'history' && (
          <PaymentHistory 
            payments={payments} 
            onViewReceipt={handleViewReceipt} 
            onDeletePayment={handleDeletePayment} 
          />
        )}

        {activeTab === 'settings' && (
          <Settings 
            settings={settings} 
            onSaveSettings={handleSaveSettings} 
            onResetSettings={handleResetSettings} 
            showConfirm={showConfirm}
          />
        )}

        {activeTab === 'profile' && (
          <Profile 
            user={user} 
            onUserProfileUpdate={handleUserProfileUpdate} 
            openCamera={openCameraModal}
            profileImageTemp={profileImageTemp}
            setProfileImageTemp={setProfileImageTemp}
            showToast={showToastMessage}
            setActiveTab={setActiveTab}
            onLogout={handleLogout}
          />
        )}

        {activeTab === 'about' && (
          <About />
        )}

        {activeTab === 'settings-hub' && (
          <MobileSettingsHub 
            user={user}
            onTabChange={setActiveTab}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Camera Modal component */}
      <CameraModal 
        isOpen={cameraOpen} 
        onClose={() => setCameraOpen(false)} 
        onCapture={handleCameraCapture} 
        title={cameraTarget === 'meter' ? 'Meter Reading Image Proof' : cameraTarget === 'profile' ? 'Profile Picture Capture' : 'Payment Screenshot Proof'}
      />

      {/* Receipt invoice sheet viewer */}
      <ReceiptModal 
        isOpen={selectedPaymentId !== null} 
        onClose={() => setSelectedPaymentId(null)} 
        payment={activePayment} 
        settings={settings}
        showToast={showToastMessage}
      />

      {/* Reusable Styled Custom Confirmation Modal */}
      {confirmDialog && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.content}>
            <div style={{
              ...modalStyles.iconContainer,
              ...(confirmDialog.type === 'danger' ? modalStyles.dangerIcon : modalStyles.infoIcon)
            }}>
              {confirmDialog.type === 'danger' ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
              )}
            </div>
            <h3 style={modalStyles.title}>{confirmDialog.title}</h3>
            <p style={modalStyles.text}>{confirmDialog.message}</p>
            <div style={modalStyles.btnGroup}>
              <button 
                onClick={() => setConfirmDialog(null)} 
                style={modalStyles.cancelBtn}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog(null);
                }} 
                style={{
                  ...modalStyles.confirmBtn,
                  backgroundColor: confirmDialog.type === 'danger' ? '#ef4444' : '#6366f1'
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Card */}
      {toast && (
        <div style={toastStyles.wrapper}>
          <style>{toastKeyframes}</style>
          <div style={{
            ...toastStyles.card,
            ...(toast.type === 'success' ? toastStyles.success : toast.type === 'error' ? toastStyles.error : toastStyles.info)
          }}>
            <div style={toastStyles.iconContainer}>
              {toast.type === 'success' ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : toast.type === 'error' ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12" y2="8"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" x2="16" y1="12" y2="12"/>
                  <line x1="12" x2="8" y1="12" y2="12"/>
                </svg>
              )}
            </div>
            <div style={toastStyles.content}>
              <h4 style={toastStyles.title}>
                {toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'Error' : 'Notification'}
              </h4>
              <p style={toastStyles.message}>{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} style={toastStyles.closeBtn}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" stroke-linejoin="round" width="14" height="14">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            
            {/* Dynamic visual countdown timer */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '3px',
              backgroundColor: toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : '#6366f1',
              animation: 'toastProgress 3.5s linear forwards',
              width: '100%',
              borderRadius: '0 0 16px 16px'
            }} />
          </div>
        </div>
      )}
    </div>
  );
}

// Splash Screen Styles for premium glassmorphic/glowing transition
const splashStyles = {
  container: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(circle at center, #11101b, #09090b 80%)',
    color: '#fff',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    overflow: 'hidden',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'fadeIn 1s ease-out forwards',
  },
  logoWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80px',
    height: '80px',
    marginBottom: '1.5rem',
  },
  svg: {
    width: '56px',
    height: '56px',
    zIndex: 2,
    animation: 'pulseLogo 2s infinite ease-in-out',
  },
  glow: {
    position: 'absolute',
    width: '60px',
    height: '60px',
    background: 'rgba(99, 102, 241, 0.25)',
    filter: 'blur(20px)',
    borderRadius: '50%',
    zIndex: 1,
    animation: 'pulseGlow 2s infinite ease-in-out',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    letterSpacing: '0.15em',
    background: 'linear-gradient(to right, #ffffff, #a5b4fc)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '0 0 0.5rem 0',
    animation: 'slideUp 0.8s ease-out forwards',
  },
  subtitle: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.5)',
    margin: '0 0 2rem 0',
    letterSpacing: '0.05em',
    animation: 'slideUp 1s ease-out forwards',
  },
  progressBarWrapper: {
    width: '180px',
    height: '3px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  progressBar: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to right, #6366f1, #a855f7)',
    borderRadius: '10px',
    transform: 'translateX(-100%)',
    animation: 'loadProgress 1.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
  }
};

const keyframes = `
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes pulseLogo {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
  @keyframes pulseGlow {
    0%, 100% { transform: scale(1); opacity: 0.25; }
    50% { transform: scale(1.3); opacity: 0.4; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes loadProgress {
    0% { transform: translateX(-100%); }
    50% { transform: translateX(-40%); }
    100% { transform: translateX(0); }
  }
`;

// Modal styles for premium logout confirmation popup
const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0, 0, 0, 0.65)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  content: {
    background: 'rgba(20, 20, 27, 0.95)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '24px',
    padding: '2.25rem 2rem',
    width: '90%',
    maxWidth: '380px',
    textAlign: 'center',
    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.5)',
    animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
    boxSizing: 'border-box'
  },
  iconContainer: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.25rem auto'
  },
  dangerIcon: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1.5px solid rgba(239, 68, 68, 0.2)'
  },
  infoIcon: {
    background: 'rgba(99, 102, 241, 0.1)',
    border: '1.5px solid rgba(99, 102, 241, 0.2)'
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#fff',
    margin: '0 0 0.5rem 0'
  },
  text: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: '1.45',
    margin: '0 0 1.75rem 0'
  },
  btnGroup: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'center'
  },
  cancelBtn: {
    flex: 1,
    padding: '0.75rem',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.2s'
  },
  confirmBtn: {
    flex: 1,
    padding: '0.75rem',
    borderRadius: '12px',
    border: 'none',
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.2s'
  }
};

// Toast Notification styles
const toastStyles = {
  wrapper: {
    position: 'fixed',
    top: '1.5rem',
    right: '1.5rem',
    zIndex: 99999,
    pointerEvents: 'none',
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    background: 'rgba(20, 20, 27, 0.95)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '0.85rem 1.25rem',
    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.45)',
    pointerEvents: 'auto',
    animation: 'toastSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
    boxSizing: 'border-box',
    width: '320px',
    position: 'relative',
    overflow: 'hidden'
  },
  success: {
    borderLeft: '4px solid #10b981',
  },
  error: {
    borderLeft: '4px solid #ef4444',
  },
  info: {
    borderLeft: '4px solid #6366f1',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    textAlign: 'left',
    minWidth: 0,
  },
  title: {
    fontSize: '0.875rem',
    fontWeight: '700',
    color: '#fff',
    margin: '0 0 1px 0',
  },
  message: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.65)',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.4)',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s',
  }
};

const toastKeyframes = `
  @keyframes toastSlideIn {
    from { opacity: 0; transform: translateY(-20px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes toastProgress {
    from { width: 100%; }
    to { width: 0%; }
  }
`;
