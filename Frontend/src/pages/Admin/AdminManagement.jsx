import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrainers } from '../../context/TrainerContext';
import { FaStar, FaChartLine, FaUserCircle, FaTimes, FaUser, FaToggleOn } from 'react-icons/fa';
import TrainerList from '../../components/trainercomponents/TrainerList'; 
import TrainerForm from '../../components/trainercomponents/TrainerForm'; 

function AdminManagement() {
  const { allTrainers, addTrainer, updateTrainer, deleteTrainer, toggleTrainerStatus, loading, error } = useTrainers();
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialFormData = {
    name: '',
    email: '',
    phone: '',
    specialty: '',
    experience: '',
    qualifications: [],
    expertise: [],
    bio: '',
    schedule: '',
    img: '',
    socialMedia: {
      instagram: '',
      facebook: ''
      
    },
    active: true 
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState({});

  
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return !value?.trim() ? 'Name is required' : '';
      case 'email':
        if (!value?.trim()) return 'Email is required';
        return !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
          ? 'Invalid email address'
          : '';
      case 'phone':
         if (!value?.trim()) return 'Phone is required';
         
         return !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,10}$/.test(value)
           ? 'Invalid phone number format'
           : '';
      
      default:
        return '';
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setFormTouched(prev => ({ ...prev, [name]: true }));
    validateAndSetError(name, formData[name]);
  };

  const validateAndSetError = (name, value) => {
    const error = validateField(name, value);
    setFormErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const validateForm = () => {
    let hasErrors = false;
    const newErrors = {};
    const newTouched = {};

    
    const requiredFields = ['name', 'email', 'phone'];
    requiredFields.forEach(key => {
       newTouched[key] = true; 
       const error = validateField(key, formData[key]);
       if (error) {
         newErrors[key] = error;
         hasErrors = true;
       }
    });

    
    

    setFormTouched(newTouched);
    setFormErrors(newErrors);
    return !hasErrors; 
  };
  


  
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log("Form validation failed", formErrors);
      return; 
    }

    
    const dataToSubmit = {
      ...formData,
      expertise: Array.isArray(formData.expertise) ? formData.expertise : (formData.expertise || '').split(',').map(s => s.trim()).filter(Boolean)
    };


    if (editingTrainer) {
      updateTrainer(editingTrainer._id, dataToSubmit);
    } else {
      addTrainer(dataToSubmit);
    }
    resetFormAndCloseModal();
  };

  const handleEdit = (trainer) => {
    setEditingTrainer(trainer);
    
    setFormData({
      ...initialFormData, 
      ...trainer,
      qualifications: Array.isArray(trainer.qualifications) ? trainer.qualifications : [],
      expertise: Array.isArray(trainer.expertise) ? trainer.expertise : [],
      socialMedia: trainer.socialMedia || { instagram: '', facebook: '' }
    });
    setFormErrors({}); 
    setFormTouched({}); 
    setIsModalOpen(true);
  };

  const handleDelete = (trainerId) => {
    if (window.confirm('Are you sure you want to remove this trainer? This action cannot be undone.')) {
      deleteTrainer(trainerId);
    }
  };

  const handleAddNew = () => {
    setEditingTrainer(null);
    setFormData(initialFormData); 
    setFormErrors({});
    setFormTouched({});
    setIsModalOpen(true);
  };

  const resetFormAndCloseModal = () => {
    setEditingTrainer(null);
    setFormData(initialFormData);
    setFormErrors({});
    setFormTouched({});
    setIsModalOpen(false);
  };
  

  
  const activeTrainersCount = allTrainers?.filter(t => t.active).length || 0;
  const seniorTrainersCount = allTrainers?.filter(t => parseInt(t.experience) >= 5).length || 0;
  const totalExperience = allTrainers?.reduce((acc, curr) => acc + parseInt(curr.experience || 0), 0) || 0;
  const avgExperience = allTrainers?.length > 0 ? Math.round(totalExperience / allTrainers.length) : 0;


  return (
    <div className="min-h-screen bg-neutral-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-white mb-2"
            >
              Trainer <span className="text-[#bfa14a]">Management</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-neutral-400"
            >
              Manage your fitness team and track their performance
            </motion.p>
          </div>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddNew} 
            className="px-6 py-3 bg-[#bfa14a] text-neutral-900 rounded-xl font-semibold
              hover:bg-[#CDAC5A] transition-all duration-300 flex items-center gap-2"
          >
            <FaUserCircle />
            Add New Trainer
          </motion.button>
        </div>

        {/* Dashboard Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            { icon: FaUser, label: 'Total Trainers', value: allTrainers?.length || 0 },
            { icon: FaToggleOn, label: 'Active Trainers', value: activeTrainersCount },
            { icon: FaStar, label: 'Senior Trainers (5+ yrs)', value: seniorTrainersCount },
            { icon: FaChartLine, label: 'Avg Experience', value: `${avgExperience}y` }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-neutral-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/5
                hover:border-[#bfa14a]/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-neutral-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <span className="p-2 rounded-lg bg-[#bfa14a]/10 text-[#bfa14a]">
                  <stat.icon size={20} />
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Loading and Error States */}
         {loading && <p className="text-center text-[#bfa14a]">Loading trainers...</p>}
         {error && <p className="text-center text-red-500">Error loading trainers: {error}</p>}


        {/* Trainers Grid - Use TrainerList component */}
        {!loading && !error && (
          <TrainerList
            trainers={allTrainers}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={toggleTrainerStatus}
          />
        )}


        {/* Add/Edit Trainer Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-neutral-800 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-neutral-700/50"
              >
                {/* Modal Header */}
                <div className="p-5 border-b border-neutral-700 flex-shrink-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {editingTrainer ? 'Edit Trainer' : 'Add New Trainer'}
                      </h3>
                      <p className="text-sm text-neutral-400">
                        {editingTrainer
                          ? 'Update trainer information.'
                          : 'Fill in the details for the new trainer.'}
                      </p>
                    </div>
                    <button
                      onClick={resetFormAndCloseModal} 
                      className="text-neutral-400 hover:text-white transition-colors p-1 rounded-full hover:bg-neutral-700"
                      title="Close"
                    >
                      <FaTimes size={18} />
                    </button>
                  </div>
                </div>

                {/* Modal Content - Use TrainerForm component */}
                <TrainerForm
                  formData={formData}
                  setFormData={setFormData}
                  handleSubmit={handleSubmit}
                  resetForm={resetFormAndCloseModal} 
                  editingTrainer={editingTrainer}
                  errors={formErrors}
                  touched={formTouched}
                  handleBlur={handleBlur}
                  validateAndSetError={validateAndSetError} 
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AdminManagement;