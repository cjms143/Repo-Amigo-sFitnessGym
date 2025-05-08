import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSpinner, FaCheck } from 'react-icons/fa';

function Appointment({ open, onClose, plan }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({}); // Added for field-specific errors

  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState('');

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend Validation
    const errors = {};
    if (!formData.phone.match(/^(\+?\d{1,3}[- ]?)?\d{10}$/) && !formData.phone.match(/^\d{3}[- ]?\d{3}[- ]?\d{4}$/)) {
      errors.phone = 'Invalid phone number format. Expected 10 digits, or XXX-XXX-XXXX.';
    }
    // Add other frontend validations here if needed

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setStatus('idle'); // Keep status idle to show validation errors
      return;
    }
    setFormErrors({}); // Clear previous errors

    setStatus('submitting');
    setErrorMessage('');

    try {
      const combinedDateTime = new Date(`${formData.preferredDate}T${formData.preferredTime || '00:00'}`);
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          preferredDate: combinedDateTime.toISOString(), // Send combined date and time
          message: formData.message,
          planId: plan._id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setFormData({
          name: '',
          email: '',
          phone: '',
          preferredDate: '',
          preferredTime: '', // Reset preferredTime
          message: ''
        });
      }, 2000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-neutral-800 rounded-xl w-full max-w-lg overflow-hidden"
      >
        <div className="p-6 border-b border-neutral-700">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">Schedule Your <span className="text-[#bfa14a]">Gym Session</span></h3>
              <p className="text-neutral-400 text-sm">
                You've selected the <span className="font-semibold text-neutral-300">{plan?.title}</span> plan.
              </p>
              <p className="text-neutral-400 text-sm">
                Price: <span className="font-semibold text-neutral-300">₱{plan?.price?.toLocaleString()}
                {plan?.type === 'monthly' ? '/month' : 
                 plan?.type === 'quarterly' ? '/quarter' : '/year'}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white transition-colors"
              disabled={status === 'submitting'}
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Form Fields - Example for Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="fullName" className="block text-xs font-medium text-neutral-400 mb-1">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-neutral-700/50 border border-neutral-600 rounded-md px-3 py-2.5
                  text-sm text-white focus:outline-none focus:border-[#bfa14a] focus:ring-1 focus:ring-[#bfa14a] transition-shadow"
                placeholder="e.g., John Doe"
                disabled={status === 'submitting' || status === 'success'}
              />
            </div>
            <div>
              <label htmlFor="emailAddress" className="block text-xs font-medium text-neutral-400 mb-1">
                Email Address
              </label>
              <input
                id="emailAddress"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-neutral-700/50 border border-neutral-600 rounded-md px-3 py-2.5
                  text-sm text-white focus:outline-none focus:border-[#bfa14a] focus:ring-1 focus:ring-[#bfa14a] transition-shadow"
                placeholder="e.g., john.doe@example.com"
                disabled={status === 'submitting' || status === 'success'}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="phoneNumber" className="block text-xs font-medium text-neutral-400 mb-1">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (formErrors.phone) {
                    setFormErrors({ ...formErrors, phone: null });
                  }
                }}
                className={`w-full bg-neutral-700/50 border ${formErrors.phone ? 'border-red-500' : 'border-neutral-600'} rounded-md px-3 py-2.5
                  text-sm text-white focus:outline-none focus:border-[#bfa14a] focus:ring-1 focus:ring-[#bfa14a] transition-shadow`}
                placeholder="e.g., 09123456789 or XXX-XXX-XXXX"
                disabled={status === 'submitting' || status === 'success'}
              />
              {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
            </div>
            <div>
              <label htmlFor="preferredDate" className="block text-xs font-medium text-neutral-400 mb-1">
                Preferred Date
              </label>
              <input
                id="preferredDate"
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.preferredDate}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                className="w-full bg-neutral-700/50 border border-neutral-600 rounded-md px-3 py-2.5
                  text-sm text-white focus:outline-none focus:border-[#bfa14a] focus:ring-1 focus:ring-[#bfa14a] transition-shadow appearance-none"
                disabled={status === 'submitting' || status === 'success'}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5"> {/* New row for time, or adjust existing */}
            <div>
              <label htmlFor="preferredTime" className="block text-xs font-medium text-neutral-400 mb-1">
                Preferred Time
              </label>
              <input
                id="preferredTime"
                type="time"
                required
                value={formData.preferredTime}
                onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                className="w-full bg-neutral-700/50 border border-neutral-600 rounded-md px-3 py-2.5
                  text-sm text-white focus:outline-none focus:border-[#bfa14a] focus:ring-1 focus:ring-[#bfa14a] transition-shadow appearance-none"
                disabled={status === 'submitting' || status === 'success'}
              />
            </div>
            {/* This leaves one column empty, or you can adjust the grid to make time span full width if preferred */}
          </div>

          <div>
            <label htmlFor="additionalMessage" className="block text-xs font-medium text-neutral-400 mb-1">
              Additional Message (Optional)
            </label>
            <textarea
              id="additionalMessage"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-neutral-700/50 border border-neutral-600 rounded-md px-3 py-2.5
                text-sm text-white focus:outline-none focus:border-[#bfa14a] focus:ring-1 focus:ring-[#bfa14a] h-28 resize-none transition-shadow"
              disabled={status === 'submitting' || status === 'success'}
              placeholder="Let us know if you have any specific requests or questions..."
            />
          </div>

          {status === 'error' && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm bg-red-500/10 p-3 rounded-md flex items-center gap-2">
              <FaTimes /> {errorMessage || 'Failed to submit appointment. Please try again.'}
            </motion.div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row justify-end gap-3 mt-6">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-md text-sm font-medium text-neutral-400 hover:text-white
                border border-neutral-600 hover:border-neutral-500 transition-colors"
              disabled={status === 'submitting' || status === 'success'}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={status === 'submitting' || status === 'success'}
              className={`px-6 py-2.5 rounded-md text-sm font-medium flex items-center justify-center gap-2
                transition-all duration-300 shadow-md hover:shadow-lg ${
                status === 'success'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-[#bfa14a] text-neutral-900 hover:bg-[#CDAC5A]'
              }`}
            >
              {status === 'submitting' ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Submitting...
                </>
              ) : status === 'success' ? (
                <>
                  <FaCheck />
                  Appointment Scheduled
                </>
              ) : (
                'Schedule Appointment'
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default Appointment;
