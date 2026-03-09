import React from 'react';
import { useDashboardStats } from '../hooks/useDashboard';
import { Icon } from '@iconify/react';

const DashboardPage: React.FC = () => {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) return <div className="animate-pulse">Loading stats...</div>;

  const cards = [
    { label: "Today's Revenue", value: `$${stats?.todayRevenue || 0}`, icon: 'lucide:dollar-sign', color: 'text-emerald-600' },
    { label: 'Active Bookings', value: stats?.activeBookings || 0, icon: 'lucide:calendar', color: 'text-blue-600' },
    { label: 'Queue Length', value: stats?.queueCount || 0, icon: 'lucide:users', color: 'text-amber-600' },
    { label: 'My Commission', value: `$${stats?.commissionEarned || 0}`, icon: 'lucide:trending-up', color: 'text-[#ED1C24]' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-slate-50 ${card.color}`}>
                <Icon icon={card.icon} width="24" />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500">{card.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{card.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Recent Activity</h3>
        </div>
        <div className="p-6">
          <p className="text-slate-400 text-sm italic">No recent activity to display.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;