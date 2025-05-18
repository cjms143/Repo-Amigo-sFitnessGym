import { useState, useEffect } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSpinner, FaCheck, FaClock } from 'react-icons/fa'; 
import { LocalizationProvider, StaticTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import '../styles/timepicker.css';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#bfa14a', 
    },
    background: {
      paper: '#1f1f1f', 
      default: '#121212',
    },
    text: {
      primary: '#ffffff',
      secondary: '#aaaaaa',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#262626', 
          borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        },
      },
    },
    MuiPickersToolbar: { 
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e', 
          padding: '16px',
          borderBottom: '1px solid #333',
        },
        content: {
          
          '& .MuiTypography-h3': { 
            fontSize: '2.8rem',
            fontWeight: 'bold',
            color: '#ffffff',
          },
          '& .MuiTypography-h4': { 
            fontSize: '2.8rem',
            fontWeight: 'bold',
            color: '#ffffff',
          },
          '& .MuiTimePickerToolbar-separator': { 
            fontSize: '2.8rem',
            color: '#ffffff',
            margin: '0 2px',
          }
        },
        
        ampmSelection: { 
            marginRight: '0px',
            marginLeft: '8px', 
        },
        ampmLabel: { 
            fontSize: '0.9rem', 
            padding: '4px 6px', 
            color: '#777', 
            border: '1px solid transparent',
            '&.Mui-selected': {
                color: '#ffffff', 
                fontWeight: 'bold',
            },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        overline: { 
          color: '#aaaaaa',
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        },
      }
    },
    MuiTimeClock: {
      styleOverrides: {
        root: {
          paddingTop: '0px',
        },
        arrowSwitcher: {
           display: 'none', 
        },
      },
    },
    MuiClock: {
      styleOverrides: {
        root: {
          margin: '16px auto', 
          overflow: 'visible',
        },
        clock: {
          backgroundColor: '#1a1a1a', 
          boxShadow: 'inset 0 0 15px rgba(0,0,0,0.4)',
        },
        pin: {
          backgroundColor: '#bfa14a', 
          width: '6px',
          height: '6px',
          zIndex: 13, 
        },
        number: {
          color: '#e0e0e0',
          fontSize: '1rem',
          zIndex: 1, 
          '&.Mui-selected': {
            backgroundColor: '#bfa14a',
            color: '#ffffff', 
            fontWeight: 'bold',
            boxShadow: '0 0 10px 2px rgba(191, 161, 74, 0.5)',
            zIndex: 12, 
          },
          '&:hover': {
            backgroundColor: 'rgba(191, 161, 74, 0.2)',
          }
        },
      },
    },
    MuiClockPointer: {
      styleOverrides: {
        root: { 
          backgroundColor: '#bfa14a', 
          width: '2px',
          zIndex: 10, 
          borderRight: '0.5px solid rgba(0, 0, 0, 0.1)',
          borderLeft: '0.5px solid rgba(0, 0, 0, 0.1)',
        },
        thumb: { 
          backgroundColor: '#bfa14a', 
          borderColor: 'rgba(0, 0, 0, 0.2)',
          borderWidth: '1px',
          width: '10px',
          height: '10px',
          left: 'calc(50% - 5px)',
          top: 'calc(0% - 5px)',
          zIndex: 11, 
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '8px 16px',
          backgroundColor: '#1e1e1e', 
          borderTop: '1px solid #333',
          '& .MuiButton-root': { 
            color: '#3ea6ff', 
            textTransform: 'uppercase',
            fontWeight: 'medium',
            '&:hover': {
              backgroundColor: 'rgba(62, 166, 255, 0.1)',
            }
          },
        },
      },
    },
    
    
    MuiIconButton: {
        styleOverrides: {
            root: {
                
                
            }
        }
    }
  },
});



function Appointment({ open, onClose, plan }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    message: ''
  });
  const [selectedTime, setSelectedTime] = useState(dayjs()); 
  const [formErrors, setFormErrors] = useState({}); 

  const [status, setStatus] = useState('idle'); 
  const [errorMessage, setErrorMessage] = useState('');

  if (!open) return null;
  const handleSubmit = async (e) => {
    e.preventDefault();

    
    const errors = {};
    if (!formData.phone.match(/^(\+?\d{1,3}[- ]?)?\d{10}$/) && !formData.phone.match(/^\d{3}[- ]?\d{3}[- ]?\d{4}$/)) {
      errors.phone = 'Invalid phone number format. Expected 10 digits, or XXX-XXX-XXXX.';
    }
    
    
    if (!selectedTime) {
      errors.time = 'Please select a preferred time for your session.';
    }
    
    

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setStatus('idle'); 
      return;
    }
    setFormErrors({}); 

    setStatus('submitting');
    setErrorMessage('');

    try {
      let timeString = '00:00';
      if (selectedTime) {
        timeString = dayjs(selectedTime).format('HH:mm');
      }
      const API_BASE = import.meta.env.VITE_API_URL || '';
      const combinedDateTime = new Date(`${formData.preferredDate}T${timeString}`);
      const response = await fetch(`${API_BASE}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          preferredDate: combinedDateTime.toISOString(), 
          message: formData.message,
          planId: plan._id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setFormData({
          name: '',
          email: '',
          phone: '',
          preferredDate: '',
          preferredTime: '', 
          message: ''
        });
        setSelectedTime(null); 
      }, 2000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" style={{ overscrollBehavior: 'contain' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-neutral-800 rounded-xl w-full max-w-xl overflow-hidden"
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

        {/* Make the form scrollable and set a max height */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-neutral-800" style={{ overscrollBehavior: 'contain' }}>
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
          </div>          <div className="mt-2">
            <div className="flex items-center mb-2">
              <FaClock className="text-amber-500 mr-2" />
              <label className="text-sm font-medium text-neutral-300">
                Preferred Time
              </label>
              {formErrors.time && <p className="text-red-500 text-xs ml-auto">{formErrors.time}</p>}
            </div>
            
            <div className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-700 shadow-lg time-picker-container">
              <ThemeProvider theme={darkTheme}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <StaticTimePicker
                    ampm={true} 
                    value={selectedTime}
                    onChange={(newTime) => {
                      setSelectedTime(newTime);
                      if (formErrors.time) {
                        setFormErrors({...formErrors, time: null});
                      }
                    }}
                    disabled={status === 'submitting' || status === 'success'}
                    displayStaticWrapperAs="desktop" 
                                                    
                    slotProps={{
                      toolbar: {
                        
                        hidden: false, 
                      },
                      actionBar: {
                        actions: [], 
                      },
                    }}
                    sx={{
                        
                        width: '100%', 
                        '& .MuiDialogActions-root': {
                            
                        },
                        '& .MuiPickersToolbar-root': {
                            
                        },
                        '& .MuiClock-root': {
                            
                        },
                        
                    }}
                  />
                </LocalizationProvider>
              </ThemeProvider>
            </div>
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
