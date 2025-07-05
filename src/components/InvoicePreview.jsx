import React, { useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ActionButton from './ActionButton';
import { Link } from 'react-router-dom';

const InvoicePreview = ({ invoice }) => {
  const pdfRef = useRef();

  const exportPDF = async () => {
    try {
      const input = pdfRef.current;
      const canvas = await html2canvas(input, { scale: 1.5, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const { width: imgW, height: imgH } = pdf.getImageProperties(imgData);
      const imgHeight = (imgH * pdfWidth) / imgW;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
      if (imgHeight > pdf.internal.pageSize.getHeight()) {
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, -pdf.internal.pageSize.getHeight(), pdfWidth, imgHeight);
      }
      pdf.save(`invoice-${invoice?.invoiceNumber || 'preview'}.pdf`);
    } catch (err) {
      console.error('Failed to export PDF', err);
      alert('Could not export PDF — please try again.');
    }
  };

  useEffect(() => {
    document.title = `Invoice #${invoice?.invoiceNumber || 'Preview'}`;
  }, [invoice]);

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading invoice...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-white via-[#edf2f7] to-white py-4 px-4">
      {/* Action Bar */}
      <div className="max-w-3xl mx-auto flex flex-wrap sm:flex-nowrap justify-end gap-3 mb-4 print:hidden">
        <ActionButton onClick={() => window.print()} className="bg-blue-600 text-white">
          🖨️ Print
        </ActionButton>
        <ActionButton onClick={exportPDF} className="bg-green-600 text-white">
          📄 Export PDF
        </ActionButton>
        <Link to="/form">
          <ActionButton className="bg-gray-500 text-white">← Back to Form</ActionButton>
        </Link>
      </div>
      {/* PDF Content */}
      <div
        ref={pdfRef}
        className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-md border border-[#e2e8f0] p-6 sm:p-10 print:shadow-none print:border-none"
      >
        <h1 className="font-medium text-center mb-4">Tax Invoice</h1>
        <div className='border p-2'>
          
        {/* Header */}
        <div className="flex flex-row md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex-1">
            {invoice.logo ? (
              <img src={invoice.logo} alt="Company Logo" className="h-16 object-contain mb-2" />
            ) : (
              <h1 className="text-2xl font-bold">{invoice.companyName || 'Company Name'}</h1>
            )}
            {invoice.companyAddress && (
              <p className="text-sm">{invoice.companyAddress}</p>
            )}
            {(invoice.companyEmail || invoice.companyPhone) && (
              <p className="text-sm">
                {invoice.companyEmail}
                {invoice.companyEmail && invoice.companyPhone && ' | '}
                {invoice.companyPhone}
              </p>
            )}
          </div>

          <div className="text-right mt-6 md:mt-0">
            <h1 className="text-3xl font-bold">INVOICE</h1>
            <p className="font-semibold text-base mt-1">Invoice No: {invoice.invoiceNumber || '0000'}</p>
            <p className="text-sm mt-2"><strong>Date:</strong> {invoice.date}</p>
            <p className="text-sm"><strong>Due Date:</strong> {invoice.dueDate}</p>
          </div>
        </div>

        {/* From / Bill To */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm mb-10">
          <div>
            <h3 className="font-semibold mb-2 text-base">From</h3>
            <div className="space-y-1 pl-2">
              <p className="font-medium">{invoice.companyName}</p>
              <p>{invoice.companyAddress}</p>
              {invoice.companyEmail && <p>{invoice.companyEmail}</p>}
              {invoice.companyPhone && <p>{invoice.companyPhone}</p>}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-base">Bill To</h3>
            <div className="space-y-1 pl-2">
              <p className="font-medium">{invoice.clientName}</p>
              <p>{invoice.clientAddress}</p>
              {invoice.clientEmail && <p>{invoice.clientEmail}</p>}
              {invoice.clientPhone && <p>{invoice.clientPhone}</p>}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto mb-10">
          <table className="min-w-full text-sm border border-[#edf2f7]">
            <thead className="bg-[#c8ccdd] text-[#09090c] uppercase text-xs font-semibold">
              <tr>
                <th className="p-3 text-left border">Description</th>
                <th className="p-3 text-center border">Qty</th>
                <th className="p-3 text-right border">Rate (₹)</th>
                <th className="p-3 text-right border">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items?.length ? (
                invoice.items.map((item, idx) => (
                  <tr key={idx} className="bg-white even:bg-[#f7f7f7]">
                    <td className="p-3 border">{item.description}</td>
                    <td className="p-3 text-center border">{item.quantity}</td>
                    <td className="p-3 text-right border">₹{item.rate.toFixed(2)}</td>
                    <td className="p-3 text-right border font-medium">
                      ₹{(item.quantity * item.rate).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-400">
                    No items available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="ml-auto w-full sm:w-80 text-sm space-y-3 mb-10">
          <div className="flex justify-between">
            <span className="text-[#718096]">Subtotal:</span>
            <span className="text-[#2d3748] font-medium">₹{invoice.subTotal}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-[#718096]">Tax ({invoice.taxRate}%):</span>
            <span className="text-[#2d3748] font-medium">₹{invoice.tax}</span>
          </div>
          <div className="flex justify-between border-t pt-3 text-lg font-semibold text-[#4c51bf]">
            <span>Total:</span>
            <span>₹{invoice.total}</span>
          </div>
        </div>

        {/* Notes & Signature */}
        <div className="grid grid-cols-1 sm:grid-cols-2 border-t pt-6 gap-6 text-sm text-[#4a5568]">
          <div className="space-y-4">
            {invoice.notes && (
              <>
                <h3 className="font-semibold text-base">Notes</h3>
                <p className="whitespace-pre-line">{invoice.notes}</p>
              </>
            )}
            {invoice.terms && (
              <>
                <h3 className="font-semibold text-base">Terms & Conditions</h3>
                <p className="whitespace-pre-line">{invoice.terms}</p>
              </>
            )}
          </div>
          <div className="text-right flex flex-col justify-end space-y-8">
            <p className="text-base">
              for <span className="font-bold">{invoice.companyName}</span>
            </p>
            <p className="text-sm">Authorised Signatory</p>
          </div>
        </div>

        </div>
        <p className="text-center text-[#4a5568] text-xs mt-4">
          This is a Computer Generated Invoice
        </p>
      </div>
    </div>
  );
};

export default InvoicePreview;
