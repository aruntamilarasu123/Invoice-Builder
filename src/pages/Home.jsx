import React from 'react';
import { Link } from 'react-router-dom';
import HomNavbar from '../components/HomNavbar';

const Home = () => {
  return (
    <section className="bg-gradient-to-br from-white via-slate-100 to-gray-200 min-h-screen flex flex-col">
      <HomNavbar />

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* Left content */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              Create <span className="text-blue-600">Professional</span> Invoices Instantly
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Fast, flexible invoice builder tailored for freelancers, agencies, and small businesses.
              No design skills needed — just focus on your business.
            </p>
            <Link to="/create">
              <button
                className="bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition duration-300"
                aria-label="Build your first invoice"
              >
                Build Your First Invoice
              </button>
            </Link>
          </div>

          {/* Right image (preserved as requested) */}
          <div className="w-full max-w-md mx-auto">
            <img
              src="./invoice-.png"
              alt="Invoice builder preview"
              onError={(e) => (e.currentTarget.style.display = 'none')}
              className="rounded-xl shadow-lg object-cover w-full h-auto border border-gray-200"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
