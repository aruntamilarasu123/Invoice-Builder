import React from 'react';
import ActionButton from './ActionButton';

const InvoiceCard = ({ invoice, onView, onEdit, onDelete }) => {
  if (!invoice) return null;

  const formattedDate = invoice.date
    ? new Date(invoice.date).toLocaleDateString()
    : 'N/A';

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-200 transition-all duration-300">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h3 className="text-xl font-semibold text-gray-800">
            #{invoice?.invoiceNumber || 'N/A'}
          </h3>
          <span className="text-sm font-medium text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full">
            {formattedDate}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          {invoice?.clientName || 'No Client'}
        </p>
      </div>

      {/* Total and Actions */}
      <div className="p-5 space-y-6">
        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">Total</span>
          <span className="text-2xl font-bold text-green-700">
            ₹{invoice?.total || '0.00'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <ActionButton
            onClick={onView}
            className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            View
          </ActionButton>

          <ActionButton
            onClick={onEdit}
            className="flex-1 bg-amber-500 text-white hover:bg-amber-600 transition"
          >
            Edit
          </ActionButton>

          <ActionButton
            onClick={onDelete}
            className="flex-1 bg-rose-500 text-white hover:bg-rose-600 transition"
          >
            Delete
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCard;
