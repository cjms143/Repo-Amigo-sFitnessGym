import { motion, AnimatePresence } from 'framer-motion';
import { FaCrown, FaCheck, FaTimes, FaDumbbell, FaRunning, FaUsers, FaHeart, FaStar } from 'react-icons/fa';
import { GiGymBag, GiWeightLiftingUp } from 'react-icons/gi';
import { MdSportsGymnastics } from 'react-icons/md';
import { BiDrink } from 'react-icons/bi';

function AllFeaturesModal({ open, onClose, features, planName }) {
  if (!open) return null;

  const getFeatureIcon = (category) => {
    switch (category) {
      case 'facility':
        return <GiGymBag className="w-4 h-4" />;
      case 'class':
        return <MdSportsGymnastics className="w-4 h-4" />;
      case 'trainer':
        return <FaUsers className="w-4 h-4" />;
      case 'equipment':
        return <GiWeightLiftingUp className="w-4 h-4" />;
      case 'cardio':
        return <FaRunning className="w-4 h-4" />;
      case 'strength':
        return <FaDumbbell className="w-4 h-4" />;
      case 'wellness':
        return <FaHeart className="w-4 h-4" />;
      case 'nutrition':
        return <BiDrink className="w-4 h-4" />;
      case 'extra':
        return <FaStar className="w-4 h-4" />;
      default:
        return <FaCheck className="w-4 h-4" />;
    }
  };

  const featuresByCategory = features.reduce((acc, feature) => {
    const category = feature.category || 'basic';
    if (!acc[category]) acc[category] = [];
    acc[category].push(feature);
    return acc;
  }, {});

  const categoryLabels = {
    basic: 'Basic Features',
    facility: 'Facility Access',
    class: 'Classes',
    trainer: 'Trainer Services',
    equipment: 'Equipment Access',
    cardio: 'Cardio Facilities',
    strength: 'Strength Training',
    wellness: 'Wellness Services',
    nutrition: 'Nutrition Services',
    extra: 'Additional Benefits'
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-neutral-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-neutral-700">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{planName}</h3>
                <p className="text-neutral-400">All included features and benefits</p>
              </div>
              <button
                onClick={onClose}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Features List */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {Object.entries(featuresByCategory).map(([category, features]) => (
              <div key={category} className="mb-8 last:mb-0">
                <h4 className="text-lg font-semibold text-[#bfa14a] mb-4 flex items-center gap-2">
                  {getFeatureIcon(category)}
                  {categoryLabels[category] || category}
                </h4>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-start gap-3 ${
                        feature.highlight ? 'text-[#bfa14a]' : 'text-neutral-300'
                      }`}
                    >
                      <div className={`mt-1 flex-shrink-0 rounded-full p-1.5 transition-colors ${
                        feature.highlight 
                          ? 'bg-gradient-to-r from-[#bfa14a] to-[#d4b65e] text-neutral-900' 
                          : 'bg-green-500/20 text-green-500'
                      }`}>
                        {getFeatureIcon(feature.category)}
                      </div>
                      <span>{feature.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-neutral-700">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-[#bfa14a] text-neutral-900 rounded-xl
                hover:bg-[#CDAC5A] transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default AllFeaturesModal;
