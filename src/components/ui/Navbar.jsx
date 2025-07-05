import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HomNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

        <div className="flex items-center space-x-3">
          <img
            src="src/assets/bill.png"
            alt="logo"
            className="h-8 w-8 object-contain"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
          <Link
            to="/"
            className="text-2xl font-bold text-blue-700 tracking-tight"
          >
            InvoiceBuilder
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-700">
          <Link
            to="/"
            className="hover:text-blue-600 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className="hover:text-blue-600 transition-colors"
          >
            Dashboard
          </Link>
        </nav>

        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            className="text-blue-600 text-2xl focus:outline-none hover:text-blue-800"
          >
            ☰
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-sm">
          <nav className="flex flex-col px-4 py-2 space-y-2 text-sm text-gray-700">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="hover:text-blue-600"
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="hover:text-blue-600"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default HomNavbar;
