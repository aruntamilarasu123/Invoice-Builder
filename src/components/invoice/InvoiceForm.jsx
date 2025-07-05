import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoice } from '../../context/InvoiceContext';
import LineItemForm from './LineItemForm';
import { toast } from 'react-toastify';

const InvoiceForm = () => {
  const navigate = useNavigate();
  const {
    currentInvoice,
    createInvoice,
    updateInvoice,
    clearCurrentInvoice,
  } = useInvoice();

  const defaultInvoice = {
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    clientName: '',
    clientAddress: '',
    clientEmail: '',
    clientPhone: '',
    companyName: '',
    companyAddress: '',
    email: '',
    phone: '',
    taxRate: 0,
    notes: '',
    terms: '',
    items: [],
    logo: null,
  };

  const [invoice, setInvoice] = useState(defaultInvoice);

  useEffect(() => {
    if (currentInvoice) setInvoice(currentInvoice);
  }, [currentInvoice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoice((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setInvoice((prev) => ({ ...prev, logo: reader.result }));
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      toast.error('Error uploading logo');
      console.error('Logo upload failed:', error);
    }
  };

  const removeLogo = () => setInvoice((prev) => ({ ...prev, logo: null }));

  const handleItemChange = (index, item) => {
    const updatedItems = [...invoice.items];
    updatedItems[index] = item;
    setInvoice((prev) => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setInvoice((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: Date.now(), description: '', quantity: 1, rate: 0 },
      ],
    }));
  };

  const removeItem = (id) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const calculateTotals = () => {
    const subTotal = invoice.items.reduce(
      (acc, item) => acc + item.quantity * item.rate,
      0
    );
    const tax = subTotal * (invoice.taxRate / 100);
    return {
      subTotal: subTotal.toFixed(2),
      tax: tax.toFixed(2),
      total: (subTotal + tax).toFixed(2),
    };
  };

  const isFormValid = () => {
    const {
      invoiceNumber,
      date,
      dueDate,
      clientName,
      clientAddress,
      clientEmail,
      companyName,
      companyAddress,
      items,
    } = invoice;

    const hasValidItems =
      items.length > 0 &&
      items.every(
        (item) =>
          item.description &&
          Number(item.quantity) > 0 &&
          Number(item.rate) >= 0
      );

    return (
      invoiceNumber.trim() &&
      date &&
      dueDate &&
      clientName.trim() &&
      clientAddress.trim() &&
      clientEmail.trim() &&
      companyName.trim() &&
      companyAddress.trim() &&
      hasValidItems
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.error('Please fill all required fields and add at least one item.');
      return;
    }

    try {
      const totals = calculateTotals();
      const finalInvoice = {
        ...invoice,
        ...totals,
        lastUpdated: new Date().toISOString(),
      };

      if (currentInvoice) {
        updateInvoice(finalInvoice);
        toast.success('Invoice updated successfully!');
        navigate('/dashboard');
      } else {
        const newInvoice = createInvoice(finalInvoice);
        toast.success('Invoice created successfully!');
        navigate(`/invoice/${newInvoice.id}`);
      }

      clearCurrentInvoice();
    } catch (error) {
      toast.error('Something went wrong while saving the invoice.');
      console.error('Invoice submission failed:', error);
    }
  };

  const { subTotal, tax, total } = calculateTotals();

  const resetForm = () => {
    clearCurrentInvoice();
    setInvoice(defaultInvoice);
    toast.info('Invoice form reset.');
  };

  return (
    <section className="bg-gray-100 py-10 px-4 sm:px-8">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl px-8 py-10 space-y-10"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900">Invoice Details</h2>
          <button
            type="button"
            onClick={resetForm}
            className="text-sm bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200"
          >
            Reset Invoice
          </button>
        </div>
        {/* Meta Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[{ label: 'Invoice Number', name: 'invoiceNumber', type: 'text' },
          { label: 'Invoice Date', name: 'date', type: 'date' },
          { label: 'Due Date', name: 'dueDate', type: 'date' },
          { label: 'Tax Rate (%)', name: 'taxRate', type: 'number' }].map(({ label, name, type }) => (
            <div key={name}>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
              <input
                type={type}
                name={name}
                value={invoice[name]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
        </div>

        {/* Company Info */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Company Information</h3>
            {invoice.logo ? (
              <button
                type="button"
                onClick={removeLogo}
                className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Remove Logo
              </button>
            ) : (
              <label className="text-xs px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 cursor-pointer">
                Upload Logo
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['companyName', 'companyAddress', 'email', 'phone'].map((field) => (
              <input
                key={field}
                type={field === 'email' ? 'email' : 'text'}
                name={field}
                value={invoice[field]}
                onChange={handleChange}
                placeholder={`Company ${field}`}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            ))}
          </div>
        </div>

        {/* Client Info */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Client Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[{ name: 'clientName', placeholder: 'Client Name' },
            { name: 'clientAddress', placeholder: 'Client Address' },
            { name: 'clientEmail', placeholder: 'Client Email', type: 'email' },
            { name: 'clientPhone', placeholder: 'Client Phone Number', type: 'tel' }].map(({ name, placeholder, type = 'text' }) => (
              <input
                key={name}
                type={type}
                name={name}
                value={invoice[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            ))}
          </div>
        </div>

        {/* Line Items */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Line Items</h3>
            <button
              type="button"
              onClick={addItem}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              + Add Item
            </button>
          </div>
          {invoice.items.length === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <p className="text-gray-500">No items added yet</p>
              <button
                type="button"
                onClick={addItem}
                className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200"
              >
                Add First Item
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {invoice.items.map((item, index) => (
                <LineItemForm
                  key={item.id}
                  item={item}
                  onChange={(updated) => handleItemChange(index, updated)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Notes & Terms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[{ name: 'notes', label: 'Notes', placeholder: 'Any additional notes...' },
          { name: 'terms', label: 'Terms & Conditions', placeholder: 'Payment terms...' }].map(({ name, label, placeholder }) => (
            <div key={name}>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
              <textarea
                name={name}
                value={invoice[name]}
                onChange={handleChange}
                placeholder={placeholder}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[{ label: 'Subtotal', value: subTotal },
          { label: 'Tax', value: tax },
          { label: 'Total', value: total }].map(({ label, value }, i) => (
            <div key={i}>
              <label className="text-sm font-medium text-gray-700">{label}</label>
              <input
                type="text"
                value={`₹ ${value}`}
                readOnly
                className="w-full bg-gray-100 border border-gray-300 rounded-md px-4 py-2 font-semibold text-green-700"
              />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={!isFormValid()}
            className={`px-6 py-2 rounded font-semibold transition ${isFormValid()
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            {currentInvoice ? 'Update Invoice' : 'Create Invoice'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default InvoiceForm;
