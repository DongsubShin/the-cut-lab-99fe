import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';

const AdminLayout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: 'lucide:layout-dashboard', group: 'Main' },
    { label: 'Live Queue', path: '/admin/queue', icon: 'lucide:users-round', group: 'Main' },
    { label: 'Clients', path: '/admin/clients', icon: 'lucide:contact-2', group: 'Management' },
    { label: 'Commission', path: '/admin/analytics', icon: 'lucide:line-chart', group: 'Management' },
  ];

  return (
    <div className="flex h-screen bg-slate-100">
      <aside className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6">
          <span className="text-[#ED1C24] font-bold text-xl tracking-tight">The Cut Lab</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-6 overflow-y-auto">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">Main</p>
            {navItems.filter(i => i.group === 'Main').map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors mb-1 ${
                  location.pathname === item.path 
                    ? 'bg-slate-200 text-slate-900' 
                    : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <Icon icon={item.icon} className="text-lg" />
                {item.label}
              </Link>
            ))}
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">Management</p>
            {navItems.filter(i => i.group === 'Management').map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors mb-1 ${
                  location.pathname === item.path 
                    ? 'bg-slate-200 text-slate-900' 
                    : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <Icon icon={item.icon} className="text-lg" />
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h1 className="text-lg font-semibold text-slate-800">Admin Portal</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600">
              <Icon icon="lucide:bell" width="20" />
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-200" />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;