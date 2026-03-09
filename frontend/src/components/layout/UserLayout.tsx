import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

const UserLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <header className="fixed w-full bg-white/95 backdrop-blur-sm z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-[#ED1C24] tracking-tight">
                The Cut Lab
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8 items-center">
              <Link to="/" className="text-sm font-medium text-slate-800 hover:text-[#ED1C24] transition-colors">Home</Link>
              <a href="#services" className="text-sm font-medium text-slate-800 hover:text-[#ED1C24] transition-colors">Services</a>
              <Link to="/queue" className="text-sm font-medium text-slate-800 hover:text-[#ED1C24] transition-colors">Live Queue</Link>
              <Link to="/book" className="bg-[#ED1C24] text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm">
                Book Now
              </Link>
            </nav>
            <div className="md:hidden">
              <button type="button" className="text-[#ED1C24] p-2">
                <Icon icon="lucide:menu" width="24" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">© 2024 The Cut Lab. Precision Engineered Style.</p>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;