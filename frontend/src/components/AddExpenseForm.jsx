import React, { useState, useEffect } from 'react';

export default function AddExpenseForm({ settings, onSavePayment, openCamera, paymentSS, setPaymentSS, showToast, setActiveTab }) {
  // Setup default dates
  const today = new Date();
  const defaultMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const defaultDate = today.toISOString().split('T')[0];

  // State fields
  const [expenseMonth, setExpenseMonth] = useState(defaultMonth);
  const [expenseDate, setExpenseDate] = useState(defaultDate);
  
  // List of expense items in state: Array of { category, amount, customCategory }
  const [expenseItems, setExpenseItems] = useState(() => {
    if (settings?.customServices && settings.customServices.length > 0) {
      return [{
        category: settings.customServices[0].name,
        amount: settings.customServices[0].rate.toString(),
        customCategory: ''
      }];
    }
    return [{ category: 'Other', amount: '', customCategory: '' }];
  });

  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [txnId, setTxnId] = useState('');

  // Sync settings when they load
  useEffect(() => {
    if (settings?.customServices && settings.customServices.length > 0) {
      setExpenseItems([{
        category: settings.customServices[0].name,
        amount: settings.customServices[0].rate.toString(),
        customCategory: ''
      }]);
    }
  }, [settings]);

  // Add a new row to the items list
  const handleAddItem = () => {
    const initialCategory = settings?.customServices && settings.customServices.length > 0
      ? settings.customServices[0].name
      : 'Other';
    const initialAmount = settings?.customServices && settings.customServices.length > 0
      ? settings.customServices[0].rate.toString()
      : '';
    setExpenseItems([...expenseItems, { category: initialCategory, amount: initialAmount, customCategory: '' }]);
  };

  // Remove a row from the items list
  const handleRemoveItem = (index) => {
    const updated = expenseItems.filter((_, i) => i !== index);
    setExpenseItems(updated.length > 0 ? updated : [{ category: 'Other', amount: '', customCategory: '' }]);
  };

  // Change fields of a specific row in the list
  const handleItemFieldChange = (index, field, value) => {
    const updated = expenseItems.map((item, i) => {
      if (i === index) {
        const newItem = { ...item, [field]: value };
        
        // Auto-populate rate if category changed to a custom service
        if (field === 'category' && value !== 'Other' && settings?.customServices) {
          const match = settings.customServices.find(s => s.name === value);
          if (match) {
            newItem.amount = match.rate.toString();
          }
        }
        if (field === 'category' && value === 'Other') {
          newItem.amount = '';
        }
        return newItem;
      }
      return item;
    });
    setExpenseItems(updated);
  };

  const parseNum = (val) => parseFloat(val) || 0;

  // Calculate sum of all row amounts
  const grandTotal = expenseItems.reduce((sum, item) => sum + parseNum(item.amount), 0);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Build the final charges list by filtering out empty descriptions or zero amounts
    const validCharges = expenseItems
      .filter(item => {
        const finalCat = item.category === 'Other' ? item.customCategory.trim() : item.category;
        return finalCat !== '' && parseNum(item.amount) > 0;
      })
      .map(item => {
        const finalCat = item.category === 'Other' ? item.customCategory.trim() : item.category;
        return { desc: finalCat, amount: parseNum(item.amount) };
      });

    if (validCharges.length === 0) {
      showToast("Please add at least one valid expense item with an amount greater than 0!", "error");
      return;
    }

    if (paymentMethod === 'online') {
      if (!txnId || !paymentSS) {
        showToast("Please provide transaction ID and payment screenshot for online payments.", "error");
        return;
      }
    }

    const calculatedTotal = validCharges.reduce((sum, c) => sum + c.amount, 0);
    const otherDesc = validCharges.map(c => c.desc).join(', ') + (notes ? ` (${notes})` : '');

    // Call save callback with structured payment data
    onSavePayment({
      month: expenseMonth,
      date: expenseDate,
      houseRent: 0,
      prevMeter: 0,
      currMeter: 0,
      elecRate: 0,
      elecAmount: 0,
      meterImage: '',
      waterJars: 0,
      waterRate: 0,
      waterAmount: 0,
      otherCharges: validCharges,
      otherDesc: otherDesc,
      otherAmount: calculatedTotal,
      grandTotal: calculatedTotal,
      paymentMethod: paymentMethod,
      paidAmount: calculatedTotal,
      txnId: paymentMethod === 'online' ? txnId : '',
      paymentScreenshot: paymentMethod === 'online' ? paymentSS : ''
    });

    // Reset Form
    resetForm();
  };

  const resetForm = () => {
    setExpenseMonth(defaultMonth);
    setExpenseDate(defaultDate);
    
    if (settings?.customServices && settings.customServices.length > 0) {
      setExpenseItems([{
        category: settings.customServices[0].name,
        amount: settings.customServices[0].rate.toString(),
        customCategory: ''
      }]);
    } else {
      setExpenseItems([{ category: 'Other', amount: '', customCategory: '' }]);
    }
    
    setNotes('');
    setPaymentMethod('cash');
    setTxnId('');
    setPaymentSS('');
  };

  return (
    <div className="content-card">
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          
          {/* Section 1: Expense Details */}
          <h3 className="form-section-title">Expense Info</h3>
          
          <div className="form-group">
            <label htmlFor="expense-month">Month Selection *</label>
            <input 
              type="month" 
              id="expense-month" 
              value={expenseMonth}
              onChange={(e) => setExpenseMonth(e.target.value)}
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="expense-date">Payment Date *</label>
            <input 
              type="date" 
              id="expense-date" 
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              required 
            />
          </div>

          {/* Dynamic Rows of Expense Items */}
          <div className="form-group full-width" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255,255,255,0.7)', textAlign: 'left' }}>Expense Items & Facilities</label>
            
            {expenseItems.map((item, index) => {
              const showCustomInput = item.category === 'Other';
              return (
                <div key={index} className="dynamic-charge-card">
                  <div className="dynamic-charge-row">
                    {/* Category Select Dropdown */}
                    <div className="dynamic-charge-select">
                      <select
                        value={item.category}
                        onChange={(e) => handleItemFieldChange(index, 'category', e.target.value)}
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
                          value={item.amount}
                          onChange={(e) => handleItemFieldChange(index, 'amount', e.target.value)}
                          style={{ width: '100%' }}
                          required
                        />
                      </div>

                      {/* Remove Row Button */}
                      {expenseItems.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => handleRemoveItem(index)}
                          style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Remove Item"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" stroke-linejoin="round" width="14" height="14">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Conditionally rendered Custom Category Input below it */}
                  {showCustomInput && (
                    <div style={{ width: '100%', marginTop: '0.25rem' }}>
                      <input
                        type="text"
                        placeholder="Specify custom category / title (e.g. Newspaper, Repairs)"
                        value={item.customCategory}
                        onChange={(e) => handleItemFieldChange(index, 'customCategory', e.target.value)}
                        style={{ width: '100%', marginBottom: 0 }}
                        required
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Add Item Button */}
            <div style={{ textAlign: 'left', marginTop: '0.25rem' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleAddItem}
                style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px dashed rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.02)' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" stroke-linejoin="round" width="12" height="12">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Another Expense Item
              </button>
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="expense-notes">Notes / Description</label>
            <textarea 
              id="expense-notes" 
              placeholder="Provide context or description..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
            />
          </div>

          {/* Billing Calculation Info Panel */}
          <div className="calc-info-panel" style={{ gridColumn: 'span 2' }}>
            <div className="calc-details">
              <h4>Total Expense Amount</h4>
              <p>Sum of all listed items</p>
            </div>
            <div className="calc-total">₹{grandTotal.toFixed(2)}</div>
          </div>

          {/* Section 2: Payment Details */}
          <h3 className="form-section-title" style={{ marginTop: '1rem' }}>Payment Method Details</h3>
          
          <div className="form-group">
            <label htmlFor="expense-payment-method">Payment Method *</label>
            <select 
              id="expense-payment-method" 
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
            >
              <option value="cash">Cash Payment</option>
              <option value="online">Online Payment (UPI/Netbanking)</option>
            </select>
          </div>

          <div className="form-group">
            {/* Blank placeholder for balance grid */}
          </div>

          {/* Online Payment Conditional Fields */}
          {paymentMethod === 'online' && (
            <>
              <div className="form-group online-only-field">
                <label htmlFor="expense-txn-id">Transaction ID / UTR *</label>
                <input 
                  type="text" 
                  id="expense-txn-id" 
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

          {/* Form Action Controls */}
          <div className="form-group full-width" style={{ flexDirection: 'row', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('dashboard')}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Expense Details</button>
          </div>

        </div>
      </form>
    </div>
  );
}
