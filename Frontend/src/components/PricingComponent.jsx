import { motion } from 'framer-motion';
import { FaCheckCircle, FaStar, FaFileContract, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MAX_FEATURES_DISPLAY = 3;

function PricingComponent({ plan, index, onChoosePlan, onViewAllFeatures }) {
  if (!plan) {
    return null;
  }

  const isPopular = plan.isPopular;

  return (
    <motion.div
      key={plan._id}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative flex flex-col rounded-xl overflow-hidden border max-w-sm group h-full
        ${isPopular 
          ? 'border-amber-500 bg-neutral-800 shadow-xl shadow-amber-500/20' // Solid amber border for popular
          : 'border-neutral-700 bg-neutral-800 shadow-lg' // Standard card
        }
        transition-all duration-300 ease-in-out hover:shadow-2xl`}
    >
      {/* Popular Badge - Angled Banner Style */} 
      {isPopular && (
        <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none z-10">
          <div className="absolute top-5 right-[-28px] transform rotate-45 bg-amber-500 text-neutral-900 text-xs font-bold text-center py-1 w-[120px] shadow-sm">
            POPULAR
          </div>
        </div>
      )}

      <div className="p-6 flex-grow flex flex-col">
        <h3 className={`text-xl font-semibold mb-1 ${isPopular ? 'text-amber-400' : 'text-white'}`}>{plan.title}</h3>
        <p className="text-neutral-400 text-xs mb-3 capitalize">{plan.type} Membership</p>
        
        <div className="my-3 flex items-baseline">
          <span className={`text-3xl font-bold ${isPopular ? 'text-amber-400' : 'text-white'}`}>
            ₱{plan.price.toLocaleString()}
          </span>
          <span className="text-neutral-500 text-sm ml-1">/{plan.type}</span>
        </div>

        {plan.description && (
          <p className="text-neutral-400 text-sm mb-5 min-h-[80px] leading-relaxed">
            {plan.description} {/* Removed substring truncation */}
          </p>
        )}

        {/* Features Section - with min-height for consistency */}
        <div className="mb-5 space-y-2.5 min-h-[120px]"> {/* Increased min-h from 95px to 120px */}
          {plan.features.slice(0, MAX_FEATURES_DISPLAY).map((feature, idx) => (
            <div key={idx} className="flex items-center text-sm">
              {feature.highlight ? (
                <FaStar className={`mr-2.5 flex-shrink-0 ${isPopular ? 'text-amber-400' : 'text-amber-500'}`} size={14} />
              ) : (
                <FaCheckCircle className="text-green-500/80 mr-2.5 flex-shrink-0" size={14} />
              )}
              <span className={`${feature.highlight ? (isPopular ? 'text-amber-300' : 'text-amber-400') : 'text-neutral-300'}`}>
                {feature.text}
              </span>
            </div>
          ))}
          {plan.features.length > MAX_FEATURES_DISPLAY && (
            <button 
              onClick={() => onViewAllFeatures(plan.features, plan.title)}
              className="text-xs text-amber-500 hover:text-amber-400 transition-colors duration-200 mt-1.5 font-medium flex items-center"
            >
              View all {plan.features.length} features <FaChevronRight className="ml-1" size={10}/>
            </button>
          )}
          {plan.features.length === 0 && (
             <p className="text-neutral-500 text-xs italic">Key features will be listed here.</p>
          )}
        </div>

        {/* Terms and Conditions Display */}
        {plan.termsAndConditions && (
          <div className="mt-auto pt-4 border-t border-neutral-700/60">
            <div className="flex items-center text-xs text-neutral-500">
              <FaFileContract className="mr-2 flex-shrink-0" size={13} />
              <span>Terms & Conditions Apply</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Button Section */}
      <div className={`p-5 mt-auto ${isPopular ? 'bg-neutral-800' : 'bg-neutral-800'}`}> {/* Consistent bg for button area */} 
        <button
          onClick={() => onChoosePlan(plan)}
          className={`w-full text-center px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105
            ${isPopular 
              ? 'bg-amber-500 text-neutral-900 hover:bg-amber-400 shadow-md hover:shadow-amber-500/30' 
              : 'bg-neutral-700 text-neutral-200 hover:bg-neutral-600 shadow-sm'
            }
            focus:outline-none focus:ring-2 focus:ring-offset-2 ${isPopular ? 'focus:ring-amber-400 focus:ring-offset-neutral-800' : 'focus:ring-neutral-500 focus:ring-offset-neutral-800'}`}
        >
          Choose Plan
        </button>
      </div>
    </motion.div>
  );
}

export default PricingComponent;