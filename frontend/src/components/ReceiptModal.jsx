import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';

export default function ReceiptModal({ isOpen, onClose, payment, settings, showToast }) {
  const receiptRef = useRef(null);
  const [sharing, setSharing] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen || !payment) return null;

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

  const handlePrint = () => {
    window.print();
  };

  // Compile receipt wrapper to canvas blob
  const generateReceiptBlob = async () => {
    if (!receiptRef.current) return null;
    
    const element = receiptRef.current;
    
    // Temporarily force a fixed desktop width so the PNG doesn't shrink on mobile devices
    const originalWidth = element.style.width;
    const originalMaxWidth = element.style.maxWidth;
    const originalPadding = element.style.padding;
    
    // 580px is the natural maximum width of the receipt in index.css
    element.style.width = '580px';
    element.style.maxWidth = '580px';
    element.style.padding = '24px'; // Match standard padding
    
    try {
      // Use higher scale (3x) for clean, high-resolution text and images
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        windowWidth: 580,
        logging: false
      });
      
      // Restore styles instantly so the user doesn't see the jump
      element.style.width = originalWidth;
      element.style.maxWidth = originalMaxWidth;
      element.style.padding = originalPadding;
      
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png', 1.0);
      });
    } catch (err) {
      console.error("Error generating receipt canvas:", err);
      
      // Restore styles on error
      element.style.width = originalWidth;
      element.style.maxWidth = originalMaxWidth;
      element.style.padding = originalPadding;
      
      return null;
    }
  };

  const handleDownloadPNG = async () => {
    setDownloading(true);
    try {
      const blob = await generateReceiptBlob();
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Receipt_${payment.month}_${payment.id.substring(0, 5)}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        showToast("Failed to render PNG image. Try using standard Print/PDF option.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error saving PNG image.", "error");
    } finally {
      setDownloading(false);
    }
  };

  const handleShareWhatsApp = async () => {
    setSharing(true);
    try {
      const blob = await generateReceiptBlob();
      if (!blob) {
        showToast("Failed to compile image for sharing.", "error");
        setSharing(false);
        return;
      }

      const file = new File([blob], `Receipt_${payment.month}.png`, { type: 'image/png' });

      // 1. Mobile Web Share API support
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Rent Receipt',
          text: `Rent Receipt for ${formatMonthName(payment.month)}`
        });
      } else {
        // 2. Desktop Fallback - Copy Image to Clipboard and redirect to WhatsApp Web
        try {
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          
          showToast("Receipt copied! Opening WhatsApp... Paste the image (Ctrl+V) directly in your chat.", "success");
          
          // Open WhatsApp Web
          window.open(`https://web.whatsapp.com/`, '_blank');
        } catch (clipErr) {
          console.warn("Clipboard writing failed, falling back to saving image file: ", clipErr);
          // 3. Ultra Fallback: Save file automatically
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Receipt_${payment.month}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          
          showToast("Receipt downloaded. Opening WhatsApp... Please attach the photo from your gallery.", "success");
          
          // Open WhatsApp via universal deep link after a short delay to allow download execution
          setTimeout(() => {
            const message = `Here is the Rent Receipt for ${formatMonthName(payment.month)}.`;
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
          }, 1000);
        }
      }
    } catch (err) {
      console.error(err);
      showToast("Error sharing on WhatsApp.", "error");
    } finally {
      setSharing(false);
    }
  };

  // Calculate calculations details
  const elecUnits = payment.currMeter - payment.prevMeter;

  return (
    <div className="modal-overlay active" id="receipt-modal-overlay">
      <div className="modal-content" style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <h3>Rent Receipt Invoice</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close Receipt">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Printable/Canvas Receipt Paper Wrapper */}
        <div className="receipt-wrapper" ref={receiptRef} id="receipt-print-wrapper">
          <div className="receipt-brand-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.25rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', letterSpacing: '-0.5px', fontFamily: 'var(--font-mono)' }}>RentTrace</span>
          </div>

          <div className="receipt-header">
            <h2>RENT PAYMENT RECEIPT</h2>
            <p>Generated on {formatReadableDate(payment.date)}</p>
          </div>

          <div className="receipt-meta-grid">
            <div className="receipt-meta-item">
              <span className="label">Landlord Name</span>
              <span className="value">{settings?.landlordName || "Owner"}</span>
            </div>
            <div className="receipt-meta-item">
              <span className="label">Tenant Name</span>
              <span className="value">{settings?.tenantName || "Tenant"}</span>
            </div>
            <div className="receipt-meta-item">
              <span className="label">Billing Month</span>
              <span className="value">{formatMonthName(payment.month)}</span>
            </div>
            <div className="receipt-meta-item">
              <span className="label">Transaction ID / Ref</span>
              <span className="value" style={{ fontFamily: 'var(--font-mono)' }}>
                {payment.txnId || "Paid by Cash (N/A)"}
              </span>
            </div>
          </div>

          {/* Breakdown Table */}
          <table className="receipt-bill-table">
            <thead>
              <tr>
                <th>Description</th>
                <th className="text-right">Details</th>
                <th className="text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {payment.houseRent > 0 && (
                <tr>
                  <td>House Rent</td>
                  <td className="text-right">Base monthly rate</td>
                  <td className="text-right">₹{payment.houseRent.toFixed(2)}</td>
                </tr>
              )}
              {payment.elecAmount > 0 && (
                <tr>
                  <td>Electricity Bill</td>
                  <td className="text-right">
                    {payment.currMeter} - {payment.prevMeter} = {elecUnits.toFixed(1)} units @ ₹{payment.elecRate}/unit
                  </td>
                  <td className="text-right">₹{payment.elecAmount.toFixed(2)}</td>
                </tr>
              )}
              {payment.waterJars > 0 && (
                <tr>
                  <td>Water Jar utilities</td>
                  <td className="text-right">
                    {payment.waterJars} jars @ ₹{payment.waterRate}/jar
                  </td>
                  <td className="text-right">₹{payment.waterAmount.toFixed(2)}</td>
                </tr>
              )}
              {payment.otherCharges && payment.otherCharges.length > 0 ? (
                payment.otherCharges.map((charge, index) => (
                  <tr key={`other-${index}`}>
                    <td>{charge.desc || "Additional Facility"}</td>
                    <td className="text-right">Other Charge</td>
                    <td className="text-right">₹{charge.amount.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                payment.otherAmount > 0 && (
                  <tr>
                    <td>Other Charges</td>
                    <td className="text-right">{payment.otherDesc || "Additional utility"}</td>
                    <td className="text-right">₹{payment.otherAmount.toFixed(2)}</td>
                  </tr>
                )
              )}
              <tr className="total-row">
                <td>Grand Total Due</td>
                <td></td>
                <td className="text-right">₹{payment.grandTotal.toFixed(2)}</td>
              </tr>
              <tr style={{ background: 'none' }}>
                <td style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>Amount Paid</td>
                <td></td>
                <td className="text-right" style={{ fontWeight: 700, fontSize: '1rem', color: '#10b981' }}>
                  ₹{payment.paidAmount.toFixed(2)}
                </td>
              </tr>
              <tr style={{ background: 'none' }}>
                <td style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>Payment Method</td>
                <td></td>
                <td className="text-right">
                  <span className={`badge ${payment.paymentMethod === 'online' ? 'badge-indigo' : 'badge-purple'}`} style={{ margin: 0 }}>
                    {payment.paymentMethod}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Evidence proof images section */}
          <div className="receipt-evidence-section">
            <h4 className="receipt-evidence-title">Documented Image Proofs</h4>
            <div className="receipt-images-grid">
              {payment.meterImage && (
                <div className="receipt-img-container">
                  <img src={payment.meterImage} alt="Meter Proof" />
                  <span>Meter Reading ({payment.currMeter} kWh)</span>
                </div>
              )}
              {payment.paymentMethod === 'online' && payment.paymentScreenshot && (
                <div className="receipt-img-container">
                  <img src={payment.paymentScreenshot} alt="Payment Proof" />
                  <span>Transaction Screenshot</span>
                </div>
              )}
            </div>
          </div>

          <div className="receipt-footer-msg" style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px dashed #cbd5e1', textAlign: 'center' }}>
            <p style={{ fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>Thank you for your prompt payment!</p>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.25rem' }}>This document serves as a valid invoice ledger statement.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem', color: '#94a3b8' }}>
              <span>Printed on: {new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
              <span>Powered by <strong style={{ color: '#64748b' }}>RentTrace</strong> — Smart Utility Management</span>
              <span><a href="https://rent-trace.vercel.app" style={{ color: '#6366f1', textDecoration: 'none' }}>rent-trace.vercel.app</a></span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="receipt-actions">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={handleDownloadPNG} 
            disabled={downloading}
            style={{ flex: 1 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" width="16" height="16">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" x2="12" y1="15" y2="3"/>
            </svg>
            {downloading ? "Generating..." : "Save as PNG Image"}
          </button>
          
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={handleShareWhatsApp} 
            disabled={sharing}
            style={{ flex: 1 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" width="16" height="16">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/>
              <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>
            </svg>
            {sharing ? "Preparing..." : "Share on WhatsApp"}
          </button>

          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={handlePrint}
            style={{ flex: 1 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" width="16" height="16">
              <polyline points="6 9 6 2 18 2 18 9"/>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
            Print / Save PDF
          </button>
        </div>
      </div>
    </div>
  );
}
