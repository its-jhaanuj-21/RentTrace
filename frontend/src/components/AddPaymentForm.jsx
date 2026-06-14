import React, { useState, useEffect } from 'react';

export default function AddPaymentForm({ settings, payments, onSavePayment, openCamera, meterImage, paymentSS, setMeterImage, setPaymentSS, showToast }) {
  // Setup default dates
  const today = new Date();
  const defaultMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const defaultDate = today.toISOString().split('T')[0];

  // State fields
  const [rentMonth, setRentMonth] = useState(defaultMonth);
  const [rentDate, setRentDate] = useState(defaultDate);
  const [houseRent, setHouseRent] = useState(settings?.defaultHouseRent || 0);
  const [prevMeter, setPrevMeter] = useState(settings?.initialMeterReading || 0);
  const [currMeter, setCurrMeter] = useState('');
  const [elecRate, setElecRate] = useState(settings?.defaultElecRate || 0);
  

  
  const [otherCharges, setOtherCharges] = useState([]);
  
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paidAmount, setPaidAmount] = useState('');
  const [txnId, setTxnId] = useState('');

  // Sync settings when they load
  useEffect(() => {
    if (settings) {
      setHouseRent(settings.defaultHouseRent || 0);
      setElecRate(settings.defaultElecRate || 0);
    }
  }, [settings]);

  // Handle Month Change to dynamically fetch previous reading
  useEffect(() => {
    if (!rentMonth) return;
    
    // Sort payments chronologically by month
    const sorted = [...payments].sort((a, b) => b.month.localeCompare(a.month));
    // Find the closest record before the selected month
    const pastRecord = sorted.find(p => p.month < rentMonth);
    
    if (pastRecord) {
      setPrevMeter(pastRecord.currMeter);
    } else {
      setPrevMeter(settings?.initialMeterReading || 0);
    }
  }, [rentMonth, payments, settings]);

  // Calculations
  const parseNum = (val) => parseFloat(val) || 0;
  
  const elecUnits = Math.max(0, parseNum(currMeter) - parseNum(prevMeter));
  const elecCost = elecUnits * parseNum(elecRate);
  
  const otherCost = otherCharges.reduce((sum, charge) => sum + parseNum(charge.amount), 0);

  const handleAddOtherCharge = () => {
    const initialCategory = settings?.customServices && settings.customServices.length > 0
      ? settings.customServices[0].name
      : 'Other';
    const initialAmount = settings?.customServices && settings.customServices.length > 0
      ? settings.customServices[0].rate.toString()
      : '';
    setOtherCharges([...otherCharges, { category: initialCategory, amount: initialAmount, customCategory: '' }]);
  };

  const handleRemoveOtherCharge = (index) => {
    const updated = otherCharges.filter((_, i) => i !== index);
    setOtherCharges(updated);
  };

  const handleOtherChargeFieldChange = (index, field, value) => {
    const updated = otherCharges.map((charge, i) => {
      if (i === index) {
        const newCharge = { ...charge, [field]: value };
        if (field === 'category' && value !== 'Other' && settings?.customServices) {
          const match = settings.customServices.find(s => s.name === value);
          if (match) {
            newCharge.amount = match.rate.toString();
          }
        }
        if (field === 'category' && value === 'Other') {
          newCharge.amount = '';
        }
        return newCharge;
      }
      return charge;
    });
    setOtherCharges(updated);
  };
  
  const grandTotal = parseNum(houseRent) + elecCost + otherCost;

  // Auto-sync paid amount to grand total by default
  useEffect(() => {
    setPaidAmount(grandTotal.toFixed(2));
  }, [grandTotal]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!meterImage) {
      showToast("Please capture/upload the meter reading proof image!", "error");
      return;
    }

    if (parseNum(currMeter) < parseNum(prevMeter)) {
      showToast("Current meter reading cannot be lower than the previous reading!", "error");
      return;
    }

    if (paymentMethod === 'online') {
      if (!txnId || !paymentSS) {
        showToast("Please provide transaction ID and payment screenshot for online payments.", "error");
        return;
      }
    }

    // Call save callback
    onSavePayment({
      month: rentMonth,
      date: rentDate,
      houseRent: parseNum(houseRent),
      prevMeter: parseNum(prevMeter),
      currMeter: parseNum(currMeter),
      elecRate: parseNum(elecRate),
      elecAmount: elecCost,
      meterImage: meterImage,
      waterJars: 0,
      waterRate: 0,
      waterAmount: 0,
      otherCharges: otherCharges
        .filter(c => {
          const finalDesc = c.category === 'Other' ? c.customCategory.trim() : c.category;
          return finalDesc !== '' && parseNum(c.amount) > 0;
        })
        .map(c => {
          const finalDesc = c.category === 'Other' ? c.customCategory.trim() : c.category;
          return { desc: finalDesc, amount: parseNum(c.amount) };
        }),
      otherDesc: otherCharges
        .map(c => c.category === 'Other' ? c.customCategory.trim() : c.category)
        .filter(Boolean)
        .join(', '),
      otherAmount: otherCost,
      grandTotal: grandTotal,
      paymentMethod: paymentMethod,
      paidAmount: parseNum(paidAmount),
      txnId: paymentMethod === 'online' ? txnId : '',
      paymentScreenshot: paymentMethod === 'online' ? paymentSS : ''
    });

    // Reset Form
    resetForm();
  };

  const resetForm = () => {
    setRentMonth(defaultMonth);
    setRentDate(defaultDate);
    setHouseRent(settings?.defaultHouseRent || 0);
    setCurrMeter('');
    setOtherCharges([]);
    setPaymentMethod('cash');
    setTxnId('');
    setMeterImage('');
    setPaymentSS('');
  };

  return (
    <div className="content-card">
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          
          {/* Section 1: Rent & Schedule */}
          <h3 className="form-section-title">Rent & Schedule</h3>
          
          <div className="form-group">
            <label htmlFor="rent-month">Month Selection *</label>
            <input 
              type="month" 
              id="rent-month" 
              value={rentMonth}
              onChange={(e) => setRentMonth(e.target.value)}
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="rent-date">Payment Date *</label>
            <input 
              type="date" 
              id="rent-date" 
              value={rentDate}
              onChange={(e) => setRentDate(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="rent-house-amount">House Rent Amount (₹) *</label>
            <div className="input-with-addon">
              <span className="input-addon-left">₹</span>
              <input 
                type="number" 
                id="rent-house-amount" 
                min="0" 
                step="0.01" 
                value={houseRent}
                onChange={(e) => setHouseRent(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="rent-prev-meter">Previous Meter Reading (kWh) *</label>
            <input 
              type="number" 
              id="rent-prev-meter" 
              min="0" 
              step="0.01" 
              value={prevMeter}
              onChange={(e) => setPrevMeter(e.target.value)}
              placeholder="Enter previous reading"
              required 
            />
          </div>

          {/* Section 2: Electricity Bill Details */}
          <h3 className="form-section-title">Electricity Bill Details</h3>
          
          <div className="form-group">
            <label htmlFor="rent-curr-meter">Current Meter Reading (kWh) *</label>
            <input 
              type="number" 
              id="rent-curr-meter" 
              min="0" 
              step="0.01" 
              value={currMeter}
              onChange={(e) => setCurrMeter(e.target.value)}
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="rent-elec-rate">Electricity Rate (₹/Unit) *</label>
            <div className="input-with-addon">
              <span className="input-addon-left">₹</span>
              <input 
                type="number" 
                id="rent-elec-rate" 
                min="0" 
                step="0.01" 
                value={elecRate}
                onChange={(e) => setElecRate(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="rent-elec-amount">Calculated Electricity Bill (₹)</label>
            <div className="input-with-addon">
              <span className="input-addon-left">₹</span>
              <input 
                type="number" 
                id="rent-elec-amount" 
                value={elecCost.toFixed(2)}
                readOnly 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Meter Reading Image Proof *</label>
            <div className="capture-container">
              <div className="capture-preview-box">
                {meterImage ? (
                  <img src={meterImage} alt="Meter Reading Preview" />
                ) : (
                  <span className="text-dark">No Image Captured</span>
                )}
              </div>
              <button 
                type="button" 
                className="btn btn-secondary btn-capture-trigger" 
                onClick={() => openCamera('meter')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" width="16" height="16">
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                  <circle cx="12" cy="13" r="3"/>
                </svg>
                Capture Reading
              </button>
            </div>
          </div>



          {/* Section 4: Other Charges & Totals */}
          <h3 className="form-section-title">Other Charges & Payment Summary</h3>

          <div className="form-group full-width" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255,255,255,0.7)', textAlign: 'left' }}>Facilities & Additional Charges</label>
            
            {otherCharges.map((charge, index) => {
              const showCustomInput = charge.category === 'Other';
              return (
                <div key={index} className="dynamic-charge-card">
                  <div className="dynamic-charge-row">
                    {/* Category Select Dropdown */}
                    <div className="dynamic-charge-select">
                      <select
                        value={charge.category}
                        onChange={(e) => handleOtherChargeFieldChange(index, 'category', e.target.value)}
                        style={{ width: '100%', marginBottom: 0 }}
                        required
                      >
                        {settings?.customServices?.map((service, idx) => (
                          <option key={`custom-${idx}`} value={service.name}>
                            {service.name} (₹{service.rate})
                          </option>
                        ))}
                        {settings?.customServices?.length > 0 && <option disabled>──────────</option>}
                        <option value="Other">Other (Specify below)</option>
                      </select>
                    </div>

                    <div className="dynamic-charge-inputs">
                      {/* Amount Input */}
                      <div className="input-with-addon dynamic-charge-amount">
                        <span className="input-addon-left">₹</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={charge.amount}
                          onChange={(e) => handleOtherChargeFieldChange(index, 'amount', e.target.value)}
                          style={{ width: '100%' }}
                          required
                        />
                      </div>

                      {/* Remove Row Button */}
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => handleRemoveOtherCharge(index)}
                        style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="Remove Item"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" stroke-linejoin="round" width="14" height="14">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Conditionally rendered Custom Category Input below it */}
                  {showCustomInput && (
                    <div style={{ width: '100%', marginTop: '0.25rem' }}>
                      <input
                        type="text"
                        placeholder="Specify custom category / title (e.g. Newspaper, Repairs)"
                        value={charge.customCategory}
                        onChange={(e) => handleOtherChargeFieldChange(index, 'customCategory', e.target.value)}
                        style={{ width: '100%', marginBottom: 0 }}
                        required
                      />
                    </div>
                  )}
                </div>
              );
            })}
            
            <div style={{ textAlign: 'left' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleAddOtherCharge}
                style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px dashed rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.02)' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" stroke-linejoin="round" width="12" height="12">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Custom Facility Charge
              </button>
            </div>
          </div>

          {/* Billing Calculation Info Panel */}
          <div className="calc-info-panel">
            <div className="calc-details">
              <h4>Grand Total Calculated</h4>
              <p>House Rent + Electricity + Water Jars + Other</p>
            </div>
            <div className="calc-total">₹{grandTotal.toFixed(2)}</div>
          </div>

          {/* Payment Method Details */}
          <div className="form-section-title" style={{ marginTop: '1.5rem' }}>Payment Method Details</div>
          
          <div className="form-group">
            <label htmlFor="rent-payment-method">Payment Method *</label>
            <select 
              id="rent-payment-method" 
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
            >
              <option value="cash">Cash Payment</option>
              <option value="online">Online Payment (UPI/Netbanking)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="rent-paid-amount">Amount Paid (₹) *</label>
            <div className="input-with-addon">
              <span className="input-addon-left">₹</span>
              <input 
                type="number" 
                id="rent-paid-amount" 
                min="0" 
                step="0.01" 
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                required 
              />
            </div>
          </div>

          {/* Online Payment Conditional Fields */}
          {paymentMethod === 'online' && (
            <>
              <div className="form-group online-only-field">
                <label htmlFor="rent-txn-id">Transaction ID / UTR *</label>
                <input 
                  type="text" 
                  id="rent-txn-id" 
                  placeholder="Enter Transaction ID / Reference"
                  value={txnId}
                  onChange={(e) => setTxnId(e.target.value)}
                  required
                />
              </div>

              <div className="form-group online-only-field">
                <label>Screenshot of Payment *</label>
                <div className="capture-container">
                  <div className="capture-preview-box">
                    {paymentSS ? (
                      <img src={paymentSS} alt="Payment Screenshot Preview" />
                    ) : (
                      <span className="text-dark">No Image Uploaded</span>
                    )}
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-capture-trigger" 
                    onClick={() => openCamera('payment')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" width="16" height="16">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" x2="12" y1="3" y2="15"/>
                    </svg>
                    Capture / Upload Screenshot
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Form Buttons */}
          <div className="form-group full-width" style={{ flexDirection: 'row', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={resetForm}>Reset Details</button>
            <button type="submit" className="btn btn-primary">Save & Record Rent</button>
          </div>

        </div>
      </form>
    </div>
  );
}
