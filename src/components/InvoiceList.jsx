import React from 'react';
import { useNavigate } from 'react-router-dom';
import InvoiceCard from './InvoiceCard';
import { useInvoice } from '../../context/InvoiceContext';
import ActionButton from './ActionButton';
import { toast } from 'react-toastify';

const InvoiceList = () => {
  const { invoices, setCurrentInvoice, deleteInvoice } = useInvoice();
  const navigate = useNavigate();

  const handleEdit = (invoice) => {
    setCurrentInvoice(invoice);
    navigate('/edit');
  };

  const handleView = (invoice) => {
    setCurrentInvoice(invoice);
    navigate(`/invoice/${invoice.id}`);
  };

  const handleCreate = () => {
    setCurrentInvoice(null);
    navigate('/create');
  };

  const handleDelete = (id) => {
    try {
      deleteInvoice(id);
      toast.success('Invoice deleted successfully!', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error('Failed to delete invoice:', error);
      toast.error('Error deleting invoice. Please try again.');
    }
  };

  return (
    <section className="bg-gradient-to-br from-slate-100 via-white to-slate-200 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight mb-4 sm:mb-0">
            Invoice Dashboard
          </h1>
          <ActionButton
            onClick={handleCreate}
            className="px-6 py-2.5 rounded-md text-white font-semibold bg-emerald-600 hover:bg-emerald-700 transition duration-200 shadow-md"
          >
            + New Invoice
          </ActionButton>
        </div>

        {/* Invoice Cards / Empty State */}
        {invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white border border-dashed border-gray-300 rounded-lg py-20 shadow-inner">
            <svg
              className="w-16 h-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17v-6a3 3 0 016 0v6m2 4H7a2 2 0 01-2-2V7a2 2 0 012-2h3.586a1 1 0 01.707.293l1.414 1.414A1 1 0 0013.414 7H17a2 2 0 012 2v12a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-700 text-lg font-medium">No invoices found</p>
            <p className="text-sm text-gray-400 mt-1">Start by creating your first invoice</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-200"
              >
                <InvoiceCard
                  invoice={invoice}
                  onView={() => handleView(invoice)}
                  onEdit={() => handleEdit(invoice)}
                  onDelete={() => handleDelete(invoice.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default InvoiceList;
