import React, { useState, useEffect } from 'react';

export default function Dashboard({ payments, settings, onTabChange, onViewReceipt }) {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  const [showOtherModal, setShowOtherModal] = useState(false);

  const calculateOtherBreakdown = () => {
    const breakdown = {};
    payments.forEach(p => {
      if (p.otherCharges && p.otherCharges.length > 0) {
        p.otherCharges.forEach(c => {
          const name = c.desc || 'Other';
          breakdown[name] = (breakdown[name] || 0) + (c.amount || 0);
        });
      } else if (p.otherAmount && p.otherAmount > 0) {
        const name = p.otherDesc || 'Other';
        breakdown[name] = (breakdown[name] || 0) + p.otherAmount;
      }
    });
    return Object.entries(breakdown)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 1. Calculate Stats
  const totalPaid = payments.reduce((sum, p) => sum + (p.paidAmount || 0), 0);
  const totalElec = payments.reduce((sum, p) => sum + (p.elecAmount || 0), 0);
  const totalOther = payments.reduce((sum, p) => sum + (p.otherAmount || 0), 0);

  // Status check for current month
  const today = new Date();
  const currentMonthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const paidForCurrent = payments.find(p => p.month === currentMonthStr);

  const formatMonthName = (monthStr) => {
    if (!monthStr) return "";
    const [year, month] = monthStr.split('-');
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const formatReadableDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString('default', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const recentPayments = payments.slice(0, isMobile ? 3 : 5);

  return (
    <div className="dashboard-grid">
      {/* Stats Summary Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon blue">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3a4 4 0 0 0 0-8"/>
            </svg>
          </div>
          <div className="stat-details">
            <p>Total Paid Overall</p>
            <h3>₹{totalPaid.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon green">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <div className="stat-details">
            <p>Electricity Total</p>
            <h3>₹{totalElec.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          </div>
        </div>
        
        <div className="stat-card" onClick={() => setShowOtherModal(true)} style={{ cursor: 'pointer' }} title="Click to view breakdown">
          <div className="stat-icon purple">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </div>
          <div className="stat-details">
            <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              Other Charges Total
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="12" height="12" style={{ opacity: 0.6 }}>
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
            </p>
            <h3>₹{totalOther.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
              <line x1="16" x2="16" y1="2" y2="6"/>
              <line x1="8" x2="8" y1="2" y2="6"/>
              <line x1="3" x2="21" y1="10" y2="10"/>
            </svg>
          </div>
          <div className="stat-details">
            <p>Current Month Status</p>
            <h3>
              {paidForCurrent ? (
                <span className="badge badge-success">Paid ({formatMonthName(currentMonthStr)})</span>
              ) : (
                <span className="badge badge-warning">Pending ({formatMonthName(currentMonthStr)})</span>
              )}
            </h3>
          </div>
        </div>
      </div>

      {/* Recent Payments Section */}
      <div className="dashboard-left">
        <div className="content-card">
          <div className="card-header">
            <h2>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3a4 4 0 0 0 0-8"/>
              </svg>
              Recent Payment Records
            </h2>
            <button className="btn btn-secondary btn-sm" onClick={() => onTabChange('history')}>View All</button>
          </div>
          
          <div className="rent-table-wrapper">
            <table className="rent-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Payment Date</th>
                  <th>Total Amt</th>
                  <th>Payment Mode</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                        <line x1="16" x2="16" y1="2" y2="6"/>
                        <line x1="8" x2="8" y1="2" y2="6"/>
                        <line x1="3" x2="21" y1="10" y2="10"/>
                      </svg>
                      No transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  recentPayments.map(p => (
                    <tr key={p.id}>
                      <td data-label="Month"><strong>{formatMonthName(p.month)}</strong></td>
                      <td data-label="Payment Date">{formatReadableDate(p.date)}</td>
                      <td data-label="Total Amt">₹{p.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td data-label="Payment Mode">
                        <span className={`badge ${p.paymentMethod === 'online' ? 'badge-indigo' : 'badge-purple'}`}>
                          {p.paymentMethod}
                        </span>
                      </td>
                      <td className="text-right">
                        <button className="btn btn-secondary btn-sm" onClick={() => onViewReceipt(p.id)}>View Invoice</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Setup Config Summary Card */}
      <div className="dashboard-right">
        <div className="content-card">
          <div className="card-header">
            <h2>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
              Rates & Setup Summary
            </h2>
            <button 
              className="btn btn-secondary btn-icon-only btn-sm" 
              onClick={() => onTabChange('settings')} 
              title="Edit Rates"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              </svg>
            </button>
          </div>
          
          <div className="settings-summary">
            <div className="setting-item-preview">
              <span className="label">House Rent</span>
              <span className="val">₹{(settings?.defaultHouseRent || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="setting-item-preview">
              <span className="label">Elec. Rate / Unit</span>
              <span className="val">₹{settings?.defaultElecRate || 0}/unit</span>
            </div>
            <div className="setting-item-preview">
              <span className="label">Water Jar Rate</span>
              <span className="val">₹{settings?.defaultWaterRate || 0}/jar</span>
            </div>
            <div className="setting-item-preview">
              <span className="label">Landlord Name</span>
              <span className="val">{settings?.landlordName || "Not Setup"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Other Charges Breakdown Modal Popup */}
      {showOtherModal && (
        <div style={modalStyles.overlay} onClick={() => setShowOtherModal(false)}>
          <div style={modalStyles.content} onClick={(e) => e.stopPropagation()}>
            <div style={modalStyles.header}>
              <h3 style={modalStyles.title}>Other Charges Breakdown</h3>
              <button onClick={() => setShowOtherModal(false)} style={modalStyles.closeBtn}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" stroke-linejoin="round" width="18" height="18">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            
            <div style={modalStyles.body}>
              {calculateOtherBreakdown().length === 0 ? (
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', margin: '2rem 0' }}>No other charges recorded yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%', maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
                  {calculateOtherBreakdown().map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#fff' }}>{item.name}</span>
                      <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#6366f1' }}>₹{item.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={() => setShowOtherModal(false)} style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
  },
  content: {
    background: 'rgba(16, 16, 22, 0.96)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '24px',
    padding: '1.75rem',
    width: '90%',
    maxWidth: '400px',
    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.6)',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    paddingBottom: '0.75rem'
  },
  title: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#fff',
    margin: 0
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
    transition: 'color 0.2s'
  },
  body: {
    textAlign: 'center',
    padding: '0.25rem 0'
  }
};
