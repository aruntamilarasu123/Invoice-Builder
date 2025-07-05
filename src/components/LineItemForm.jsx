import React from 'react';
import { FaTrash } from 'react-icons/fa';

const LineItemForm = ({ item, onChange, onRemove }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convert quantity and rate to numbers safely, fallback to 0 if empty
    const val =
      name === 'quantity' || name === 'rate'
        ? Number(value) || 0
        : value;

    onChange({
      ...item,
      [name]: val,
    });
  };

  // Simple validation message for quantity and rate inputs
  const handleInvalid = (e) => {
    e.target.setCustomValidity(
      e.target.name === 'quantity'
        ? 'Quantity must be at least 1'
        : 'Rate cannot be negative'
    );
  };

  const handleInput = (e) => {
    // Clear custom validity message once user starts typing again
    e.target.setCustomValidity('');
  };

  // Compute amount safely (handle NaN if inputs empty)
  const amount =
    !isNaN(item.quantity) && !isNaN(item.rate)
      ? (item.quantity * item.rate).toFixed(2)
      : '0.00';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mb-6 border border-gray-200 rounded-xl p-6 shadow-sm bg-gradient-to-br from-gray-50 via-white to-gray-100 transition-all duration-300">
      {/* Description */}
      <div className="sm:col-span-5">
        <label
          htmlFor={`desc-${item.id || ''}`}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Item Description
        </label>
        <input
          id={`desc-${item.id || ''}`}
          type="text"
          name="description"
          value={item.description}
          onChange={handleChange}
          required
          placeholder="e.g. Web Development Service"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400 transition"
        />
      </div>

      {/* Quantity */}
      <div className="sm:col-span-2">
        <label
          htmlFor={`qty-${item.id || ''}`}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Qty
        </label>
        <input
          id={`qty-${item.id || ''}`}
          type="number"
          name="quantity"
          value={item.quantity}
          onChange={handleChange}
          min="1"
          onInvalid={handleInvalid}
          onInput={handleInput}
          className="w-full h-[38px] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition"
        />
      </div>

      {/* Rate */}
      <div className="sm:col-span-2">
        <label
          htmlFor={`rate-${item.id || ''}`}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Rate (₹)
        </label>
        <input
          id={`rate-${item.id || ''}`}
          type="number"
          name="rate"
          value={item.rate}
          onChange={handleChange}
          min="0"
          step="0.01"
          onInvalid={handleInvalid}
          onInput={handleInput}
          className="w-full h-[38px] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition"
        />
      </div>

      {/* Amount (Readonly) */}
      <div className="sm:col-span-2">
        <label
          htmlFor={`amount-${item.id || ''}`}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Amount
        </label>
        <input
          id={`amount-${item.id || ''}`}
          type="text"
          value={`₹${amount}`}
          readOnly
          tabIndex={-1}
          className="w-full h-[38px] bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-sm text-right font-semibold text-green-700 focus:outline-none shadow-inner"
        />
      </div>

      {/* Remove Button */}
      <div className="sm:col-span-1 flex items-end">
        <button
          type="button"
          onClick={onRemove}
          className="w-full h-[38px] flex justify-center items-center bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-2 rounded-md shadow-sm transition-all duration-200"
          aria-label="Remove line item"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default LineItemForm;
