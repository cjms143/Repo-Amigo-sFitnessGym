import { motion } from 'framer-motion';
import { FaCheckCircle, FaStar, FaFileContract, FaChevronRight, FaMedal } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MAX_FEATURES_DISPLAY = 3;

function PricingComponent({ plan, index, onChoosePlan, onViewAllFeatures }) {
  if (!plan) {
    return null;
  }

  const isPopular = plan.isPopular;
    
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.6, 
        delay: index * 0.15, 
        ease: [0.22, 1, 0.36, 1] 
      }
    },
    hover: { 
      y: -5, 
      boxShadow: isPopular ? "0 20px 40px -12px rgba(251, 191, 36, 0.25)" : "0 20px 40px -12px rgba(0, 0, 0, 0.25)",
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (    <motion.div
      key={plan._id}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
      className={`relative flex flex-col rounded-2xl overflow-hidden max-w-sm w-[320px] group h-full
        backdrop-blur-sm
        ${isPopular 
          ? 'bg-gradient-to-br from-neutral-800 via-neutral-800 to-neutral-900 border border-amber-500/50 shadow-xl shadow-amber-500/20' 
          : 'bg-gradient-to-br from-neutral-800 via-neutral-800 to-neutral-900 border border-neutral-700/50 shadow-xl shadow-neutral-700/10'
        }
        transition-all duration-400 will-change-transform`}
    >
      {/* Glass Effect Top Border - Modern Touch */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${isPopular ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500' : 'bg-gradient-to-r from-neutral-600 via-neutral-500 to-neutral-700'} opacity-80`}></div>
        {/* Popular Badge - Modern Pill Style at the top of the card, not covering title */} 
      {isPopular && (
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="absolute top-0 left-0 right-0 flex justify-center z-10"
        >
          <div className="bg-gradient-to-r from-amber-500 to-amber-400 text-neutral-900 text-xs font-bold py-1.5 px-4 rounded-b-lg flex items-center shadow-lg translate-y-0">
            <FaMedal className="mr-1.5" size={12} />
            <span>POPULAR</span>
          </div>
        </motion.div>
      )}      <div className="p-8 pt-10 flex-grow flex flex-col"> {/* Added more top padding to accommodate the centered badge */}
        {/* Title & Type Section */}
        <div className="mb-4">
          <h3 className={`text-2xl font-bold tracking-tight ${isPopular ? 'text-amber-400' : 'text-white'}`}>{plan.title}</h3>
          <p className="text-neutral-400 text-sm mt-1.5 capitalize font-medium">{plan.type} Membership</p>
        </div>
        
        {/* Price Section with Modern Design */}
        <div className={`flex flex-col my-6 pb-6 relative ${isPopular ? 'border-b border-amber-500/20' : 'border-b border-neutral-700/30'}`}>
          <div className="flex items-baseline">
            <span className={`text-4xl font-extrabold tracking-tight ${isPopular ? 'bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent' : 'text-white'}`}>
              ₱{plan.price.toLocaleString()}
            </span>
            <span className="text-neutral-400 text-sm ml-2 font-medium">/{plan.type}</span>
          </div>
          
          {plan.description && (
            <p className="text-neutral-400 text-sm mt-4 leading-relaxed">
              {plan.description}
            </p>
          )}
          
          {/* Decorative Element */}
          {isPopular && (
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-amber-400 to-transparent"
            ></motion.div>
          )}
        </div>

        {/* Features Section - with improved styling */}
        <div className="mb-8 space-y-4 min-h-[140px]">
          {plan.features.slice(0, MAX_FEATURES_DISPLAY).map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + (idx * 0.1) }}
              className="flex items-center text-sm group"
            >
              <div className={`mr-3.5 flex-shrink-0 p-1.5 rounded-full ${feature.highlight ? (isPopular ? 'bg-amber-400/10' : 'bg-amber-400/10') : 'bg-green-500/10'}`}>
                {feature.highlight ? (
                  <FaStar className={`${isPopular ? 'text-amber-400' : 'text-amber-500'}`} size={13} />
                ) : (
                  <FaCheckCircle className="text-green-500" size={13} />
                )}
              </div>
              <span className={`${feature.highlight ? (isPopular ? 'text-amber-300 font-medium' : 'text-amber-400 font-medium') : 'text-neutral-300'} group-hover:text-white transition-colors duration-300`}>
                {feature.text}
              </span>
            </motion.div>
          ))}
          
          {plan.features.length > MAX_FEATURES_DISPLAY && (
            <button 
              onClick={() => onViewAllFeatures(plan.features, plan.title)}
              className="text-sm text-amber-500 hover:text-amber-300 transition-all duration-200 mt-3 font-medium flex items-center group"
            >
              <span className="relative">
                View all {plan.features.length} features
                <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-amber-500 group-hover:w-full transition-all duration-300"></span>
              </span>
              <motion.div 
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
                className="ml-2"
              >
                <FaChevronRight size={10} />
              </motion.div>
            </button>
          )}
          
          {plan.features.length === 0 && (
             <p className="text-neutral-500 text-sm italic">Key features will be listed here.</p>
          )}
        </div>

        {/* Terms and Conditions Display - Improved */}
        {plan.termsAndConditions && (
          <div className="mt-auto pt-4 border-t border-neutral-700/30">
            <div className="flex items-center text-xs text-neutral-500 hover:text-neutral-400 transition-colors duration-200 cursor-help">
              <FaFileContract className="mr-2 flex-shrink-0" size={13} />
              <span>Terms & Conditions Apply</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Button Section - Modernized */}
      <div className="px-8 pb-8 mt-auto">        <button
          onClick={() => onChoosePlan(plan)}
          className={`w-full text-center px-6 py-3.5 rounded-xl font-bold transition-all duration-300 ease-out transform hover:translate-y-[-2px] active:translate-y-[1px]
            ${isPopular 
              ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-neutral-900 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30' 
              : 'bg-gradient-to-r from-neutral-700 to-neutral-600 text-white shadow-lg shadow-black/20 hover:shadow-black/25 hover:from-neutral-600 hover:to-neutral-500'
            }
            focus:outline-none focus:ring-2 focus:ring-offset-2 ${isPopular ? 'focus:ring-amber-400 focus:ring-offset-neutral-900' : 'focus:ring-neutral-500 focus:ring-offset-neutral-900'}`}
        >
          Choose Plan
        </button>
      </div>
      
      {/* Subtle Card Bottom Glow Effect */}
      <div className={`absolute bottom-0 left-0 right-0 h-[80px] opacity-30 pointer-events-none
        ${isPopular 
          ? 'bg-gradient-to-t from-amber-500/20 to-transparent' 
          : 'bg-gradient-to-t from-neutral-600/10 to-transparent'}`}>
      </div>
    </motion.div>
  );
}

export default PricingComponent;