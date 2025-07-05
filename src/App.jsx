import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useInvoice } from '../context/InvoiceContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Component imports
import Home from './pages/Home';
import InvoiceList from './components/InvoiceList';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import Navbar from './components/Navbar';

function App() {
  const { currentInvoice } = useInvoice();
  const location = useLocation();
  const showNavbar = location.pathname !== '/';

  return (
    <div className="min-h-screen bg-gray-100">
      {showNavbar && (
        <div className="no-print">
          <Navbar />
        </div>
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<InvoiceList />} />
        <Route path="/create" element={<InvoiceForm />} />
        
        <Route
          path="/edit"
          element={
            currentInvoice ? <InvoiceForm /> : <Navigate to="/dashboard" replace />
          }
        />

        <Route
          path="/invoice/:id"
          element={
            currentInvoice ? (
              <InvoicePreview invoice={currentInvoice} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
