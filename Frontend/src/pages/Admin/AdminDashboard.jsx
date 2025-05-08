import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaMoneyBillWave, FaCalendarAlt } from 'react-icons/fa';
import AdminManagement from './AdminManagement';
import PricingManagement from './PricingManagement';
import AppointmentsManagement from './AppointmentsManagement';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('trainers');

  const tabs = [
    { id: 'trainers', label: 'Trainer Management', icon: FaUsers },
    { id: 'pricing', label: 'Pricing Management', icon: FaMoneyBillWave },
    { id: 'appointments', label: 'Appointments', icon: FaCalendarAlt }
  ];

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Tab Navigation */}
      <div className="border-b border-[#bfa14a]/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-300 relative
                  ${activeTab === tab.id 
                    ? 'text-[#bfa14a]' 
                    : 'text-neutral-400 hover:text-[#bfa14a]'}`}
              >
                <tab.icon />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#bfa14a]"
                    initial={false}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {activeTab === 'trainers' && <AdminManagement />}
        {activeTab === 'pricing' && <PricingManagement />}
        {activeTab === 'appointments' && <AppointmentsManagement />}
      </div>
    </div>
  );
}

export default AdminDashboard;