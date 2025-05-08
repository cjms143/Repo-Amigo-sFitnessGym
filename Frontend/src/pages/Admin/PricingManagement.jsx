import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaCheck, FaSort, FaDumbbell, FaCrown, FaUsers, FaHeart, FaStar, FaRunning } from 'react-icons/fa';
import { GiGymBag, GiWeightLiftingUp } from 'react-icons/gi';
import { MdSportsGymnastics } from 'react-icons/md';
import { BiDrink } from 'react-icons/bi';
import { toast } from 'react-hot-toast';
import PlanCard from '../../components/pricingmanagecomponents/PlanCard';
import PlanFormModal from '../../components/pricingmanagecomponents/PlanFormModal';

function PricingManagement() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [sortBy, setSortBy] = useState('price'); // 'price' or 'title'
  const [filterActive, setFilterActive] = useState('all'); // 'all', 'active', 'inactive'
  const [searchTerm, setSearchTerm] = useState(''); // New state for search
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'monthly', // Default type
    price: 0, // Single price field
    features: [],
    isPopular: false,
    availability: 'always',
    active: true,
    termsAndConditions: '',
    metadata: {
      views: 0,
      subscriptions: 0,
      conversionRate: 0
    }
  });

  const featureCategories = [
    { value: 'basic', label: 'Basic', icon: FaCheck },
    { value: 'facility', label: 'Facility', icon: GiGymBag },
    { value: 'class', label: 'Class', icon: MdSportsGymnastics },
    { value: 'trainer', label: 'Trainer', icon: FaUsers },
    { value: 'equipment', label: 'Equipment', icon: GiWeightLiftingUp },
    { value: 'cardio', label: 'Cardio', icon: FaRunning },
    { value: 'strength', label: 'Strength', icon: FaDumbbell },
    { value: 'wellness', label: 'Wellness', icon: FaHeart },
    { value: 'nutrition', label: 'Nutrition', icon: BiDrink },
    { value: 'extra', label: 'Extra', icon: FaStar }
  ];

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/pricing/plans', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch plans');
      }
      
      const data = await response.json();
      setPlans(Array.isArray(data) ? data : []); // Ensure plans is always an array
      setLoading(false);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error(error.message || 'Failed to load pricing plans');
      setLoading(false);
    }
  };

  const handleSubmit = async (e, submittedData) => {
    e.preventDefault();
    const dataToSend = { ...submittedData }; 
    console.log("[PricingManagement] Submitting plan with title:", dataToSend.title);

    try {
      const url = editingPlan
        ? `/api/pricing/plans/${editingPlan._id}`
        : '/api/pricing/plans';

      const response = await fetch(url, {
        method: editingPlan ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...dataToSend,
          features: dataToSend.features.map(feature => ({
            text: feature.text,
            category: feature.category,
            highlight: feature.highlight,
            description: feature.description
          }))
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        const err = new Error(errorData.message || 'Failed to save plan');
        err.data = errorData; // Attach full error data from backend
        throw err;
      }

      toast.success(`Plan ${editingPlan ? 'updated' : 'created'} successfully`);
      setIsModalOpen(false);
      setEditingPlan(null);
      resetForm();
      fetchPlans();
    } catch (error) {
      console.error('Frontend Error saving plan (raw error object):', error);
      let detailedMessage = 'Failed to save plan. Please check console for details.'; // Default generic
      let backendErrorDetailsLog = 'No specific backend error details available for logging.';

      if (error.data) { // error.data is the parsed JSON from backend response
        console.error('Frontend: Parsed backend error data (error.data):', error.data);
        detailedMessage = error.data.message || error.message || 'Failed to save plan.'; // Use backend's primary message

        // Attempt to get more specific conflict information for logging and potentially for the user
        if (error.data.error) { // This is the raw error.message from backend's catch block (e.g., MongoDB's E11000 string)
            backendErrorDetailsLog = `Backend technical error: ${error.data.error}`;
            console.error('Frontend: Backend raw error message (error.data.error):', error.data.error);

            // If it's a duplicate key error, make the user message more specific
            if (error.data.error.includes('E11000')) {
                detailedMessage = 'Error: A plan with this title (or other unique field) likely already exists. The backend logs will have the exact field.';
                // Try to extract the duplicate key from the raw message for better logging
                const match = error.data.error.match(/dup key: ({.*?})/);
                if (match && match[1]) {
                    backendErrorDetailsLog += ` Conflicting key from raw message: ${match[1]}`;
                    console.error('Frontend: Extracted duplicate key from raw message:', match[1]);
                }
            }
        }

        // This was the previous logic for keyValue, which gave {name: null}
        // We keep it for logging if it ever provides something else.
        if (error.data.keyValue && Object.keys(error.data.keyValue).length > 0) {
            console.error("Frontend: Backend conflict details (error.data.keyValue):", error.data.keyValue);
            if (error.data.keyValue.name !== null) { // Avoid showing "{name:null}" to user
                 detailedMessage += ` (Conflict on: ${JSON.stringify(error.data.keyValue)})`;
            }
        }

        // Specifically handle structured validation errors if they are present
        if (error.data.errors) {
            detailedMessage = `Validation Error: ${Object.values(error.data.errors).map(e_1 => e_1.message).join(', ')}`;
            backendErrorDetailsLog = `Validation errors: ${JSON.stringify(error.data.errors)}`;
        }

      } else {
        // If error.data is not present, use the general error.message from the fetch API or similar
        detailedMessage = error.message || 'An unexpected error occurred.';
        backendErrorDetailsLog = `General frontend error: ${error.toString()}`;
      }
      
      toast.error(detailedMessage);
      console.error(`User-facing toast message: ${detailedMessage}`);
      console.error(`Internal debugging details: ${backendErrorDetailsLog}`);
    }
  };

  const handleDelete = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/pricing/plans/${planId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete plan');
      }
      
      toast.success('Plan deleted successfully');
      fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error(error.message || 'Failed to delete plan');
    }
  };

  const togglePlanStatus = async (plan) => {
    try {
      const response = await fetch(`/api/pricing/plans/${plan._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...plan, // Send the whole plan object
          price: plan.price, // Ensure price is sent as a number
          active: !plan.active,
          features: plan.features.map(feature => ({
            text: feature.text,
            category: feature.category,
            highlight: feature.highlight,
            description: feature.description // Ensure description is passed
          }))
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update plan status');
      }
      
      toast.success(`Plan ${!plan.active ? 'activated' : 'deactivated'} successfully`);
      fetchPlans();
    } catch (error) {
      console.error('Error updating plan status:', error);
      toast.error(error.message || 'Failed to update plan status');
    }
  };

  const editPlan = (plan) => {
    setEditingPlan(plan);
    setFormData({
      ...plan,
      price: plan.price || 0, // Ensure price is a number, default to 0 if undefined
      features: [...plan.features]
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'monthly',
      price: 0, // Reset single price field
      features: [],
      isPopular: false,
      availability: 'always',
      active: true,
      termsAndConditions: '',
      metadata: {
        views: 0,
        subscriptions: 0,
        conversionRate: 0
      }
    });
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, { text: '', category: 'basic', highlight: false }]
    }));
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const updateFeature = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => 
        i === index ? { ...feature, [field]: value } : feature
      )
    }));
  };

  const sortPlans = (plansToSort) => {
    if (!Array.isArray(plansToSort)) return [];
    return [...plansToSort].sort((a, b) => {
      if (sortBy === 'price') {
        // Sort by the single price field
        return (a.price || 0) - (b.price || 0); 
      }
      return a.title.localeCompare(b.title);
    });
  };

  const filterPlans = (plansToFilter) => {
    if (!Array.isArray(plansToFilter)) return [];
    let filtered = plansToFilter;
    if (filterActive !== 'all') {
      filtered = filtered.filter(plan => plan.active === (filterActive === 'active'));
    }
    if (searchTerm) {
      filtered = filtered.filter(plan => 
        plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-800 flex items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <FaDumbbell className="text-[#bfa14a] text-5xl mb-4 animate-bounce" />
          <div className="text-[#bfa14a] text-2xl font-semibold">Loading plans...</div>
          <p className="text-neutral-400 mt-2">Please wait while we fetch the latest pricing information.</p>
        </div>
      </div>
    );
  }

  const displayedPlans = filterPlans(sortPlans(plans));

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-800 p-4 md:p-8 text-neutral-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#bfa14a] to-[#E0C068]"
          >
            Pricing Dashboard
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center gap-3"
          >
            <input 
              type="text"
              placeholder="Search plans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-neutral-800/50 border border-neutral-700 text-white placeholder-neutral-500 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#bfa14a] transition-all duration-300 w-full sm:w-auto"
            />
            <button
              onClick={() => {
                resetForm();
                setEditingPlan(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#bfa14a] to-[#E0C068] text-neutral-900 rounded-lg
                hover:from-[#CDAC5A] hover:to-[#E0C068] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 w-full sm:w-auto justify-center"
            >
              <FaPlus /> Add New Plan
            </button>
          </motion.div>
        </div>

        {/* Filters and Sorters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap justify-start items-center gap-4 mb-8 p-4 bg-neutral-800/30 border border-neutral-700/50 rounded-xl shadow-sm"
        >
          <div className="flex items-center gap-2">
            <FaSort className="text-neutral-400" />
            <span className="text-neutral-300 text-sm font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-neutral-700/50 border border-neutral-600 text-white rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#bfa14a] transition-colors"
            >
              <option value="price">Price</option>
              <option value="title">Title</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <FaCheck className="text-neutral-400" />
            <span className="text-neutral-300 text-sm font-medium">Status:</span>
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="bg-neutral-700/50 border border-neutral-600 text-white rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#bfa14a] transition-colors"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </motion.div>

        {/* Analytics Summary */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
        >
          { [
            { title: 'Total Plans', value: plans.length, icon: <GiGymBag className="text-3xl" /> },
            { title: 'Active Plans', value: plans.filter(p => p.active).length, icon: <FaCheck className="text-3xl" /> },
            { title: 'Popular Plans', value: plans.filter(p => p.isPopular).length, icon: <FaCrown className="text-3xl" /> }
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
              className="bg-neutral-800/40 border border-neutral-700/60 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center gap-4"
            >
              <div className="p-3 bg-gradient-to-br from-[#bfa14a]/20 to-[#E0C068]/20 text-[#bfa14a] rounded-full">
                {item.icon}
              </div>
              <div>
                <h3 className="text-md font-medium text-neutral-300 mb-1">{item.title}</h3>
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#bfa14a] to-[#E0C068]">{item.value}</p>
              </div>
            </motion.div>
          )) }
        </motion.div>

        {/* Plans Grid */}
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedPlans.map((plan, index) => (
              <PlanCard 
                key={plan._id}
                plan={plan}
                index={index}
                onEdit={editPlan}
                onDelete={handleDelete}
                onToggleStatus={togglePlanStatus}
              />
            ))}
          </div>
        </AnimatePresence>
        {displayedPlans.length === 0 && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 text-neutral-500"
          >
            <FaDumbbell className="text-5xl mx-auto mb-4" />
            <p className="text-xl">No plans match your current filters.</p>
            <p>Try adjusting your search or filter criteria.</p>
          </motion.div>
        )}

        {/* Modal */}
        <PlanFormModal 
          isModalOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingPlan(null); // Ensure editing state is cleared
            resetForm(); // Ensure form data is cleared
          }}
          editingPlan={editingPlan}
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          addFeature={addFeature}
          removeFeature={removeFeature}
          updateFeature={updateFeature}
          featureCategories={featureCategories}
        />
      </div>
    </div>
  );
}

export default PricingManagement;