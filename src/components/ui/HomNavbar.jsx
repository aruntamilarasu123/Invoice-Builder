import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

        <div className="flex items-center space-x-3">
          <img
            src="src/assets/bill.png"
            alt="logo"
            className="h-8 w-8 object-contain"
            onError={(e) => (e.target.style.display = 'none')}
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
            to="/dashboard"
            className="hover:text-blue-600 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/create"
            className="hidden md:inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition-shadow shadow-md"
          >
            Get Started
          </Link>
        </nav>

        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            className="text-blue-600 text-2xl focus:outline-none hover:text-blue-800"
          >
            ☰
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-white border-t border-gray-200 shadow-sm"
        >
          <nav className="flex flex-col px-4 py-2 space-y-2 text-sm text-gray-700">
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="hover:text-blue-600"
            >
              Dashboard
            </Link>
            <Link
              to="/create"
              onClick={() => setIsOpen(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-center"
            >
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default HomNavbar;
