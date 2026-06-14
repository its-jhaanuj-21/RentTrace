import React, { useState } from 'react';

export default function PaymentHistory({ payments, onViewReceipt, onDeletePayment }) {
  const [filterYear, setFilterYear] = useState('all');

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

  const rentPayments = payments.filter(p => p.houseRent > 0 || p.elecAmount > 0 || p.waterAmount > 0);
  const expensePayments = payments.filter(p => p.houseRent === 0 && p.elecAmount === 0 && p.waterAmount === 0);

  const filteredRent = filterYear === 'all' 
    ? rentPayments 
    : rentPayments.filter(p => p.month.startsWith(filterYear));

  const filteredExpense = filterYear === 'all' 
    ? expensePayments 
    : expensePayments.filter(p => p.month.startsWith(filterYear));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Global Year Filter Header */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '-0.5rem' }}>
        <label htmlFor="filter-year" style={{ marginRight: '0.75rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>FILTER BY YEAR:</label>
        <select 
          id="filter-year" 
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: '8px', minWidth: '130px' }}
        >
          <option value="all">All Years</option>
          <option value="2026">2026</option>
          <option value="2027">2027</option>
        </select>
      </div>

      {/* Card 1: Rent Ledger Logs */}
      <div className="content-card">
        <div className="card-header">
          <h2>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
              <line x1="16" x2="16" y1="2" y2="6"/>
              <line x1="8" x2="8" y1="2" y2="6"/>
              <line x1="3" x2="21" y1="10" y2="10"/>
            </svg>
            Rent Ledger Logs
          </h2>
        </div>
        
        <div className="rent-table-wrapper">
          <table className="rent-table">
            <thead>
              <tr>
                <th>Billing Month</th>
                <th>Payment Date</th>
                <th>House Rent</th>
                <th>Electricity</th>
                <th>Other Charges</th>
                <th>Grand Total</th>
                <th>Paid Amount</th>
                <th>Method</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRent.length === 0 ? (
                <tr>
                  <td colSpan="9" className="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    No rent ledger logs match criteria.
                  </td>
                </tr>
              ) : (
                filteredRent.map(p => (
                  <tr key={p.id}>
                    <td data-label="Billing Month"><strong>{formatMonthName(p.month)}</strong></td>
                    <td data-label="Payment Date">{formatReadableDate(p.date)}</td>
                    <td data-label="House Rent">₹{p.houseRent.toLocaleString('en-IN')}</td>
                    <td data-label="Electricity">₹{p.elecAmount.toLocaleString('en-IN')}</td>
                    <td data-label="Other Charges">₹{((p.waterAmount || 0) + (p.otherAmount || 0)).toLocaleString('en-IN')}</td>
                    <td data-label="Grand Total"><strong>₹{p.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>
                    <td data-label="Paid Amount">₹{p.paidAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td data-label="Method">
                      <span className={`badge ${p.paymentMethod === 'online' ? 'badge-indigo' : 'badge-purple'}`}>
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td className="text-right" style={{ whiteSpace: 'nowrap' }}>
                      <button 
                        className="btn btn-secondary btn-sm btn-icon-only" 
                        onClick={() => onViewReceipt(p.id)} 
                        title="Invoice"
                        style={{ marginRight: '6px' }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                          <polyline points="14 2 14 8 20 8"/>
                          <line x1="16" x2="8" y1="13" y2="13"/>
                          <line x1="16" x2="8" y1="17" y2="17"/>
                          <line x1="10" x2="8" y1="9" y2="9"/>
                        </svg>
                      </button>
                      <button 
                        className="btn btn-danger btn-sm btn-icon-only" 
                        onClick={() => onDeletePayment(p.id)} 
                        title="Delete record"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                          <path d="M3 6h18"/>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card 2: Custom Expense Logs */}
      <div className="content-card">
        <div className="card-header">
          <h2>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/>
              <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>
            </svg>
            Custom Expense Logs
          </h2>
        </div>
        
        <div className="rent-table-wrapper">
          <table className="rent-table">
            <thead>
              <tr>
                <th>Billing Month</th>
                <th>Payment Date</th>
                <th>Service / Category</th>
                <th>Details / Notes</th>
                <th>Paid Amount</th>
                <th>Method</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpense.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    No custom expenses match criteria.
                  </td>
                </tr>
              ) : (
                filteredExpense.map(p => {
                  const serviceName = p.otherCharges && p.otherCharges.length > 0 ? p.otherCharges[0].desc : (p.otherDesc || 'Expense');
                  const serviceNotes = p.otherDesc && p.otherDesc.includes('(') 
                    ? p.otherDesc.slice(p.otherDesc.indexOf('(') + 1, -1) 
                    : '-';
                  
                  return (
                    <tr key={p.id}>
                      <td data-label="Billing Month"><strong>{formatMonthName(p.month)}</strong></td>
                      <td data-label="Payment Date">{formatReadableDate(p.date)}</td>
                      <td data-label="Service / Category">
                        <span style={{ fontWeight: 600, color: '#6366f1' }}>{serviceName}</span>
                      </td>
                      <td data-label="Details / Notes" style={{ opacity: 0.85 }}>{serviceNotes}</td>
                      <td data-label="Paid Amount"><strong>₹{p.paidAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>
                      <td data-label="Method">
                        <span className={`badge ${p.paymentMethod === 'online' ? 'badge-indigo' : 'badge-purple'}`}>
                          {p.paymentMethod}
                        </span>
                      </td>
                      <td className="text-right" style={{ whiteSpace: 'nowrap' }}>
                        <button 
                          className="btn btn-secondary btn-sm btn-icon-only" 
                          onClick={() => onViewReceipt(p.id)} 
                          title="Invoice"
                          style={{ marginRight: '6px' }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" x2="8" y1="13" y2="13"/>
                            <line x1="16" x2="8" y1="17" y2="17"/>
                            <line x1="10" x2="8" y1="9" y2="9"/>
                          </svg>
                        </button>
                        <button 
                          className="btn btn-danger btn-sm btn-icon-only" 
                          onClick={() => onDeletePayment(p.id)} 
                          title="Delete record"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                            <path d="M3 6h18"/>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
