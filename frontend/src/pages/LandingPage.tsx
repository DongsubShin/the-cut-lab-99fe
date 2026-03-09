import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <>
      <section id="home" className="pt-32 pb-20 lg:pt-48 lg:pb-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-4">
            Master Barbershop
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Precision Cuts. <br className="hidden md:block" /> 
            <span className="text-[#ED1C24]">Modern Engineering.</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
            The Cut Lab combines traditional barbering techniques with modern precision. 
            Book your appointment or join our live walk-in queue.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/book" className="bg-[#ED1C24] text-white px-8 py-4 rounded-md font-bold hover:bg-slate-800 transition-all shadow-lg">
              Book Appointment
            </Link>
            <Link to="/queue" className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-md font-bold hover:bg-slate-50 transition-all">
              View Live Queue
            </Link>
          </div>
        </div>
      </section>

      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Our Services</h2>
            <div className="w-12 h-1 bg-[#ED1C24] mx-auto mt-4"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Service Cards would go here */}
            <div className="p-8 border border-slate-100 rounded-xl hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold mb-2">The Lab Cut</h3>
              <p className="text-slate-600 mb-4">Precision fade or classic cut with hot towel finish.</p>
              <span className="text-[#ED1C24] font-bold">$45</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;