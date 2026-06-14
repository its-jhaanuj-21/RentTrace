import React, { useState, useEffect } from 'react';

export default function Settings({ settings, onSaveSettings, onResetSettings, showConfirm }) {
  const [tenantName, setTenantName] = useState('');
  const [tenantPhone, setTenantPhone] = useState('');
  const [defaultHouseRent, setDefaultHouseRent] = useState('');
  const [defaultElecRate, setDefaultElecRate] = useState('');
  const [defaultWaterRate, setDefaultWaterRate] = useState('');
  const [initialMeterReading, setInitialMeterReading] = useState('');
  const [landlordName, setLandlordName] = useState('');
  const [landlordUpi, setLandlordUpi] = useState('');
  const [landlordDetails, setLandlordDetails] = useState('');
  const [customServices, setCustomServices] = useState([]);

  useEffect(() => {
    if (settings) {
      setTenantName(settings.tenantName || '');
      setTenantPhone(settings.tenantPhone || '');
      setDefaultHouseRent(settings.defaultHouseRent || 0);
      setDefaultElecRate(settings.defaultElecRate || 0);
      setDefaultWaterRate(settings.defaultWaterRate || 0);
      setInitialMeterReading(settings.initialMeterReading || 0);
      setLandlordName(settings.landlordName || '');
      setLandlordUpi(settings.landlordUpi || '');
      setLandlordDetails(settings.landlordDetails || '');
      setCustomServices(settings.customServices || []);
    }
  }, [settings]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings({
      tenantName,
      tenantPhone,
      defaultHouseRent: parseFloat(defaultHouseRent) || 0,
      defaultElecRate: parseFloat(defaultElecRate) || 0,
      defaultWaterRate: parseFloat(defaultWaterRate) || 0,
      initialMeterReading: parseFloat(initialMeterReading) || 0,
      landlordName,
      landlordUpi,
      landlordDetails,
      customServices: customServices
        .filter(s => s.name.trim() !== '')
        .map(s => ({ name: s.name, rate: parseFloat(s.rate) || 0 }))
    });
  };

  const handleReset = () => {
    showConfirm({
      title: 'Reset Defaults',
      message: 'Are you sure you want to reset all configurations to empty system defaults?',
      type: 'danger',
      onConfirm: onResetSettings
    });
  };

  return (
    <div className="content-card">
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <h3 className="form-section-title">Tenant & Rent Config</h3>
          
          <div className="form-group">
            <label htmlFor="config-tenant-name">Tenant Full Name</label>
            <input 
              type="text" 
              id="config-tenant-name" 
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
              placeholder="Your Name"
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="config-tenant-phone">Tenant Mobile Number</label>
            <input 
              type="tel" 
              id="config-tenant-phone" 
              value={tenantPhone}
              onChange={(e) => setTenantPhone(e.target.value)}
              placeholder="e.g. +91 98765 43210"
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="config-house-rent">Default House Rent (₹) *</label>
            <div className="input-with-addon">
              <span className="input-addon-left">₹</span>
              <input 
                type="number" 
                id="config-house-rent" 
                min="0" 
                step="0.01" 
                value={defaultHouseRent}
                onChange={(e) => setDefaultHouseRent(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="config-elec-rate">Default Electricity Rate (₹/Unit) *</label>
            <div className="input-with-addon">
              <span className="input-addon-left">₹</span>
              <input 
                type="number" 
                id="config-elec-rate" 
                min="0" 
                step="0.01" 
                value={defaultElecRate}
                onChange={(e) => setDefaultElecRate(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="config-initial-meter">Initial Meter Reading Start (kWh) *</label>
            <input 
              type="number" 
              id="config-initial-meter" 
              min="0" 
              step="0.01" 
              value={initialMeterReading}
              onChange={(e) => setInitialMeterReading(e.target.value)}
              required 
            />
          </div>

          {/* Custom Availing Services & Facilities */}
          <h3 className="form-section-title" style={{ marginTop: '1.5rem' }}>Availing Services & Facilities</h3>
          
          <div className="form-group full-width" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', textAlign: 'left' }}>Add recurring services/facilities (e.g. WiFi, Parking, Gas Cylinder) with their default rates:</label>
            
            {customServices.map((service, index) => (
              <div key={index} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', width: '100%' }}>
                <div style={{ flex: 2 }}>
                  <input 
                    type="text" 
                    placeholder="e.g. WiFi, Gas Cylinder, Parking"
                    value={service.name}
                    onChange={(e) => {
                      const updated = customServices.map((s, idx) => idx === index ? { ...s, name: e.target.value } : s);
                      setCustomServices(updated);
                    }}
                    style={{ width: '100%', marginBottom: 0 }}
                    required
                  />
                </div>
                <div style={{ flex: 1.2 }}>
                  <div className="input-with-addon" style={{ marginBottom: 0 }}>
                    <span className="input-addon-left">₹</span>
                    <input 
                      type="number" 
                      min="0" 
                      step="0.01" 
                      placeholder="Rate / Cost"
                      value={service.rate}
                      onChange={(e) => {
                        const val = e.target.value;
                        const updated = customServices.map((s, idx) => idx === index ? { ...s, rate: val } : s);
                        setCustomServices(updated);
                      }}
                      style={{ width: '100%' }}
                      required
                    />
                  </div>
                </div>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => {
                    const updated = customServices.filter((_, idx) => idx !== index);
                    setCustomServices(updated);
                  }}
                  style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Remove Service"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                  </svg>
                </button>
              </div>
            ))}
            
            <div style={{ textAlign: 'left' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setCustomServices([...customServices, { name: '', rate: 0 }])}
                style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px dashed rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.02)' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add New Service / Facility
              </button>
            </div>
          </div>

          <h3 className="form-section-title">Landlord / Owner Details</h3>
          
          <div className="form-group">
            <label htmlFor="config-landlord-name">Landlord Full Name</label>
            <input 
              type="text" 
              id="config-landlord-name" 
              value={landlordName}
              onChange={(e) => setLandlordName(e.target.value)}
              placeholder="Owner Name"
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="config-landlord-upi">Landlord UPI ID (for pay link)</label>
            <input 
              type="text" 
              id="config-landlord-upi" 
              value={landlordUpi}
              onChange={(e) => setLandlordUpi(e.target.value)}
              placeholder="ownername@upi"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="config-landlord-details">Owner Bank / Contact Details</label>
            <textarea 
              id="config-landlord-details" 
              rows="3" 
              value={landlordDetails}
              onChange={(e) => setLandlordDetails(e.target.value)}
              placeholder="Account Number: xxxx xxxx xxxx&#10;IFSC Code: HDFC0001234&#10;Phone: +91 9876543210"
            ></textarea>
          </div>

          <div className="form-group full-width" style={{ display: 'flex', flexDirection: 'row', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={handleReset}>Reset Defaults</button>
            <button type="submit" className="btn btn-primary">Save Default Rates</button>
          </div>
        </div>
      </form>
    </div>
  );
}
