import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendar, FaClock, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { eachDayOfInterval, subDays, format, parseISO } from 'date-fns';
import { useAuth } from '../../context/AuthContext'; // Changed to named import for useAuth

function AppointmentsManagement() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [filterStatus, setFilterStatus] = useState('all');
  const { token } = useAuth(); // useAuth() provides the token

  useEffect(() => {
    if (token) { 
      fetchAppointments();
    } else {
      setLoading(false);
      setError("Authentication token not found. Please log in.");
    }
  }, [token, filterStatus]); // Re-fetch if token or filterStatus changes - Note: if fetchAppointments doesn't use filterStatus, remove it from deps

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      if (!token) {
        throw new Error("Authentication token not available.");
      }

      const response = await fetch(`${API_BASE_URL}/api/appointments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ message: 'Failed to fetch appointments and parse error response.' }));
        throw new Error(errData.message || 'Failed to fetch appointments');
      }

      const result = await response.json();
      let rawAppointments = result.data;

      if (!Array.isArray(rawAppointments)) {
        console.error("API did not return an array for appointments data:", rawAppointments);
        rawAppointments = []; // Default to empty array to prevent further errors
      }

      const processedAppointments = rawAppointments.map(app => {
        if (!app || typeof app !== 'object') {
          // This case should ideally not happen if the API is consistent.
          // Returning null will allow it to be filtered out by .filter(Boolean) later.
          console.warn("Invalid appointment item received from API:", app);
          return null; 
        }

        let planObject = app.plan; // This is the populated plan from backend, could be null

        // If plan is null (because it was deleted) or somehow an empty object from populate (very unlikely for Mongoose)
        if (!planObject || (typeof planObject === 'object' && Object.keys(planObject).length === 0 && planObject.constructor === Object)) {
          planObject = {
            _id: null, // Or app.plan if you need to store the original null ID, but null is fine.
            title: 'Plan Deleted',
            name: 'Plan Deleted', // Consistent placeholder property
            price: 'N/A',
            type: 'N/A', // Add other common properties your JSX might try to access
            // Add any other properties that your rendering logic (e.g., line 292) might try to access
          };
        }
        return { ...app, plan: planObject }; // Ensure plan is always an object
      }).filter(Boolean); // Filter out any nulls that resulted from invalid app items
      
      setAppointments(processedAppointments);

    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id, newStatus) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL; // ADDED
      const response = await fetch(`${API_BASE_URL}/api/appointments/${id}/status`, { // MODIFIED
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update appointment status');
      }

      toast.success(`Appointment ${newStatus}`);
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error(error.message || 'Failed to update appointment');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-500 bg-green-500/10';
      case 'cancelled':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-yellow-500 bg-yellow-500/10';
    }
  };

  const filteredAppointments = appointments.filter(appointment => 
    filterStatus === 'all' ? true : appointment.status === filterStatus
  );

  // --- Start Data Preparation for Charts ---
  const appointmentStatusData = [
    { name: 'Pending', value: appointments.filter(a => a.status === 'pending').length },
    { name: 'Confirmed', value: appointments.filter(a => a.status === 'confirmed').length },
    { name: 'Cancelled', value: appointments.filter(a => a.status === 'cancelled').length },
  ].filter(data => data.value > 0); // Filter out statuses with 0 appointments

  const COLORS = {
    Pending: '#FFBB28', // Yellow
    Confirmed: '#00C49F', // Green
    Cancelled: '#FF8042', // Red
  };

  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date(),
  });

  const appointmentsLast7Days = last7Days.map(day => {
    const formattedDate = format(day, 'MMM dd');
    const count = appointments.filter(a => {
      // Ensure createdAt is valid and parseISO can handle it
      try {
        const appointmentDate = parseISO(a.createdAt);
        return format(appointmentDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
      } catch (e) {
        // console.warn(\`Invalid date format for appointment createdAt: ${a.createdAt}\`);
        return false;
      }
    }).length;
    return { date: formattedDate, count };
  });
  // --- End Data Preparation for Charts ---


  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-[#bfa14a] text-xl">Loading appointments...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8"> {/* Added py-8 for overall padding */}
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white mb-2"
          >
            Appointment <span className="text-[#bfa14a]">Management</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-neutral-400"
          >
            Manage and track membership plan appointments
          </motion.p>
        </div>

        <div className="flex items-center gap-2 bg-neutral-800 rounded-lg p-2">
          <span className="text-neutral-400 text-sm">Filter:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-neutral-700 text-white rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Dashboard Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <div className="bg-neutral-800/30 border border-neutral-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Total Appointments</h3>
          <p className="text-3xl font-bold text-[#bfa14a]">{appointments.length}</p>
        </div>
        <div className="bg-neutral-800/30 border border-neutral-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Pending</h3>
          <p className="text-3xl font-bold text-[#bfa14a]">
            {appointments.filter(a => a.status === 'pending').length}
          </p>
        </div>
        <div className="bg-neutral-800/30 border border-neutral-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Today's Appointments</h3>
          <p className="text-3xl font-bold text-[#bfa14a]">
            {appointments.filter(a => {
              const today = new Date().toISOString().split('T')[0];
              return new Date(a.preferredDate).toISOString().split('T')[0] === today;
            }).length}
          </p>
        </div>
      </motion.div>

      {/* --- Start Charts Section --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
      >
        <div className="bg-neutral-800/30 border border-neutral-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Appointments by Status</h3>
          {appointmentStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={appointmentStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {appointmentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#2d2d2d', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#bfa14a' }}
                />
                <Legend wrapperStyle={{ color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-neutral-500">
              No appointment data for status chart.
            </div>
          )}
        </div>

        <div className="bg-neutral-800/30 border border-neutral-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Appointments (Last 7 Days)</h3>
          {appointmentsLast7Days.some(d => d.count > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={appointmentsLast7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                <XAxis dataKey="date" tick={{ fill: '#a3a3a3' }} />
                <YAxis tick={{ fill: '#a3a3a3' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#2d2d2d', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#bfa14a' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend wrapperStyle={{ color: '#fff' }} />
                <Bar dataKey="count" fill="#bfa14a" name="Appointments" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-neutral-500">
              No appointments in the last 7 days.
            </div>
          )}
        </div>
      </motion.div>
      {/* --- End Charts Section --- */}
      
      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12 text-neutral-400">
            No appointments found
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <motion.div
              key={appointment._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-neutral-800/30 border border-neutral-700 rounded-xl p-6"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{appointment.name}</h3>
                    <p className="text-neutral-400">{appointment.email}</p>
                    <p className="text-neutral-400 mt-1">{appointment.phone}</p> {/* Added phone number here */}
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-neutral-400">
                      <FaCalendar className="text-[#bfa14a]" />
                      {new Date(appointment.preferredDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-neutral-400">
                      <FaClock className="text-[#bfa14a]" />
                      {new Date(appointment.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(appointment.status)}`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-right">
                    <h4 className="text-lg font-semibold text-[#bfa14a]">{appointment.plan.title}</h4>
                    <p className="text-neutral-400">
                      ₱{appointment.plan.price?.toLocaleString()}
                      {appointment.plan.type === 'monthly' ? '/month' : 
                       appointment.plan.type === 'quarterly' ? '/quarter' : '/year'}
                    </p>
                  </div>
                  {appointment.status === 'pending' && (
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => updateAppointmentStatus(appointment._id, 'confirmed')}
                        className="px-4 py-2 bg-green-500/10 text-green-500 rounded-lg
                          hover:bg-green-500/20 transition-colors"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
                        className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg
                          hover:bg-red-500/20 transition-colors"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {appointment.message && (
                <div className="mt-4 pt-4 border-t border-neutral-700">
                  <p className="text-neutral-400">{appointment.message}</p>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

export default AppointmentsManagement;